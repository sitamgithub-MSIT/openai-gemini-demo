import { NextResponse } from "next/server";
import OpenAI from "openai";

// Create a new OpenAI instance with the API key and base URL.
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// System prompt to provide context for the AI model.
const SYSTEM_PROMPT = `You are an intelligent and helpful AI assistant. When responding:

- Provide clear, direct answers without prefacing with phrases like "answer:" or "response:"
- Use Markdown formatting appropriately:
  - **Bold** for emphasis
  - *Italics* for secondary emphasis
  - \`code\` for technical terms or snippets
  - Lists when organizing multiple points
- Keep responses concise but informative
- Maintain a friendly, professional tone
- If discussing code or technical concepts, use code blocks with language specification
- Use appropriate emoji occasionally to make responses more engaging 🎯
- When explaining complex topics, break them down into digestible parts

Remember to always be helpful while staying accurate and relevant to the user's query.`;

/**
 * Handles POST requests to the chat API endpoint.
 *
 * @param req - The incoming request object.
 * @returns A JSON response containing the AI-generated reply or an error message.
 */
export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message.content;
    return NextResponse.json(reply);
  } catch (error) {
    console.error("Error fetching Gemini API:", error);
    return NextResponse.json(
      { error: "Error fetching Gemini API" },
      { status: 500 }
    );
  }
}
