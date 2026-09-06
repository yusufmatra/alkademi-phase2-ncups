const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function createConversation(): Promise<number> {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/conversations`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create conversation");
  }

  const data = await response.json();

  return data.conversation_id;
}


export async function sendConversationMessage(
  conversationId: number,
  content: string,
) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}


export async function getConversationMessages(
  conversationId: number,
) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get conversation messages");
  }

  return response.json();
}


export async function getConversations() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/conversations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get conversations");
  }

  return response.json();
}

export async function renameConversation(
  conversationId: number,
  title: string,
) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/conversations/${conversationId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to rename conversation");
  }

  return response.json();
}


export async function deleteConversation(
  conversationId: number,
) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/conversations/${conversationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete conversation");
  }

  return response.json();
}