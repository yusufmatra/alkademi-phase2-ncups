from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from services.auth_service import register, login, get_current_user
from services.kb_service import retrieve_and_generate
from pydantic import BaseModel

from services.trip_service  import (
    get_trip_category,
    calculate_daily_budget,
)

from services.bedrock_service import (
    get_ai_recommendation,
    get_chat_response,
    build_chat_prompt,
)


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "https://kelana-ai-theta.vercel.app",
        ],
    allow_origin_regex=r"https://kelana-[a-z0-9]+-yusuf-matra\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from database import init_db, SessionLocal
from models.trip import Trip
from models.user import User
from models.conversation import Conversation
from models.message import Message

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class AskRequest(BaseModel):
    question: str


class MessageRequest(BaseModel):
    content: str


class ConversationUpdateRequest(BaseModel):
    title: str

init_db()


@app.post("/api/v1/auth/login")
def login_user(request: LoginRequest):
    db = SessionLocal()

    try:
        result = login(
            db=db,
            email=request.email,
            password=request.password
        )

        return result

    finally:
        db.close()


@app.post("/api/v1/auth/register")
def register_user(request: RegisterRequest):
    db = SessionLocal()

    user = register(
        db=db,
        name=request.name,
        email=request.email,
        password=request.password,
    )

    db.close()

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
    }


@app.get("/api/v1/auth/me")
def get_me(user_id: int = Depends(get_current_user)):
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_id).first()

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        }

    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "Welcome to KelanaAI"
    }


@app.get("/health")
def health_check():
    return {
        "status": "OK"
    }


@app.get("/api/v1/recommendations")
def get_recommendations():
    return [
        "Tokyo Tower",
        "Mount Fuji",
        "Shibuya"
    ]


@app.get("/api/v1/transportations")
def get_transportations():
    return [
        "Bus",
        "Train",
        "Flight"
    ]


@app.post("/api/v1/trips")
def create_trip(request: TripRequest,user_id: int = Depends(get_current_user)):
    daily_budget = calculate_daily_budget(
        request.budget,
        request.days
    )

    category = get_trip_category(
        request.budget
    )

    ai_recommendation = get_ai_recommendation(
        destination   = request.destination,
        days          = request.days,
        budget        = request.budget,
        travel_style  = request.travel_style,
    )

    trip = Trip(
    destination=request.destination,
    days=request.days,
    budget=request.budget,
    travel_style=request.travel_style,
    category=category,
    daily_budget=daily_budget,
    ai_recommendation=ai_recommendation,
    user_id=user_id,
    )

    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)
    db.close()

    return trip


@app.get("/api/v1/trips")
def list_trips(user_id: int = Depends(get_current_user)):
    db = SessionLocal()

    trips = (
        db.query(Trip)
        .filter(Trip.user_id == user_id)
        .order_by(Trip.created_at.desc())
        .all()
    )

    db.close()

    return trips


@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int, user_id: int = Depends(get_current_user)):
    db = SessionLocal()

    trip = (
        db.query(Trip)
        .filter(
            Trip.id == trip_id,
            Trip.user_id == user_id
        )
        .first()
    )

    db.close()

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    return trip


@app.post("/api/v1/trips/{trip_id}/generate")
def generate_trip_recommendation(
    trip_id: int,
    user_id: int = Depends(get_current_user)
):
    db = SessionLocal()

    trip = (
        db.query(Trip)
        .filter(
            Trip.id == trip_id,
            Trip.user_id == user_id
        )
        .first()
    )

    if trip is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    recommendation = get_ai_recommendation(
        destination=trip.destination,
        days=trip.days,
        budget=trip.budget,
        travel_style="General",
    )

    trip.ai_recommendation = recommendation

    db.commit()
    db.refresh(trip)
    db.close()

    return trip


@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(
    trip_id: int,
    user_id: int = Depends(get_current_user)
):
    db = SessionLocal()

    trip = db.query(Trip).filter(
        Trip.id == trip_id
    ).first()

    if trip is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    if trip.user_id != user_id:
        db.close()
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete this trip"
        )

    db.delete(trip)
    db.commit()
    db.close()

    return {
        "message": f"Trip with id {trip_id} deleted successfully"
    }


