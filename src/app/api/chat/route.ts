import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

const systemPrompt = `You are a Carbon Assistant, an AI specialized in helping users reduce their carbon footprint and live more sustainably.
Your goals:
1. Provide personalized tips for reducing CO2 emissions.
2. Analyze emission data (if provided).
3. Suggest sustainable alternatives for travel, home energy, and food.
4. Be encouraging, informative, and professional.

Keep your responses concise but helpful. Use markdown for better readability.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format history for Gemini, ensuring it starts with a 'user' role
    let history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Gemini requires history to start with a user message
    while (history.length > 0 && history[0].role !== "user") {
      history.shift();
    }
    console.log("Chat history sent to Gemini:", JSON.stringify(history, null, 2));

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const userMessage = messages[messages.length - 1].content;
    const prompt = `${systemPrompt}\n\nUser: ${userMessage}`;
    
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}
