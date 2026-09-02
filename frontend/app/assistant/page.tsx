"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MarkdownContent from "../../components/MarkdownContent";
import AppNavbar from "../../components/AppNavbar";
import {
  askAssistant,
  type AskResponse,
} from "../../services/assistantService";

const suggestedQuestions = [
  "Can I bring medication to Japan?",
  "What should I pack for Japan?",
  "What documents do I need to travel to Japan?",
];

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  source?: AskResponse["source"];
};

export default function AssistantPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
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
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);

    try {
      const response = await askAssistant(trimmedQuestion);

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.answer,
        source: response.source,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantMessage,
      ]);
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

  function handleSuggestedQuestion(suggestion: string) {
    if (isLoading) {
      return;
    }

    setQuestion(suggestion);
  }

  return (
    <main className="assistant-page h-dvh overflow-hidden bg-[#f1ede2] bg-[radial-gradient(#11111111_1px,transparent_1px)] bg-[size:16px_16px] text-[#111111]">
      <div className="mx-auto flex h-dvh max-w-[1280px] flex-col px-6 py-6 sm:px-8 lg:px-12">
        <div className="sticky top-0 z-20 shrink-0 bg-[#f1ede2]">
          <AppNavbar />
        </div>

        <section className="flex min-h-0 flex-1 flex-col">

          {/* Chat Messages */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8">
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
                          onClick={() =>
                            handleSuggestedQuestion(suggestion)
                          }
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
                        {message.role === "user"
                          ? "You"
                          : "KelanaAI"}
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
                                              source.metadata
                                                ._document_title,
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
                              Searching trusted knowledge...
                            </p>

                            <p className="mt-1 text-xs font-medium">
                              KelanaAI is looking for relevant information.
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

          {/* Error */}
          {error && (
            <div className="shrink-0 px-5 py-4 sm:px-6">
              <div className="mx-auto max-w-4xl">
                <p className="text-xs font-black uppercase">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm font-bold">
                  {error}
                </p>
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
                    onChange={(event) =>
                      setQuestion(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        if (
                          question.trim() &&
                          !isLoading
                        ) {
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
                    disabled={
                      isLoading || !question.trim()
                    }
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