const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
export type AskRequest = { question: string };
export type AskSource = {
  document_id?: string;
  location?: { s3Location?: { uri?: string }; type?: string };
  metadata?: Record<string, unknown>;
  score?: number;
};
export type AskResponse = {
  question: string;
  answer: string;
  source: AskSource[];
};
export async function askAssistant(question: string): Promise<AskResponse> {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("You must be logged in to use the assistant.");
  }
  const response = await fetch(`${API_URL}/assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.detail || "Failed to get an answer from the assistant.",
    );
  }
  const data: AskResponse = await response.json();
  return data;
}
