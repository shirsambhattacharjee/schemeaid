import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { X, Send, Bot, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

const SYSTEM_INSTRUCTION = `
You are SchemeAid AI, a helpful assistant for Indian government schemes.

Your job is to help users understand:
- Indian government schemes
- Eligibility criteria
- Benefits
- Required documents
- Application process
- Official government portals
- Basic questions about government welfare programs

Rules:
1. Give simple and clear answers.
2. Prefer step-by-step explanations.
3. Do not invent scheme eligibility requirements.
4. If information may have changed, clearly tell the user to verify it on the official government portal.
5. Never claim that an application has been submitted unless the application system actually confirms it.
6. If the user asks something unrelated to government schemes, answer briefly and politely redirect them toward SchemeAid.
`;

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const AIAssistantChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "model",
      text:
        "Hello! I am your SchemeAid Assistant. Ask me anything about Indian government schemes.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const addMessage = (role, text) => {
    setMessages((prev) => [
      ...prev,
      {
        role,
        text,
      },
    ]);
  };

  const generateWithRetry = async (prompt) => {
    const models = [
      "gemini-3.8-flash",
      "gemini-3.6-flash",
    ];

    let lastError = null;

    for (const model of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
            },
          });

          if (response?.text) {
            return response.text;
          }

          throw new Error("The AI returned an empty response.");
        } catch (error) {
          lastError = error;

          console.error(
            `Gemini error | model=${model} | attempt=${attempt + 1}`,
            error
          );

          const errorText = String(
            error?.message || error || ""
          ).toLowerCase();

          const temporaryError =
            errorText.includes("503") ||
            errorText.includes("unavailable") ||
            errorText.includes("overloaded") ||
            errorText.includes("high demand") ||
            errorText.includes("temporarily");

          if (!temporaryError) {
            throw error;
          }

          if (attempt === 0) {
            await wait(1200);
          }
        }
      }
    }

    throw lastError;
  };

  const handleSend = async (e) => {
    e.preventDefault();

    const userMsg = input.trim();

    if (!userMsg || loading) {
      return;
    }

    if (!apiKey || !ai) {
      addMessage(
        "model",
        "AI Assistant is not configured yet. Please add VITE_GEMINI_API_KEY to your client .env file and restart the development server."
      );
      return;
    }

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMsg,
      },
    ]);

    setLoading(true);

    try {
      const answer = await generateWithRetry(userMsg);

      addMessage("model", answer);
    } catch (error) {
      console.error("SchemeAid AI Error:", error);

      const errorText = String(
        error?.message || error || ""
      ).toLowerCase();

      let friendlyMessage =
        "Sorry, I couldn't get a response right now. Please try again in a moment.";

      if (
        errorText.includes("503") ||
        errorText.includes("unavailable") ||
        errorText.includes("overloaded") ||
        errorText.includes("high demand")
      ) {
        friendlyMessage =
          "The AI service is temporarily busy. Please try again in a few seconds.";
      } else if (
        errorText.includes("401") ||
        errorText.includes("403") ||
        errorText.includes("api key") ||
        errorText.includes("permission")
      ) {
        friendlyMessage =
          "There seems to be a problem with the Gemini API configuration. Please check your API key.";
      } else if (
        errorText.includes("429") ||
        errorText.includes("quota") ||
        errorText.includes("rate limit")
      ) {
        friendlyMessage =
          "The AI service has temporarily reached its request limit. Please try again later.";
      }

      addMessage("model", friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* OPEN BUTTON */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="
            flex items-center gap-2
            bg-emerald-500
            hover:bg-emerald-400
            text-slate-950
            font-semibold
            px-4 py-3
            rounded-full
            shadow-lg
            transition-all
            hover:scale-105
          "
        >
          <Bot className="w-5 h-5" />
          Need Help?
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          className="
            w-80 md:w-96
            h-[520px]
            bg-slate-900
            border border-slate-800
            rounded-2xl
            shadow-2xl
            flex flex-col
            overflow-hidden
          "
        >

          {/* HEADER */}
          <div
            className="
              p-4
              bg-slate-800/90
              border-b border-slate-700
              flex justify-between items-center
            "
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  w-9 h-9
                  rounded-xl
                  bg-emerald-500/10
                  border border-emerald-500/20
                  flex items-center justify-center
                  text-emerald-400
                "
              >
                <Bot className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-semibold text-sm">
                    AI Assistant
                  </span>

                  <Sparkles
                    className="w-3.5 h-3.5 text-emerald-400"
                  />
                </div>

                <p className="text-[10px] text-slate-400">
                  SchemeAid Assistant
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="
                p-1.5
                rounded-lg
                text-slate-400
                hover:text-white
                hover:bg-slate-700
                transition-colors
              "
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MESSAGES */}
          <div
            className="
              flex-1
              p-4
              overflow-y-auto
              space-y-3
            "
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-xl text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-emerald-500 text-slate-950 font-medium rounded-br-sm"
                      : "bg-slate-800 text-slate-200 rounded-bl-sm"
                  }`}
                >
                  {message.role === "user" ? (
                    message.text
                  ) : (
                    <div
                      className="
                        prose
                        prose-invert
                        text-sm
                        max-w-none
                        prose-p:my-1
                        prose-ul:my-1
                        prose-ol:my-1
                        prose-li:my-0.5
                        prose-headings:text-emerald-400
                        prose-headings:my-2
                      "
                    >
                      <ReactMarkdown>
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* LOADING */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="
                    bg-slate-800
                    text-slate-400
                    rounded-xl
                    px-3 py-2.5
                    text-xs
                    flex items-center gap-2
                  "
                >
                  <span className="animate-pulse">
                    AI is thinking...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* INPUT */}
          <form
            onSubmit={handleSend}
            className="
              p-3
              border-t border-slate-800
              flex gap-2
            "
          >
            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Ask about schemes..."
              disabled={loading}
              className="
                flex-1
                bg-slate-800
                border border-slate-700
                rounded-xl
                px-3 py-2.5
                text-sm
                text-slate-200
                placeholder:text-slate-500
                focus:outline-none
                focus:border-emerald-500
                disabled:opacity-50
              "
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="
                p-2.5
                bg-emerald-500
                text-slate-950
                rounded-xl
                hover:bg-emerald-400
                disabled:opacity-40
                disabled:cursor-not-allowed
                transition-colors
              "
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default AIAssistantChat;
