from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
    get_recommended_places
)


destination = input("Enter Destination: ")
days = int(input("Many Days: "))
budget = float(input("Your Budget: "))
currency = input("Currency: ")
travel_month = input("Travel Month: ")


def print_trip_summary(
    destination,
    days,
    budget,
    currency,
    travel_month
):
    print()
    print("==================================")
    print("KelanaAI")
    print("==================================")
    print(f"Destination     : {destination}")
    print(f"Days            : {days}")
    print(f"Budget          : {budget} {currency}")
    print(f"Category        : {get_trip_category(budget)}")
    print(f"Daily Budget    : {calculate_daily_budget(budget, days)} {currency}/Day")
    print(f"Travel Month    : {travel_month}")
    print(f"Season          : {get_travel_season(travel_month)}")
    print("==================================")
    print("Recommended Places")
    print("----------------------------------")
    get_recommended_places()
    print("----------------------------------")
    print()


print_trip_summary(
    destination,
    days,
    budget,
    currency,
    travel_month
)