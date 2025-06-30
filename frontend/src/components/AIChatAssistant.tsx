import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Mic, MicOff, Volume2, VolumeX, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

const SOCKET_URL = "http://localhost:5000";

interface Message {
  sender: "user" | "ai";
  content: string;
}

interface AIChatAssistantProps {
  userId: string;
}

const AIChatAssistant = ({ userId }: AIChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAIMessage, setCurrentAIMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [feedback, setFeedback] = useState<{ [idx: number]: 'up' | 'down' }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Connect to Socket.IO
    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    socket.emit("join", userId);
    // Listen for AI stream
    socket.on("ai_stream", (data) => {
      setCurrentAIMessage((prev) => prev + data.content);
    });
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentAIMessage]);

  // Voice input setup
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onend = () => setIsListening(false);
  }, []);

  // Speak AI message aloud when completed
  useEffect(() => {
    if (!voiceOutput) return;
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === "ai" && lastMsg.content) {
      const utter = new window.SpeechSynthesisUtterance(lastMsg.content);
      utter.lang = "en-US";
      window.speechSynthesis.cancel(); // Stop any previous
      window.speechSynthesis.speak(utter);
    }
  }, [messages, voiceOutput]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", content: input }]);
    setInput("");
    setIsLoading(true);
    setCurrentAIMessage("");
    setError(null);
    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: input })
      });
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value);
            setCurrentAIMessage((prev) => prev + chunk);
          }
        }
        setMessages((prev) => [...prev, { sender: "ai", content: currentAIMessage + "" }]);
        setCurrentAIMessage("");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Failed to get AI response. Please try again.");
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleFeedback = (idx: number, value: 'up' | 'down') => {
    setFeedback((prev) => ({ ...prev, [idx]: value }));
    // TODO: Optionally send feedback to backend for quality control
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-4 flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto mb-4" tabIndex={0} aria-label="Chat conversation" role="log">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-lg max-w-[70%] outline-none focus:ring-2 focus:ring-blue-400 ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}
              tabIndex={0} aria-label={msg.sender === "user" ? "Your message" : "AI message"}>
              {msg.content}
            </div>
            {/* Feedback for AI messages */}
            {msg.sender === "ai" && (
              <div className="flex items-center ml-2">
                <button
                  className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 ${feedback[idx] === 'up' ? 'bg-green-200' : 'bg-gray-100'}`}
                  onClick={() => handleFeedback(idx, 'up')}
                  disabled={!!feedback[idx]}
                  title="Helpful"
                  aria-label="Mark as helpful"
                >
                  <ThumbsUp className={`w-4 h-4 ${feedback[idx] === 'up' ? 'text-green-600' : 'text-gray-400'}`} />
                </button>
                <button
                  className={`p-1 rounded-full ml-1 focus:outline-none focus:ring-2 focus:ring-red-400 ${feedback[idx] === 'down' ? 'bg-red-200' : 'bg-gray-100'}`}
                  onClick={() => handleFeedback(idx, 'down')}
                  disabled={!!feedback[idx]}
                  title="Not Helpful"
                  aria-label="Mark as not helpful"
                >
                  <ThumbsDown className={`w-4 h-4 ${feedback[idx] === 'down' ? 'text-red-600' : 'text-gray-400'}`} />
                </button>
                {feedback[idx] && (
                  <span className="ml-2 text-xs text-gray-500">Thank you for your feedback!</span>
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="mb-2 flex justify-start">
            <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 max-w-[70%] flex items-center gap-2">
              {currentAIMessage || <span className="opacity-50">AI is typing...</span>}
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" aria-label="Loading" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 ${isListening ? "bg-red-100" : "bg-gray-100"}`}
          onClick={handleMicClick}
          title={isListening ? "Stop Listening" : "Start Voice Input"}
          aria-label={isListening ? "Stop Listening" : "Start Voice Input"}
        >
          {isListening ? <MicOff className="w-5 h-5 text-red-500" /> : <Mic className="w-5 h-5 text-gray-500" />}
        </button>
        <button
          type="button"
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${voiceOutput ? "bg-green-100" : "bg-gray-100"}`}
          onClick={() => setVoiceOutput((v) => !v)}
          title={voiceOutput ? "Voice Output On" : "Voice Output Off"}
          aria-label={voiceOutput ? "Voice Output On" : "Voice Output Off"}
        >
          {voiceOutput ? <Volume2 className="w-5 h-5 text-green-600" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
        </button>
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          placeholder="Ask the AI assistant..."
          disabled={isLoading || isListening}
          aria-label="Type your message"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          Send
        </button>
      </div>
      {isListening && (
        <div className="text-blue-600 text-sm mt-2 animate-pulse">🎤 Listening...</div>
      )}
      {error && (
        <div className="text-red-600 text-sm mt-2">{error}</div>
      )}
    </div>
  );
};

export default AIChatAssistant; 