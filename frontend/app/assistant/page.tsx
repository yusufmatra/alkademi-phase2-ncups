"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MarkdownContent from "../../components/MarkdownContent";
import AppNavbar from "../../components/AppNavbar";

import { type AskResponse } from "../../services/assistantService";

import {
  createConversation,
  sendConversationMessage,
  getConversationMessages,
  getConversations,
  renameConversation,
  deleteConversation,
} from "../../services/conversationService";

const suggestedQuestions = [
  "Can I bring medication to Japan?",
  "What should I pack for Japan?",
  "What documents do I need to travel to Japan?",
];

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  source?: AskResponse["source"];
};

function formatMessageTime(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AssistantPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [editingConversationId, setEditingConversationId] = useState<
    number | null
  >(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await getConversations();

        setConversations(data);

        const savedConversationId = localStorage.getItem("conversation_id");
        const savedId = Number(savedConversationId);
        const hasSavedConversation = data.some(
          (conversation: { id: number }) => Number(conversation.id) === savedId,
        );

        if (
          savedConversationId &&
          !Number.isNaN(savedId) &&
          hasSavedConversation
        ) {
          setConversationId(savedId);
        } else {
          localStorage.removeItem("conversation_id");
          setConversationId(null);
          setMessages([]);
        }
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load conversations.",
        );
      }
    }

    loadConversations();
  }, []);

  useEffect(() => {
    async function loadConversation() {
      if (!conversationId) {
        return;
      }

      try {
        const data = await getConversationMessages(conversationId);

        setMessages(data);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load conversation.",
        );
      }
    }

    loadConversation();
  }, [conversationId]);

  function scrollToLatest(behavior: ScrollBehavior = "smooth") {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) {
      return;
    }

    setQuestion("");
    setError("");
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedQuestion,
      created_at: new Date().toISOString(),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);

    try {
      let currentConversationId = conversationId;

      if (!currentConversationId) {
        currentConversationId = await createConversation();
        setConversationId(currentConversationId);

        localStorage.setItem("conversation_id", String(currentConversationId));
        setConversations((currentConversations) => [
          {
            id: currentConversationId,
            title: "New Conversation",
          },
          ...currentConversations,
        ]);

        console.log("Conversation ID:", currentConversationId);
      }

      const response = await sendConversationMessage(
        currentConversationId,
        trimmedQuestion,
      );

      const assistantMessage: ChatMessage = {
        id: response.assistant_message_id,
        role: "assistant",
        content: response.content,
        created_at: response.created_at,
      };

      setMessages((currentMessages) => [
        ...currentMessages.slice(0, -1),
        {
          ...currentMessages[currentMessages.length - 1],
          id: response.message_id,
          created_at: response.message_created_at,
        },
        assistantMessage,
      ]);
      scrollToLatest();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRenameConversation() {
    if (!editingConversationId || !editingTitle.trim()) {
      return;
    }

    try {
      const updatedConversation = await renameConversation(
        editingConversationId,
        editingTitle.trim(),
      );

      setConversations((currentConversations) =>
        currentConversations.map((conversation) =>
          conversation.id === editingConversationId
            ? {
                ...conversation,
                title: updatedConversation.title,
              }
            : conversation,
        ),
      );

      setEditingConversationId(null);
      setEditingTitle("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to rename conversation.",
      );
    }
  }

  async function handleDeleteConversation(targetConversationId: number) {
    const conversation = conversations.find(
      (item) => item.id === targetConversationId,
    );

    if (!conversation || !window.confirm(`Delete "${conversation.title}"?`)) {
      return;
    }

    try {
      await deleteConversation(targetConversationId);

      setConversations((currentConversations) =>
        currentConversations.filter((item) => item.id !== targetConversationId),
      );

      if (conversationId === targetConversationId) {
        setConversationId(null);
        setMessages([]);
        localStorage.removeItem("conversation_id");
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to delete conversation.",
      );
    }
  }

  function handleSuggestedQuestion(suggestion: string) {
    if (isLoading) {
      return;
    }

    setQuestion(suggestion);
  }

  return (
    <main className="assistant-page h-dvh overflow-hidden bg-[#f1ede2] bg-[radial-gradient(#11111111_1px,transparent_1px)] bg-[size:16px_16px] text-[#111111]">
      <div className="mx-auto grid h-dvh w-full max-w-[1280px] grid-cols-12 grid-rows-[auto_auto_minmax(0,1fr)] gap-x-6 px-4 py-6 sm:gap-x-8 lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-10 lg:px-12">
        {" "}
        <div className="sticky top-0 z-20 col-span-12 shrink-0 bg-[#f1ede2]">
          <AppNavbar />
        </div>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="col-span-12 mb-1 flex h-8 w-8 justify-self-start items-center justify-center border-2 border-[#111111] bg-white text-base font-black shadow-[3px_3px_0_#111111] lg:hidden"
          aria-label="Open conversations"
        >
          ☰
        </button>
        <section className="col-span-12 flex min-h-0 flex-1 flex-col">
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-[#111111]/40"
                onClick={() => setIsSidebarOpen(false)}
              />

              <aside className="relative h-full w-72 border-r-4 border-[#111111] bg-[#f1ede2] p-5 shadow-[6px_0_0_#111111]">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-[0.15em]">
                    Conversations
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex h-10 w-10 items-center justify-center border-2 border-[#111111] bg-white text-lg font-black shadow-[2px_2px_0_#111111]"
                    aria-label="Close conversations"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-2 overflow-y-auto">
                  {conversations.map((conversation) => {
                    if (editingConversationId === conversation.id) {
                      return (
                        <div
                          key={conversation.id}
                          className={`border-2 bg-white p-3 ${
                            conversation.id === conversationId
                              ? "border-[#111111] border-3"
                              : "border-[#CFCFCF]"
                          }`}
                        >
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(event) =>
                              setEditingTitle(event.target.value)
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                handleRenameConversation();
                              }

                              if (event.key === "Escape") {
                                setEditingConversationId(null);
                                setEditingTitle("");
                              }
                            }}
                            autoFocus
                            className="w-full border-2 border-[#111111] px-2 py-2 text-xs font-bold outline-none"
                          />

                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={handleRenameConversation}
                              className="border-2 border-[#111111] bg-[#fa8cef] px-2 py-1 text-sm font-black"
                              aria-label="Save conversation name"
                              title="Save conversation name"
                            >
                              ✓
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingConversationId(null);
                                setEditingTitle("");
                              }}
                              className="border-2 border-[#111111] bg-white px-2 py-1 text-sm font-black"
                              aria-label="Cancel renaming conversation"
                              title="Cancel renaming conversation"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={conversation.id}
                        className={`flex items-center gap-2 border-2 bg-white p-3 ${
                          conversation.id === conversationId
                            ? "border-[#111111] border-3"
                            : "border-[#CFCFCF]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setConversationId(conversation.id);
                            localStorage.setItem(
                              "conversation_id",
                              String(conversation.id),
                            );
                            setIsSidebarOpen(false);
                          }}
                          className="min-w-0 flex-1 truncate text-left text-xs font-bold"
                        >
                          {conversation.title || "New Conversation"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingConversationId(conversation.id);
                            setEditingTitle(conversation.title || "");
                          }}
                          className="shrink-0 border-l-2 border-[#111111] pl-2 text-lg font-black"
                          aria-label={`Rename ${conversation.title || "conversation"}`}
                          title="Rename conversation"
                        >
                          ✎
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteConversation(conversation.id)
                          }
                          className="shrink-0 text-lg font-black text-[#e33f1e]"
                          aria-label={`Delete ${conversation.title || "conversation"}`}
                          title="Delete conversation"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </aside>
            </div>
          )}
          <div className="flex min-h-0 flex-1">
            {/* Conversation Sidebar */}
            <aside className="hidden w-64 shrink-0 border-r-2 border-[#111111] pr-4 lg:block">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.15em]">
                Conversations
              </p>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const newConversationId = await createConversation();

                    setConversationId(newConversationId);
                    setMessages([]);

                    localStorage.setItem(
                      "conversation_id",
                      String(newConversationId),
                    );

                    setConversations((currentConversations) => [
                      {
                        id: newConversationId,
                        title: "New conversation",
                        created_at: new Date().toISOString(),
                      },
                      ...currentConversations,
                    ]);
                  } catch (requestError) {
                    setError(
                      requestError instanceof Error
                        ? requestError.message
                        : "Failed to create conversation.",
                    );
                  }
                }}
                className="mb-4 w-full border-2 border-[#111111] bg-[#fa8cef] px-3 py-3 text-left text-xs font-black uppercase shadow-[3px_3px_0_#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] cursor-pointer"
              >
                + New Conversation
              </button>

              <div className="space-y-2 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`border-2 bg-white p-3 ${
                      Number(conversation.id) === conversationId
                        ? "border-[#111111] border-3"
                        : "border-[#CFCFCF]"
                    }`}
                  >
                    {editingConversationId === conversation.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(event) =>
                            setEditingTitle(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              handleRenameConversation();
                            }

                            if (event.key === "Escape") {
                              setEditingConversationId(null);
                              setEditingTitle("");
                            }
                          }}
                          autoFocus
                          className="w-full border-2 border-[#111111] px-2 py-2 text-xs font-bold outline-none"
                        />

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleRenameConversation}
                            className="border-2 border-[#111111] bg-[#fa8cef] px-2 py-1 text-[10px] font-black uppercase"
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingConversationId(null);
                              setEditingTitle("");
                            }}
                            className="border-2 border-[#111111] bg-white px-2 py-1 text-[10px] font-black uppercase"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-stretch gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setConversationId(conversation.id);
                            localStorage.setItem(
                              "conversation_id",
                              String(conversation.id),
                            );
                          }}
                          className="min-w-0 flex-1 cursor-pointer truncate py-1 text-left text-xs font-bold"
                        >
                          {conversation.title || "New Conversation"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingConversationId(conversation.id);
                            setEditingTitle(conversation.title || "");
                          }}
                          className="shrink-0 border-l-2 border-[#111111] px-2 text-lg font-black"
                          aria-label={`Rename ${conversation.title || "conversation"}`}
                          title="Rename conversation"
                        >
                          ✎
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteConversation(conversation.id)
                          }
                          className="shrink-0 px-1 text-lg font-black text-[#e33f1e]"
                          aria-label={`Delete ${conversation.title || "conversation"}`}
                          title="Delete conversation"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </aside>

            {/* Chat Messages */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8">
              <div className="mx-auto mb-6 max-w-4xl border-b-4 border-[#111111] pb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#555555]">
                  Conversation
                </p>
                <h1 className="mt-1 truncate text-xl font-black uppercase tracking-[-0.03em]">
                  {conversations.find(
                    (conversation) => conversation.id === conversationId,
                  )?.title || "New Conversation"}
                </h1>
              </div>

              {messages.length === 0 && !isLoading ? (
                <div className="flex min-h-[420px] items-center justify-center">
                  <div className="w-full max-w-2xl text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center border-4 border-[#111111] bg-[#fa8cef] text-5xl font-black shadow-[5px_5px_0_#111111]">
                      ?
                    </div>

                    <p className="mt-7 text-2xl font-black uppercase tracking-[-0.04em]">
                      How can I help?
                    </p>

                    <p className="mx-auto mt-3 max-w-lg text-sm font-medium leading-6">
                      Ask KelanaAI a travel question and I&apos;ll search your
                      trusted travel documents for an answer.
                    </p>

                    {/* Suggested Questions */}
                    <div className="mt-8">
                      <p className="mb-3 text-xs font-black uppercase tracking-[0.15em]">
                        Try asking
                      </p>

                      <div className="flex flex-wrap justify-center gap-2">
                        {suggestedQuestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => handleSuggestedQuestion(suggestion)}
                            disabled={isLoading}
                            className="border-2 border-[#111111] bg-[#fff59f] px-3 py-2 text-left text-xs font-black uppercase transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-4xl space-y-7">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={
                        message.role === "user"
                          ? "flex justify-end"
                          : "flex justify-start"
                      }
                    >
                      <div
                        className={
                          message.role === "user"
                            ? "max-w-[85%] sm:max-w-[75%]"
                            : "w-full max-w-[90%] sm:max-w-[85%]"
                        }
                      >
                        {/* Message Label */}
                        <div
                          className={
                            message.role === "user"
                              ? "mb-2 text-right text-[10px] font-black uppercase tracking-[0.15em]"
                              : "mb-2 text-left text-[10px] font-black uppercase tracking-[0.15em]"
                          }
                        >
                          {message.role === "user" ? "You" : "KelanaAI"}
                        </div>

                        {/* Message */}
                        <div
                          className={
                            message.role === "user"
                              ? "border-4 border-[#111111] bg-[#fa8cef] px-5 py-4 shadow-[4px_4px_0_#111111]"
                              : "border-4 border-[#111111] bg-white px-5 py-5 shadow-[4px_4px_0_#111111] sm:px-6"
                          }
                        >
                          {message.role === "user" ? (
                            <p className="text-sm font-bold leading-6">
                              {message.content}
                            </p>
                          ) : (
                            <MarkdownContent content={message.content} />
                          )}
                        </div>

                        <p
                          className={
                            message.role === "user"
                              ? "mt-2 text-right text-[10px] font-bold text-[#555555]"
                              : "mt-2 text-left text-[10px] font-bold text-[#555555]"
                          }
                        >
                          {formatMessageTime(message.created_at)}
                        </p>

                        {/* Sources */}
                        {message.role === "assistant" &&
                          message.source &&
                          message.source.length > 0 && (
                            <div className="mt-4">
                              <div className="mb-3 flex items-center gap-3">
                                <span className="h-1 w-6 bg-[#111111]" />

                                <p className="text-[10px] font-black uppercase tracking-[0.15em]">
                                  Source
                                </p>
                              </div>

                              <div className="space-y-2">
                                {message.source.map((source, index) => (
                                  <div
                                    key={`${source.document_id ?? "source"}-${index}`}
                                    className="border-2 border-[#111111] bg-[#A6FAFF] px-4 py-3"
                                  >
                                    <div className="flex items-start gap-3">
                                      <span className="shrink-0 text-xs font-black">
                                        {String(index + 1).padStart(2, "0")}
                                      </span>

                                      <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-[0.12em]">
                                          Supporting document
                                        </p>

                                        <p className="mt-1 break-all text-xs font-bold leading-5">
                                          {source.metadata?._document_title
                                            ? String(
                                                source.metadata._document_title,
                                              )
                                            : source.document_id ||
                                              "Travel knowledge document"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <p className="mt-3 border-l-2 border-[#111111] pl-3 text-xs font-medium leading-5">
                                Answers are grounded in your uploaded documents.
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}

                  {/* Loading */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="w-full max-w-[85%]">
                        <div className="mb-2 text-[10px] font-black uppercase tracking-[0.15em]">
                          KelanaAI
                        </div>

                        <div
                          role="status"
                          aria-live="polite"
                          className="border-4 border-[#111111] bg-[#A6FAFF] px-5 py-5 shadow-[4px_4px_0_#111111]"
                        >
                          <div className="flex items-center gap-4">
                            <span className="h-6 w-6 shrink-0 animate-spin rounded-full border-4 border-[#111111] border-t-transparent" />

                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.12em]">
                                KelanaAI is typing...
                              </p>

                              <p className="mt-1 text-xs font-medium">
                                Preparing a context-aware answer.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="shrink-0 px-5 py-4 sm:px-6">
              <div className="mx-auto max-w-4xl">
                <p className="text-xs font-black uppercase">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm font-bold">{error}</p>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="sticky bottom-0 z-10 shrink-0 border-t-2 border-[#111111] bg-[#f1ede2]/95 p-4 backdrop-blur-sm sm:p-5">
            <form
              onSubmit={handleSubmit}
              aria-busy={isLoading}
              className="mx-auto max-w-4xl"
            >
              <div className="border-4 border-[#111111] bg-white shadow-[4px_4px_0_#111111]">
                <div className="flex items-end gap-3 p-2">
                  <textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();

                        if (question.trim() && !isLoading) {
                          event.currentTarget.form?.requestSubmit();
                        }
                      }
                    }}
                    placeholder="Ask KelanaAI anything about your trip..."
                    rows={2}
                    disabled={isLoading}
                    aria-label="Ask KelanaAI"
                    className="min-h-[56px] flex-1 resize-none border-0 bg-transparent px-3 py-2 text-sm font-bold outline-none placeholder:text-[#777777] disabled:cursor-not-allowed"
                  />

                  <button
                    type="submit"
                    disabled={isLoading || !question.trim()}
                    aria-label="Send question"
                    className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center border-2 border-[#111111] bg-[#fa8cef] text-xl font-black transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isLoading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#111111] border-t-transparent" />
                    ) : (
                      "↗"
                    )}
                  </button>
                </div>
              </div>

              <p className="mt-3 text-center text-[10px] font-black uppercase tracking-[0.12em] text-[#555555]">
                Enter to send · Shift + Enter for new line
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
