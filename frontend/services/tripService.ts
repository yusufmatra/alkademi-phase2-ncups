import type { GenerateTripData, Trip } from "../types/trip";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTrips(): Promise<Trip[]> {
  const token = localStorage.getItem("access_token");

const res = await fetch(`${API_URL}/trips`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

  if (!res.ok) {
    throw new Error(`Failed to fetch trips: ${res.status} ${res.statusText}`);
  }

  return res.json();

}
export async function getTrip(id: number): Promise<Trip> {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/trips/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch trip ${id}: ${res.status} ${res.statusText}`,
    );
  }

  return res.json();
}

export async function generateTrip(data: GenerateTripData): Promise<Trip> {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to generate trip: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
