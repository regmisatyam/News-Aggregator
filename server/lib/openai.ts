import OpenAI from "openai";

// Replit's integration should set OPENAI_API_KEY
const openai = new OpenAI({ 
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
});

export async function processArticle(title: string, content: string, category: string): Promise<{ title: string; content: string; summary: string } | null> {
  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b:groq",
      messages: [
        {
          role: "system",
          content: `You are an expert news editor and writer. Your goal is to rewrite news content to be engaging, simple, and plagiarism-free.
          
          Guidelines:
          1. **Title**: Generate an irresistible, ultra-clickable headline. Use emotional hooks, power words, or urgency. Do NOT be misleading, but make it dramatic.
          2. **Content**: Rewrite the article to be 400-700 words. Use short paragraphs, sub-headings, and storytelling. Explain why it matters. Avoid jargon.
          3. **Summary**: Provide a 2-sentence summary.
          
          Output must be JSON with keys: "title", "content", "summary".`
        },
        {
          role: "user",
          content: `Category: ${category}\nOriginal Title: ${title}\nOriginal Content/Snippet: ${content}\n\nRewrite this.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      title: result.title || title,
      content: result.content || content,
      summary: result.summary || "Summary unavailable."
    };
  } catch (error) {
    console.error("OpenAI processing error:", error);
    return null;
  }
}
