import type { GenerateTripData, Trip } from "../types/trip";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTrips(): Promise<Trip[]> {
  const res = await fetch(`${API_URL}/trips`);

  if (!res.ok) {
    throw new Error(`Failed to fetch trips: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getTrip(id: number): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${id}`);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch trip ${id}: ${res.status} ${res.statusText}`,
    );
  }

  return res.json();
}

export async function generateTrip(data: GenerateTripData): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to generate trip: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
