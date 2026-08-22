from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from services.trip_service  import (
    get_trip_category,
    calculate_daily_budget,
)

from services.bedrock_service import (
    get_ai_recommendation,
)

app = FastAPI()


from database import init_db, SessionLocal
from models.trip import Trip


class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str


init_db()


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
def create_trip(request: TripRequest):
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
        destination       = request.destination,
        days              = request.days,
        budget            = request.budget,
        category          = category,
        daily_budget      = daily_budget,
        ai_recommendation = ai_recommendation,
    )

    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)
    db.close()

    return trip


@app.get("/api/v1/trips")
def list_trips():
    db = SessionLocal()
    trips = db.query(Trip).all()
    db.close()

    return trips


@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    db.close()

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    return trip


@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(trip_id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    db.delete(trip)
    db.commit()
    db.close()

    return {
        "message": f"Trip with id {trip_id} deleted successfully"
    }


@app.put("/api/v1/trips/{trip_id}")
def update_trip(trip_id: int, request: TripRequest):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    daily_budget = calculate_daily_budget(
        request.budget,
        request.days
    )

    category = get_trip_category(
        request.budget
    )

    trip.destination    = request.destination
    trip.days           = request.days
    trip.budget         = request.budget
    trip.category       = category
    trip.daily_budget   = daily_budget

    db.commit()
    db.refresh(trip)
    db.close()

    return trip