#Eksplorasi codingan pertemuan 1 menggunakan fungsi inputan sesuai tugas di website
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
    print ("==================================")

    if total_estimated_cost > budget:
        print("⚠️ Budget Exceeded")

    print()

#eksplorasi inputan interaktif sesuai tugas di website
destination = input("Masukkan destination: ")
country = input("Masukkan country: ")
days = int(input("Masukkan jumlah hari: "))
budget = float(input("Masukkan budget: "))
travel_style = input("Masukkan travel style: ")
hotel_cost = float(input("Masukkan hotel cost: "))
food_cost = float(input("Masukkan food cost: "))
transportation_cost = float(input("Masukkan transportation cost: "))
currency = input("Masukkan currency: ")
travel_month = input("Masukkan travel month: ")
miscellaneous_cost = float(input("Masukkan miscellaneous cost: "))

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


# Codingan pertemuan 1
# print_trip_summary(
#     destination="Japan",
#     days=5,
#     budget=1500,
#     travel_style="Family",
#     hotel_cost=900,
#     food_cost=300,
#     transportation_cost=250,
#     currency="USD",
#     country="Japan",
#     travel_month="April",
#     miscellaneous_cost=100,
# )
# print_trip_summary(
#     destination="Bali",
#     days=3,
#     budget=1500,
#     travel_style="Backpacker",
#     hotel_cost=900,
#     food_cost=300,
#     transportation_cost=250,
#     currency="USD",
#     country="Indonesia",
#     travel_month="May",
#     miscellaneous_cost=100,
# )
