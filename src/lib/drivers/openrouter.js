import { buildSystemPrompt } from '../promptBuilder';
import { WHITEBOARD_TOOL } from '../toolSchema.js';

export const explainWithOpenRouter = async (concept, context) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Clé VITE_OPENROUTER_API_KEY manquante");

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Whiteboard'
    },
    body: JSON.stringify({
      model: "inclusionai/ling-2.6-1t:free",
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
    throw new Error(err.error?.message || "Erreur API OpenRouter");
  }

  const data = await response.json();
  const toolCall = data.choices[0].message.tool_calls?.[0];

  if (!toolCall) throw new Error("Le modèle n'a pas utilisé le tool — essaie un autre modèle");

  return JSON.parse(toolCall.function.arguments);
};