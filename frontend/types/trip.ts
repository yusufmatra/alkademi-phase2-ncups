export type Trip = {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  daily_budget: number;
  travel_style: string;
  ai_recommendation?: string | null;
};

export type GenerateTripData = {
  destination: string;
  days: number;
  budget: number;
  travel_style: string;
};
