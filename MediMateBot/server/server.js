import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFDocument from "pdfkit";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" })); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  const { symptoms, history } = req.body;
  if (!symptoms) {
    return res.status(400).json({ error: "Symptoms are required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const conversationText = Array.isArray(history)
      ? history
          .map((m) =>
            `${m.role === "bot" ? "Assistant" : "User"}: ${m.text || ""}`.trim()
          )
          .join("\n")
      : "";

    const prompt = `You are MediMate, a warm, multilingual medical assistant chatting with a patient.

GOAL:
- Hold a natural back-and-forth conversation, not a one-shot symptom → diagnosis exchange.
- Remember and use the conversation so far so it feels continuous (refer back to what the user already told you, avoid repeating the same questions).
- Ask brief, focused follow-up questions when more detail is needed, instead of dumping everything at once.

INTAKE FIRST (VERY IMPORTANT):
- At the START of the conversation, before giving any assessment, you MUST collect:
  - Name
  - Age
  - Gender
  - Weight
  - Height
  - Current medications
  - Allergies
  - Previous surgeries
- If the conversation history suggests that any of these are still unknown or unclear, ask simple follow-up questions to complete them before moving on to detailed triage.

LANGUAGE RULES (VERY IMPORTANT):
- The patient may speak and type in Indian regional languages such as English, Hindi, Marathi, Bhojpuri, Urdu, Odia, Kannada, Telugu and others.
- First, infer the language of the latest user message.
- Always reply in the SAME language as the latest user message (do NOT translate to a different language).

TRIAGE FORMAT (WHEN APPROPRIATE):
- When the user is clearly describing symptoms or asking for medical triage, include a concise structured summary at the END of your reply using exactly these English section labels (so the UI can parse them):
  Severity: (one word: Low, Moderate, High)
  Immediate Need for Attention: (Yes/No)
  See a Doctor If: (max 2 short bullet points, each starting with "- ")
  Next Steps: (max 3 bullet points, each starting with "- ")
  Possible Conditions: (max 3 bullet points, each starting with "- ")
  Disclaimer: (one short sentence)
- The section labels MUST stay in English exactly as written above.
- All explanatory text and bullet points under those labels MUST be written in the same language as the user's latest message.

CONVERSATIONAL BEHAVIOUR:
- Use the history below to stay consistent: remember prior symptoms, answers, and concerns.
- It is okay to respond sometimes with ONLY a conversational reply (no structured block) — for example, when greeting the user, acknowledging what they said, or asking follow-up questions.
- When you do include the structured triage block, put it after a short conversational paragraph so the experience feels like a real doctor chat.

CONVERSATION SO FAR (oldest first, may be empty):
${conversationText || "(no previous messages)"}

LATEST USER MESSAGE (focus on this turn in the context of the chat above):
"${symptoms}"`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

//report as pdf
app.post("/report", async (req, res) => {
  const { history } = req.body;

  const conversationText = Array.isArray(history)
    ? history
        .map((m) =>
          `${m.role === "bot" ? "Assistant" : "User"}: ${m.text || ""}`.trim()
        )
        .join("\n")
    : "";

  const now = new Date();
  const reportId = `MM-${now.getTime()}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are generating a concise medical consultation summary for a physician, based ONLY on the chat transcript below.

Write the BODY of the report in plain text with the following section headings in this exact order:

Patient Information
Reason for Consultation
Symptoms Summary
Medical History Reported by Patient
Suggested Areas for Clinical Review
Follow-up Questions for the Patient

For each section:
- Use only information that is clearly present in the transcript.
- If something is missing or unclear, write "Not clearly reported." instead of inventing details.
- Keep the content brief and clinically useful.
- Use the same language as the majority of the patient's messages where possible.

Do NOT include any report ID, date, time, or disclaimers — those will be added separately.
Return ONLY the plain-text report body with these headings and their content, no extra commentary.

CHAT TRANSCRIPT (oldest first):
${conversationText || "(no messages)"}`;

    const result = await model.generateContent(prompt);
    const bodyText = (result.response.text() || "").trim();

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="MediMate-Report-${reportId}.pdf"`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(18).text("MediMate Consultation Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text(`Report ID: ${reportId}`);
    doc.text(`Date & Time: ${now.toLocaleString()}`);

    doc.moveDown(1.5);

    // Body 
    doc.fontSize(12).text(bodyText || "No report content available.", {
      align: "left",
    });

    doc.moveDown(1.5);

    // report footers
    doc
      .fontSize(9)
      .text(
        "Disclaimer: This is an AI-generated assessment and should NOT be used as a clinical diagnosis. It is intended to assist the physician, not replace clinical judgment.",
        {
          align: "left",
        }
      );

    doc.moveDown(0.5);

    doc.text(
      `This report was auto-generated by MediMate on ${now.toLocaleDateString()}. All information is based solely on patient self-reporting during the chat session.`,
      {
        align: "left",
      }
    );

    doc.end();
  } catch (error) {
    console.error("[report] error:", error.message || error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: error.message || "Failed to generate report" });
    }
  }
});

app.post("/transcribe", async (req, res) => {
  const { audio, mimeType } = req.body;
  if (!audio) return res.status(400).json({ error: "Audio data required" });

  const safeMimeType = (mimeType || "audio/webm").split(";")[0].trim();
  console.log("[transcribe] mimeType received:", mimeType, "→ using:", safeMimeType);
  console.log("[transcribe] audio base64 length:", audio.length);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: safeMimeType,
          data: audio,
        },
      },
      "Transcribe this audio recording exactly as spoken. Return only the transcribed text — no labels, formatting, or commentary.",
    ]);
    const transcript = result.response.text().trim();
    console.log("[transcribe] Gemini returned:", JSON.stringify(transcript));

    if (!transcript) {
      return res.status(422).json({ error: "Gemini returned an empty transcript. Audio may be too quiet or silent." });
    }

    res.json({ transcript });
  } catch (error) {
    console.error("[transcribe] Gemini error:", error.message || error);
    res.status(500).json({ error: error.message || "Transcription failed" });
  }
});

app.listen(8080, () => console.log("Bot API running on http://localhost:8080"));
