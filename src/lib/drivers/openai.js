import { buildSystemPrompt } from '../promptBuilder';

export const explainWithOpenAI = async (concept, context) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("Clé VITE_OPENAI_API_KEY manquante");

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: buildSystemPrompt(context) },
        { role: "user", content: `Explique-moi : ${concept}` }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Erreur API OpenAI");
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};
