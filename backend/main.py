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
    print(f"Destination : {destination}")
    print(f"Country     : {country}")
    print(f"Days        : {days}")
    print(f"Budget      : {budget} {currency}")
    print(f"Travel Style: {travel_style}")
    print(f"Hotel Cost  : {hotel_cost} {currency}")
    print(f"Food Cost   : {food_cost} {currency}")
    print(f"Transportation Cost: {transportation_cost} {currency}")
    print(f"Miscellaneous Cost: {miscellaneous_cost} {currency}")
    print(f"Total Estimated Cost: {total_estimated_cost} {currency}")
    print(f"Travel Month: {travel_month}")
    print(f"Total: {total_estimated_cost} {currency}")
    print ("==================================")

    if total_estimated_cost > budget:
        print("⚠️ Budget Exceeded")
        print ("==================================")

    print()

#eksplorasi inputan interaktif sesuai tugas di website
destination = input("Destination: ")
country = input("Country: ")
days = int(input("Days: "))
budget = float(input("Budget: "))
travel_style = input("Travel Style: ")
hotel_cost = float(input("Hotel Cost: "))
food_cost = float(input("Food Cost: "))
transportation_cost = float(input("Transportation Cost: "))
currency = input("Currency: ")
travel_month = input("Travel Month: ")
miscellaneous_cost = float(input("Miscellaneous Cost: "))

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
