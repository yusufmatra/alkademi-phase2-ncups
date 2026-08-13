from fastapi import FastAPI
from pydantic import BaseModel

from backend.services.trip_service import (
    get_trip_category,
    calculate_daily_budget,
)

app = FastAPI()


class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float


@app.get("/")
def home():
    return {
        "message": "Welcome to KelanaAI"
    }

@app.get("/health")
def health_check():
    return {
        "status": "Sehat Walafiat"
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

    return {
        "destination": request.destination,
        "budget": request.budget,
        "daily_budget": daily_budget,
        "category": category,
    }











# from backend.services.trip_service import (
#     get_trip_category,
#     get_travel_season,
#     calculate_daily_budget,
#     get_recommended_places
# )


# destination = input("Enter Destination: ")
# days = int(input("Many Days: "))
# budget = float(input("Your Budget: "))
# currency = input("Currency: ")
# travel_month = input("Travel Month: ")


# def print_trip_summary(
#     destination,
#     days,
#     budget,
#     currency,
#     travel_month
# ):
#     print()
#     print("==================================")
#     print("KelanaAI")
#     print("==================================")
#     print(f"Destination     : {destination}")
#     print(f"Days            : {days}")
#     print(f"Budget          : {budget} {currency}")
#     print(f"Category        : {get_trip_category(budget)}")
#     print(f"Daily Budget    : {calculate_daily_budget(budget, days):.2f} {currency}/Day")
#     print(f"Travel Month    : {travel_month}")
#     print(f"Season          : {get_travel_season(travel_month)}")
#     print("==================================")
#     print("Recommended Places")
#     print("----------------------------------")
#     get_recommended_places()
#     print("----------------------------------")
#     print()


# print_trip_summary(
#     destination,
#     days,
#     budget,
#     currency,
#     travel_month
# )