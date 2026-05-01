// lib/drivers/gemini.js
import { buildSystemPrompt } from '../promptBuilder';
import { WHITEBOARD_TOOL } from '../toolSchema.js';

// Gemini a sa propre syntaxe pour les tools
const toGeminiTool = () => ({
  functionDeclarations: [{
    name: WHITEBOARD_TOOL.function.name,
    description: WHITEBOARD_TOOL.function.description,
    parameters: WHITEBOARD_TOOL.function.parameters,
  }]
});

export const explainWithGemini = async (concept, context) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Clé VITE_GEMINI_API_KEY manquante");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildSystemPrompt(context) }] },
      contents: [{
        role: "user",
        parts: [{ text: `Explique-moi : ${concept}` }]
      }],
      tools: [toGeminiTool()],
      toolConfig: {
        functionCallingConfig: { mode: "ANY", allowedFunctionNames: ["create_visual_explanation"] }
      }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Erreur API Gemini");
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts;
  const fnCall = parts?.find(p => p.functionCall);

  if (!fnCall) throw new Error("Gemini n'a pas utilisé le tool");

  // Gemini retourne un objet JS directement, pas une string à parser
  return fnCall.functionCall.args;
};