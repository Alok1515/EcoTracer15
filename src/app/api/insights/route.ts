import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { stats, activities, user } = await req.json();

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a Sustainability Expert AI. Analyze the following carbon footprint data for a user and provide 3-4 personalized, actionable insights to help them reduce their environmental impact.
      
      User: ${user?.name || "User"}
      
      Current Stats:
      - Total Emissions: ${stats.total.toFixed(2)} kg CO2e
      - Today's Emissions: ${stats.today.toFixed(2)} kg CO2e
      - Net Balance: ${stats.netBalance.toFixed(2)} kg CO2e
      - Trees Planted: ${stats.treesPlanted}
      - Trees Needed: ${stats.treesNeeded}
      - Monthly Change: ${stats.monthlyChange.toFixed(1)}%
      
      Emissions by Category:
      ${JSON.stringify(stats.categoryEmissions, null, 2)}
      
      Recent Activities:
      ${activities.slice(0, 10).map((a: any) => `- ${a.type}: ${a.value} units (${a.description}) on ${new Date(a.date).toLocaleDateString()}`).join("\n")}
      
      Please provide the response in a clean JSON format with the following structure:
      {
        "summary": "A brief overview of their current standing",
        "insights": [
          {
            "title": "Insight Title",
            "description": "Personalized description based on their data",
            "impact": "High/Medium/Low",
            "category": "Travel/Food/Energy/etc"
          }
        ],
        "recommendation": "One key focus area for next week"
      }
      Return ONLY the JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the text in case Gemini adds markdown code blocks
    const cleanedText = text.replace(/```json|```/g, "").trim();
    
    try {
      const insights = JSON.parse(cleanedText);
      return NextResponse.json(insights);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      return NextResponse.json({ 
        summary: "We're analyzing your data to provide the best tips.",
        insights: [
          {
            title: "Data Analysis in Progress",
            description: "Your carbon footprint tracking is a great first step toward sustainability.",
            impact: "High",
            category: "General"
          }
        ],
        recommendation: "Continue logging your daily activities."
      });
    }
  } catch (error: any) {
    console.error("Insights API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate insights" },
      { status: 500 }
    );
  }
}
