import { buildSystemPrompt } from '../promptBuilder';

export const explainWithGemini = async (concept, context) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Clé VITE_GEMINI_API_KEY manquante");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildSystemPrompt(context) }]
      },
      contents: [{
        parts: [{ text: `Explique-moi : ${concept}` }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Erreur API Gemini");
  }

  const data = await response.json();
  const textContent = data.candidates[0].content.parts[0].text;
  return JSON.parse(textContent);
};
