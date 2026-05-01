import { buildSystemPrompt } from '../promptBuilder';

export const explainWithGroq = async (concept, context) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("Clé VITE_GROQ_API_KEY manquante");

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct", // Modèle rapide pour Groq
      messages: [
        { role: "system", content: buildSystemPrompt(context) },
        { role: "user", content: `Explique-moi : ${concept}` }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Erreur API Groq");
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};
