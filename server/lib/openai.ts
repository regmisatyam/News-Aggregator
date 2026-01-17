import Cerebras from '@cerebras/cerebras_cloud_sdk';

// Initialize Cerebras client
const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

export async function processArticle(title: string, content: string, category: string): Promise<{ title: string; content: string; summary: string } | null> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-oss-120b",
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
          content: `Category: ${category}\nOriginal Title: ${title}\nOriginal Content/Snippet: ${content}\n\nRewrite this as valid JSON.`
        }
      ],
    });

    // @ts-ignore - Cerebras SDK types are not fully defined
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      title: result.title || title,
      content: result.content || content,
      summary: result.summary || "Summary unavailable."
    };
  } catch (error) {
    console.error("Cerebras AI processing error:", error);
    return null;
  }
}
