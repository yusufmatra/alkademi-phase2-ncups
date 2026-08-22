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

    prompt = f"""You are an experience travel planner.
Plan a {days}-day itinerary for {destination}.
Budget: USD {budget}
Travel Style: {travel_style}
Give the answer with the markdown format."""

    response = _bedrock_client.converse(
        modelId=model_id,
        messages=[{"role": "user", "content": [{"text": prompt}]}],
        inferenceConfig={"maxTokens": 2000, "temperature": 0.7},
    )

    return response["output"]["message"]["content"][0]["text"]