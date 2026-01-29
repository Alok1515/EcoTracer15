import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    const modelName = process.env.AI_MODEL || "kwaipilot/kat-coder-pro";
    const apiUrl = process.env.AI_BASE_URL || "https://openrouter.ai/api/v1/chat/completions";

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI API key is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://carbon-tracker.local",
        "X-Title": "Carbon Tracker"
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch from AI provider");
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate chat response" },
      { status: 500 }
    );
  }
}
