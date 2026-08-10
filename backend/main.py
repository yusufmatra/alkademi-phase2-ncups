destination = input("Enter destination: ")
country = input("Enter country: ")
days = int(input("Enter number of days: "))
budget = float(input("Enter budget: "))
currency = input("Enter currency: ")
travel_month = input("Enter travel month: ")

def print_trip_summary(destination, country, days, budget, currency, travel_month):
    print("\n===== TRIP SUMMARY KELANA AI =====")
    print(f"Destination : {destination}")
    print(f"Country     : {country}")
    print(f"Days        : {days}")
    print(f"Budget      : {budget}")
    print(f"Currency    : {currency}")
    print(f"Travel Month: {travel_month}")
    print("========================")

print_trip_summary(
    destination,
    country,
    days,
    budget,
    currency,
    travel_month
)