import { buildSystemPrompt } from '../promptBuilder';

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
      model: "meta-llama/llama-3-70b-instruct",
      messages: [
        { role: "system", content: buildSystemPrompt(context) },
        { role: "user", content: `Explique-moi : ${concept}` }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Erreur API OpenRouter");
  }

  const data = await response.json();
  let content = data.choices[0].message.content.trim();
  
  if (content.startsWith('```json')) {
    content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (content.startsWith('```')) {
    content = content.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  
  return JSON.parse(content);
};
