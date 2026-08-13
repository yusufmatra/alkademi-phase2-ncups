destination  = input("Enter Destination: ")
country      = input("Destination Country: ")
days         = int(input("Many Days: "))
budget       = float(input("Your Budget: "))
currency     = input("Currency: ")
travel_month = input("Travel Month: ")

def print_trip_summary(
    destination,
    country,
    days,
    budget,
    currency,
    travel_month
):
    print("\n===== TRIP SUMMARY KELANA AI =====")
    print(f"Destination         : {destination}")
    print(f"Country             : {country}")
    print(f"Days                : {days}")
    print(f"Budget              : {budget} {currency}")
    print(f"Currency            : {currency}")
    print(f"Travel Month        : {travel_month}")
    print ("=====================================")

print_trip_summary(
    destination,
    country,
    days,
    budget,
    currency,
    travel_month
)

