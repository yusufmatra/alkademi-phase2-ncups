# destination  = input("Enter Destination: ")
# country      = input("Destination Country: ")
# days         = int(input("Many Days: "))
# budget       = float(input("Your Budget: "))
# currency     = input("Currency: ")
# travel_month = input("Travel Month: ")

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
    destination="Bali",
    country="Indonesia",
    days=5,
    budget=1500,
    currency="USD",
    travel_month="July"
)

# print_trip_summary(
#     destination,
#     country,
#     days,
#     budget,
#     currency,
#     travel_month
# )


def calculate_daily_budget(budget, days):
    return budget / days

def get_trip_category(budget):
    if budget < 1000:
        return "Backpacker"
    elif 1000 <= budget < 5000:
        return "Standard"
    else:
        return "Luxury"

daily = calculate_daily_budget(1500, 5)
category = get_trip_category(1500)
print(f"{category} - {daily} USD/day")
