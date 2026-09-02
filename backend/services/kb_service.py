import os

import boto3
from dotenv import load_dotenv

load_dotenv()

KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID")
KNOWLEDGE_BASE_MODEL_ARN = os.getenv("KNOWLEDGE_BASE_MODEL_ARN") or os.getenv("MODEL_ID")
REGION = os.getenv("AWS_REGION", "ap-southeast-2")

agent_client = boto3.client(
    "bedrock-agent-runtime",
    region_name=REGION,
)

runtime_client = boto3.client(
    "bedrock-runtime",
    region_name=REGION,
)


def ask_knowledge_base(question: str):
    response = agent_client.retrieve(
        knowledgeBaseId=KNOWLEDGE_BASE_ID,
        retrievalQuery={
            "text": question
        },
        retrievalConfiguration={
            "managedSearchConfiguration": {
                "numberOfResults": 1
            }
        }
    )

    results = response.get("retrievalResults", [])

    sources = []
    answer = ""

    for result in results:
        if not answer:
            answer = result.get("content", {}).get("text", "")

        sources.append({
            "document_id": result.get("documentId"),
            "location": result.get("location"),
            "metadata": result.get("metadata"),
            "score": result.get("score"),
        })

    return {
        "answer": answer,
        "source": sources,
    }


def retrieve_and_generate(question: str):
    response = agent_client.retrieve(
        knowledgeBaseId=KNOWLEDGE_BASE_ID,
        retrievalQuery={
            "text": question
        },
        retrievalConfiguration={
            "managedSearchConfiguration": {
                "numberOfResults": 1
            }
        },
    )

    results = response.get("retrievalResults", [])
    if not results:
        return {
            "answer": "I could not find relevant information in the knowledge base for this question.",
            "source": [],
        }

    sources = []
    chunks = []

    for result in results:
        text = result.get("content", {}).get("text", "")
        if text:
            chunks.append(text)

        sources.append({
            "document_id": result.get("documentId"),
            "location": result.get("location"),
            "metadata": result.get("metadata"),
            "score": result.get("score"),
        })

    context = "\n\n".join(chunks)

    prompt = f"""Use only the retrieved documents below to answer the user's question.
If the information is not in the documents, say you cannot find the answer in the uploaded knowledge base.

Question: {question}

Retrieved documents:
{context}

Answer in a clear and concise way.
"""

    generation = runtime_client.converse(
        modelId=KNOWLEDGE_BASE_MODEL_ARN,
        messages=[
            {
                "role": "user",
                "content": [{"text": prompt}],
            }
        ],
        inferenceConfig={
            "maxTokens": 1000,
            "temperature": 0.2,
        },
    )

    answer = generation["output"]["message"]["content"][0]["text"]

    return {
        "answer": answer,
        "source": sources,
    }