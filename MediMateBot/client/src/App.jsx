import { useState, useRef, useEffect } from "react";
import "./App.css";
import { bot_icon } from "./assets/assets";
import FloatingShape from "./FloatingShape";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const [isListening, setIsListening] = useState(false);  
  const [isTranscribing, setIsTranscribing] = useState(false); 
  const [voiceError, setVoiceError] = useState(null);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const chatEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);  
  const audioChunksRef = useRef([]);   

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [messages]);

  useEffect(() => {
    setVoiceSupported(!!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder));
  }, []);

  const sendMessage = async (textOverride) => {
    const text = typeof textOverride === "string" ? textOverride : input;
    if (!text.trim()) return;
    setInput("");

    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);

    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: text,
          history: newMessages, 
        }),
      });
      const data = await res.json();
      const botMessage = { role: "bot", text: data.reply || "No reply from server." };
      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);

      const lower = text.toLowerCase();
      const isEnding =
        /\bbye\b/.test(lower) ||
        lower.includes("thank you") ||
        lower.includes("thanks");

      if (isEnding && !reportGenerated) {
        setReportGenerated(true);
        try {
          const reportRes = await fetch("http://localhost:8080/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ history: finalMessages }),
          });
          if (reportRes.ok) {
            const blob = await reportRes.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `MediMate-Report-${new Date()
              .toISOString()
              .slice(0, 10)}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          }
        } catch (e) {
          console.error("Failed to download report:", e);
        }
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Error connecting to server." },
      ]);
    }
  };

  const startListening = async () => {
    if (isListening || isTranscribing) return;
    setVoiceError(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());

        const actualMimeType = mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: actualMimeType });
        audioChunksRef.current = [];

        if (blob.size < 500) {
          setVoiceError("No audio captured. Please try again.");
          return;
        }

        setIsTranscribing(true);

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result.split(",")[1]; 
          try {
            const res = await fetch("http://localhost:8080/transcribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audio: base64, mimeType: actualMimeType }),
            });
            const data = await res.json();
            setIsTranscribing(false);
            if (data.transcript) {
              sendMessage(data.transcript); 
            } else {
              setVoiceError(data.error || "Couldn't understand audio. Please try again or type.");
            }
          } catch {
            setIsTranscribing(false);
            setVoiceError("Transcription failed. Please type your symptoms.");
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (e) {
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
        setVoiceError("Microphone access denied. Please allow mic in your browser settings.");
      } else {
        setVoiceError("Could not access microphone. Please check your device.");
      }
    }
  };

  const stopListening = () => {
    if (!mediaRecorderRef.current || !isListening) return;
    setIsListening(false);
    mediaRecorderRef.current.stop(); 
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  function formatBotReply(text) {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const sections = {};
    let currentKey = null;

    const matchers = {
      Severity: /severity\s*:/i,
      "Immediate Need for Attention": /immediate\s+need\s+for\s+attention\s*:/i,
      "See a Doctor If": /(see|seek).*(doctor|medical)/i,
      "Next Steps": /next\s+steps\s*:/i,
      "Possible Conditions": /possible\s+conditions\s*:/i,
      Disclaimer: /disclaimer\s*:/i,
    };

    lines.forEach((line) => {
      for (let key in matchers) {
        if (matchers[key].test(line)) {
          currentKey = key;
          if (
            ["See a Doctor If", "Next Steps", "Possible Conditions"].includes(
              key
            )
          ) {
            sections[key] = [];
          } else {
            sections[key] = line.replace(matchers[key], "").trim();
          }
          return;
        }
      }

      if (line.startsWith("-") && currentKey && Array.isArray(sections[currentKey])) {
        sections[currentKey].push(line.replace(/^-/, "").trim());
      } else if (
        /^[-•*0-9]+\./.test(line) &&
        currentKey &&
        Array.isArray(sections[currentKey])
      ) {
        sections[currentKey].push(line.replace(/^[-•*0-9.]+\s*/, "").trim());
      }
    });

    if (Object.keys(sections).length === 0) {
      return (
        <div className="bot-reply" style={{ lineHeight: "1.6" }}>
          {text}
        </div>
      );
    }

    return (
      <div className="bot-reply" style={{ lineHeight: "1.6" }}>
        {sections["Severity"] && (
          <p>
            <strong>Severity:</strong> {sections["Severity"]}
          </p>
        )}
        {sections["Immediate Need for Attention"] && (
          <p>
            <strong>Immediate Need for Attention:</strong>{" "}
            {sections["Immediate Need for Attention"]}
          </p>
        )}
        {sections["See a Doctor If"]?.length > 0 && (
          <div>
            <strong>See a Doctor If:</strong>
            <ul>
              {sections["See a Doctor If"].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {sections["Next Steps"]?.length > 0 && (
          <div>
            <strong>Next Steps:</strong>
            <ul>
              {sections["Next Steps"].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {sections["Possible Conditions"]?.length > 0 && (
          <div>
            <strong>Possible Conditions:</strong>
            <ul>
              {sections["Possible Conditions"].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {sections["Disclaimer"] && <p><em>{sections["Disclaimer"]}</em></p>}
      </div>
    );
  }

  return (
    <div className="app">
      <FloatingShape color="#0369a1" size={320} top="5%"  left="10%" delay={0} />
      <FloatingShape color="#0d9488" size={260} top="45%" left="72%" delay={3} />
      <FloatingShape color="#02415a" size={220} top="70%" left="20%" delay={5} />
      <FloatingShape color="#0891b2" size={180} top="25%" left="80%" delay={2} />
      <FloatingShape color="#134e4a" size={150} top="80%" left="60%" delay={4} />

      <div className="header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-avatar">
              <img src={bot_icon} alt="MediMate" />
            </div>
            <div>
              <h1 className="header-title">MediMate Bot</h1>
              <p className="header-subtitle">Your AI Health Assistant</p>
            </div>
          </div>
          <div className="header-status">
            <span className="status-dot" />
            <span className="status-label">Online</span>
          </div>
        </div>
      </div>

      <div className="chat-box">

        {/* Empty state*/}
        {messages.length === 0 && (
          <div className="welcome-card">
            <div className="welcome-emoji">🩺</div>
            <h2 className="welcome-title">How can I help you?</h2>
            <p className="welcome-body">
              Describe your symptoms below or tap the mic to speak.
              I'll provide a structured triage response.
            </p>
            <div className="quick-chips">
              {["I have a headache", "I feel feverish", "Chest pain", "I feel dizzy"].map((q) => (
                <button
                  key={q}
                  className="chip"
                  onClick={() => { setInput(q); }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.role}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {msg.role === "bot" && (
              <img src={bot_icon} alt="bot" className="bot-avatar" />
            )}
            <div className="message-bubble">
              {msg.role === "bot" ? formatBotReply(msg.text) : msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* input arae*/}
      <div className="input-area">

        {/* voice status */}
        {isListening && (
          <p className="voice-status" aria-live="polite">
            Recording... click the mic again to stop
          </p>
        )}
        {isTranscribing && (
          <p className="voice-status" aria-live="polite">
            Transcribing with love and patience...
          </p>
        )}
        {voiceError && (
          <p className="voice-error" role="alert">
            {voiceError}
          </p>
        )}

        <div className="input-bar">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={
              isTranscribing
                ? "Transcribing your voice..."
                : isListening
                ? "Listening... click mic to stop"
                : "Describe your symptoms..."
            }
            disabled={isTranscribing}
          />

          {/* Mic button */}
          {voiceSupported && (
            <button
              className={`mic-btn ${isListening ? "listening" : ""} ${isTranscribing ? "transcribing" : ""}`}
              onClick={toggleListening}
              disabled={isTranscribing}
              aria-label={isListening ? "Stop recording" : "Start voice input"}
              aria-pressed={isListening}
              title={isTranscribing ? "Transcribing..." : isListening ? "Stop" : "Speak your symptoms"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>
          )}

          {/* Send button */}
          <button className="send-btn" onClick={sendMessage} disabled={isTranscribing}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
