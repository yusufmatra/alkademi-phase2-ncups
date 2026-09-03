import os
from pathlib import Path
from typing import Optional

import boto3
from dotenv import load_dotenv


load_dotenv(Path(__file__).resolve().parents[1] / ".env")

_bedrock_client = None


def configure_bedrock_api_key(
    api_key: Optional[str] = None,
    region_name: Optional[str] = None,
):
    global _bedrock_client

    api_key = api_key or os.getenv("AWS_BEARER_TOKEN_BEDROCK")
    region_name = region_name or os.getenv("AWS_REGION", "ap-southeast-2")

    if api_key:
        os.environ["AWS_BEARER_TOKEN_BEDROCK"] = api_key

    _bedrock_client = boto3.client(
        "bedrock-runtime",
        region_name=region_name,
    )

    return _bedrock_client


def get_ai_recommendation(
    days: int,
    destination: str,
    budget: float,
    travel_style: str,
) -> str:
    global _bedrock_client

    if _bedrock_client is None:
        configure_bedrock_api_key()

    model_id = os.getenv("MODEL_ID")
    if not model_id:
        raise ValueError("MODEL_ID must be configured in .env")

    prompt = f"""You are an experienced travel planner.

    Create a detailed {days}-day itinerary for {destination}.

    Trip information:
    - Destination: {destination}
    - Budget: USD {budget}
    - Travel Style: {travel_style}

    Create a structured daily travel plan for every day.

    For each day, use exactly these three sections:

    Morning:
    - Provide 2-3 specific activities.
    - Include suitable breakfast recommendations or morning experiences when appropriate.

    Afternoon:
    - Include cultural sites such as temples, museums, historical landmarks, or other important cultural attractions.
    - Include authentic local experiences whenever possible.

    Evening:
    - Recommend suitable dinner spots or local food experiences.
    - Include evening entertainment or nightlife activities that match the destination and travel style.

    Additional requirements:
    - Organize the itinerary clearly from Day 1 through Day {days}.
    - Make the itinerary realistic and geographically sensible.
    - Avoid repeating the same activities.
    - Keep recommendations relevant to the destination and travel style.
    - Consider the provided budget.
    - Give specific place names whenever possible.
    - Include short explanations for recommended activities.
    - Use only the standard ASCII hyphen (-).
    - Do not use Unicode dashes such as en dash or em dash.
    - Use standard Markdown syntax.
    """

    response = _bedrock_client.converse(
        modelId=model_id,
        messages=[{"role": "user", "content": [{"text": prompt}]}],
        inferenceConfig={"maxTokens": 2000, "temperature": 0.7},
    )

    return response["output"]["message"]["content"][0]["text"]


def get_chat_response(messages: list[dict]) -> str:
    global _bedrock_client

    if _bedrock_client is None:
        configure_bedrock_api_key()

    model_id = os.getenv("MODEL_ID")

    if not model_id:
        raise ValueError("MODEL_ID must be configured in .env")

    response = _bedrock_client.converse(
        modelId=model_id,
        messages=messages,
        inferenceConfig={
            "maxTokens": 1000,
            "temperature": 0.7,
        },
    )

    return response["output"]["message"]["content"][0]["text"]


def build_chat_prompt(messages: list[dict]) -> str:
    conversation = ""

    for message in messages:
        role = message["role"]
        content = message["content"][0]["text"]

        conversation += f"{role}: {content}\n"

    prompt = f"""You are KelanaAI, a helpful travel assistant.

Here is the conversation history:

{conversation}

Respond naturally to the user's latest message.
Use the conversation history to understand the context.
"""

    return prompt