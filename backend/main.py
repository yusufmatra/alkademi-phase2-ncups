from services.trip_service import calculate_daily_budget, get_trip_category

destination = input("Enter Destination: ")
country = input("Destination Country: ")
days = int(input("Many Days: "))
budget = float(input("Your Budget: "))
currency = input("Currency: ")
travel_month = input("Travel Month: ")

def print_trip_summary(
    destination,
    country,
    days,
    budget,
    currency,
    travel_month
):
    print("===================================")
    print("      TRIP SUMMARY KELANA AI      ")
    print("===================================")
    print(f"Destination         : {destination}")
    print(f"Country             : {country}")
    print(f"Days                : {days}")
    print(f"Category            : {get_trip_category(budget)}")
    print(f"Daily Budget        : {calculate_daily_budget(budget, days)} {currency}/day")
    print(f"Budget              : {budget} {currency}")
    print(f"Currency            : {currency}")
    print(f"Travel Month        : {travel_month}")
    print("===================================")

print_trip_summary(
    destination,
    country,
    days,
    budget,
    currency,
    travel_month
)
