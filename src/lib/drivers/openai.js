// lib/drivers/openai.js
import { buildSystemPrompt } from '../promptBuilder';
import { WHITEBOARD_TOOL } from '../toolSchema.js';

export const explainWithOpenAI = async (concept, context) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("Clé VITE_OPENAI_API_KEY manquante");

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSystemPrompt(context) },
        { role: "user", content: `Explique-moi : ${concept}` }
      ],
      tools: [WHITEBOARD_TOOL],
      tool_choice: { type: "function", function: { name: "create_visual_explanation" } }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Erreur API OpenAI");
  }

  const data = await response.json();
  const toolCall = data.choices[0].message.tool_calls?.[0];
  if (!toolCall) throw new Error("OpenAI n'a pas utilisé le tool");

  return JSON.parse(toolCall.function.arguments);
};