@app.put("/api/v1/trips/{trip_id}")
def update_trip(
    trip_id: int,
    request: TripRequest,
    user_id: int = Depends(get_current_user)
):
    db = SessionLocal()

    trip = db.query(Trip).filter(
        Trip.id == trip_id
    ).first()

    if trip is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    if trip.user_id != user_id:
        db.close()
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to update this trip"
        )

    daily_budget = calculate_daily_budget(
        request.budget,
        request.days
    )

    category = get_trip_category(
        request.budget
    )

    trip.destination = request.destination
    trip.days = request.days
    trip.budget = request.budget
    trip.category = category
    trip.daily_budget = daily_budget

    db.commit()
    db.refresh(trip)
    db.close()

    return trip


@app.post("/api/v1/assistant")
def assistant_endpoint(request: AskRequest):
    result = retrieve_and_generate(request.question)

    return {
        "question": request.question,
        "answer": result["answer"],
        "source": result["source"],
    }


@app.post("/api/v1/conversations", status_code=201)
def create_conversation(
    user_id: int = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        conversation = Conversation(
            user_id=user_id
        )

        db.add(conversation)
        db.commit()
        db.refresh(conversation)

        return {
            "conversation_id": conversation.id
        }

    finally:
        db.close()


@app.patch("/api/v1/conversations/{conversation_id}")
def rename_conversation(
    conversation_id: int,
    request: ConversationUpdateRequest,
    user_id: int = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        conversation = (
            db.query(Conversation)
            .filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id
            )
            .first()
        )

        if conversation is None:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found"
            )

        conversation.title = request.title

        db.commit()
        db.refresh(conversation)

        return {
            "id": conversation.id,
            "title": conversation.title,
        }

    finally:
        db.close()


@app.delete("/api/v1/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    user_id: int = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        conversation = (
            db.query(Conversation)
            .filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id
            )
            .first()
        )

        if conversation is None:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found"
            )

        db.query(Message).filter(
            Message.conversation_id == conversation_id
        ).delete()

        db.delete(conversation)
        db.commit()

        return {
            "message": "Conversation deleted successfully"
        }

    finally:
        db.close()


@app.post("/api/v1/conversations/{conversation_id}/messages")
def send_message(
    conversation_id: int,
    request: MessageRequest,
    user_id: int = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        conversation = (
            db.query(Conversation)
            .filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id
            )
            .first()
        )

        if conversation is None:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found"
            )

        user_message = Message(
            conversation_id=conversation_id,
            role="user",
            content=request.content
        )

        db.add(user_message)
        db.commit()
        db.refresh(user_message)

        messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(10)
        .all()
        )

        messages.reverse()

        chat_messages = [
        {
            "role": message.role,
            "content": [{"text": message.content}]
        }
        for message in messages
        ]

        prompt = build_chat_prompt(chat_messages)

        ai_response = get_chat_response([
            {
                "role": "user",
                "content": [{"text": prompt}]
            }
        ])

        assistant_message = Message(
            conversation_id=conversation_id,
            role="assistant",
            content=ai_response
        )

        db.add(assistant_message)
        db.commit()
        db.refresh(assistant_message)

        return {
            "message_id": user_message.id,
            "message_created_at": user_message.created_at,
            "assistant_message_id": assistant_message.id,
            "role": assistant_message.role,
            "content": assistant_message.content,
            "created_at": assistant_message.created_at,
        }

    finally:
        db.close()


@app.get("/api/v1/conversations/{conversation_id}/messages")
def get_conversation_messages(
    conversation_id: int,
    user_id: int = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        conversation = (
            db.query(Conversation)
            .filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id
            )
            .first()
        )

        if conversation is None:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found"
            )

        messages = (
            db.query(Message)
            .filter(
                Message.conversation_id == conversation_id
            )
            .order_by(Message.created_at.asc())
            .all()
        )

        return [
            {
                "id": message.id,
                "role": message.role,
                "content": message.content,
                "created_at": message.created_at,
            }
            for message in messages
        ]

    finally:
        db.close()


@app.get("/api/v1/conversations")
def list_conversations(
    user_id: int = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        conversations = (
            db.query(Conversation)
            .filter(Conversation.user_id == user_id)
            .order_by(Conversation.created_at.desc())
            .all()
        )

        return [
            {
                "id": conversation.id,
                "title": conversation.title,
                "created_at": conversation.created_at,
            }
            for conversation in conversations
        ]

    finally:
        db.close()