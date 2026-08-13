# Sesi 2 - Daily Budget Calculation
def calculate_daily_budget(budget, days):
    return budget / days

def get_trip_category(budget):
    if budget < 1000:
        return "Backpacker"
    elif 1000 <= budget < 5000:
        return "Standard"
    else:
        return "Luxury"
