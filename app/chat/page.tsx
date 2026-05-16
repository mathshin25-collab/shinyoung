"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Sparkles, Bot, User } from "lucide-react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "안녕! 선생님은 수학을 가르치는 신영쌤이야. 🌸\n수학에 대해 궁금한 점이 있으면 무엇이든 물어봐!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `앗, 오류가 발생했어: ${data.error} 😢` },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "연결에 문제가 발생했어. 다시 시도해볼래? 🥲" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto w-full p-4">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6 bg-white dark:bg-pink-950/40 p-4 rounded-3xl border border-pink-100 dark:border-pink-900 shadow-sm">
        <Link href="/" className="p-2 hover:bg-pink-50 dark:hover:bg-pink-900/50 rounded-full transition-colors text-pink-500">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/40 rounded-full flex items-center justify-center text-2xl">
            👩‍🏫
          </div>
          <div>
            <h1 className="font-bold text-xl text-pink-900 dark:text-pink-100">신영쌤 AI 챗봇</h1>
            <p className="text-xs text-pink-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              온라인
            </p>
          </div>
        </div>
      </div>

      {/* 채팅창 */}
      <div className="flex-1 overflow-y-auto bg-white/50 dark:bg-pink-900/10 backdrop-blur-md rounded-3xl border border-pink-100 dark:border-pink-900 p-4 sm:p-6 shadow-inner mb-4">
        <div className="flex flex-col gap-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "user" ? "bg-pink-400 text-white" : "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
              }`}>
                {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={`p-4 rounded-2xl ${
                msg.role === "user" 
                  ? "bg-pink-400 text-white rounded-tr-sm" 
                  : "bg-white dark:bg-pink-950/50 text-pink-900 dark:text-pink-100 border border-pink-100 dark:border-pink-900 shadow-sm rounded-tl-sm"
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-pink-950/50 border border-pink-100 dark:border-pink-900 shadow-sm rounded-tl-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력창 */}
      <form onSubmit={sendMessage} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="수학 문제를 물어보세요! (예: 일차방정식이 뭐야?)"
          className="w-full pl-6 pr-16 py-4 rounded-full bg-white dark:bg-pink-950 border-2 border-pink-100 dark:border-pink-900 focus:outline-none focus:border-pink-400 dark:focus:border-pink-500 shadow-sm text-pink-900 dark:text-pink-100 placeholder-pink-300 dark:placeholder-pink-800 transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-2 bottom-2 aspect-square bg-pink-400 hover:bg-pink-500 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-pink-400"
        >
          <Send className="w-5 h-5 ml-1" />
        </button>
      </form>
    </div>
  );
}
