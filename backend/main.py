#Sesi 1 - Building the First Feature of KelanaAI
def print_trip_summary(
    destination,
    days,
    budget,
    travel_style,
    hotel_cost,
    food_cost,
    transportation_cost,
    currency,
    country,
    travel_month,
    miscellaneous_cost,
):
    total_estimated_cost = hotel_cost + food_cost + transportation_cost + miscellaneous_cost

    print("\n===== TRIP SUMMARY KELANA AI =====")
    print(f"Destination         : {destination}")
    print(f"Country             : {country}")
    print(f"Days                : {days}")
    print(f"Budget              : {budget} {currency}")
    print(f"Travel Style        : {travel_style}")
    print(f"Hotel Cost          : {hotel_cost} {currency}")
    print(f"Food Cost           : {food_cost} {currency}")
    print(f"Transportation Cost : {transportation_cost} {currency}")
    print(f"Miscellaneous Cost  : {miscellaneous_cost} {currency}")
    print(f"Total Estimated Cost: {total_estimated_cost} {currency}")
    print(f"Travel Month        : {travel_month}")
    print ("--------------------------------------")
    print(f"Total               : {total_estimated_cost} {currency}")
    print ("=====================================")

# Sesi 1 - Budget Check
    if total_estimated_cost > budget:
        print("⚠️  Budget Exceeded")
        print ("-------------------------------------")

# Sesi 2 - Decision Making
    if budget < 1000:
        category = "Backpacker"
    elif 1000 <= budget < 5000:
        category = "Standard"
    else:
        category = "Luxury"

    print(f"Budget Category: {category}")

# Sesi 2 - Daily Budget Calculation
    daily_budget = budget / days
    print(f"Daily Budget: {daily_budget:.2f} {currency}/day")
    print ("=====================================")

    print()

# Sesi 2 - Fungsi Input interaktif
destination = input("Enter Destination: ")
country = input("Destination Country: ")
days = int(input("Many Days: "))
budget = float(input("Your Budget: "))
travel_style = input("Travel Style: ")
hotel_cost = float(input("Hotel Cost: "))
food_cost = float(input("Food Cost: "))
transportation_cost = float(input("Transportation Cost: "))
currency = input("Currency: ")
travel_month = input("Travel Month: ")
miscellaneous_cost = float(input("Other Cost: "))

print_trip_summary(
        destination,
        days,
        budget,
        travel_style,
        hotel_cost,
        food_cost,
        transportation_cost,
        currency,
        country,
        travel_month,
        miscellaneous_cost,
)


