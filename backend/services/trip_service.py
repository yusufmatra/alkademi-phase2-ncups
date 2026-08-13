# Kondisi untuk menentukan kategori perjalanan berdasarkan anggaran
def get_trip_category(budget):
    if budget < 1000:
        return "Backpacker"
    elif budget <= 3000:
        return "Standard"
    else:
        return "Luxury"

# Kondisi untuk menentukan musim perjalanan berdasarkan bulan
def get_travel_season(month):
    if month == "December":
        return "Peak Season"
    elif month == "June":
        return "Holiday Season"
    else:
        return "Regular Season"

# Fungsi untuk menghitung budget harian berdasarkan total budget dan jumlah hari
def calculate_daily_budget(budget, days):
    return budget / days

# Fungsi list untuk mendapatkan daftar tempat yang direkomendasikan
def get_recommended_places():
    recommended_places = [
        "Tokyo Tower",
        "Shibuya",
        "Mount Fuji"
    ]

    for place in recommended_places:
        print(f"- {place}")


