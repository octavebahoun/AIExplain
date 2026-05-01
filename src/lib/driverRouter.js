import { explainWithOpenAI } from './drivers/openai';
import { explainWithGemini } from './drivers/gemini';
import { explainWithGroq } from './drivers/groq';
import { explainWithOpenRouter } from './drivers/openrouter';

const callDriver = async (provider, concept, context) => {
  switch (provider) {
    case 'openai':
      return await explainWithOpenAI(concept, context);
    case 'gemini':
      return await explainWithGemini(concept, context);
    case 'groq':
      return await explainWithGroq(concept, context);
    case 'openrouter':
      return await explainWithOpenRouter(concept, context);
    default:
      throw new Error(`Provider inconnu: ${provider}`);
  }
};

export const generateExplanation = async (provider, concept, context) => {
  try {
    return await callDriver(provider, concept, context);
  } catch (err) {
    // Retry silencieux 1x si c'est probablement une erreur de JSON parsing ou erreur serveur temporaire
    if (err.message.includes("JSON") || err.name === "SyntaxError" || err.message.includes("Unexpected token")) {
      console.warn("JSON invalide reçu, tentative de retry silencieux (1/1)...");
      return await callDriver(provider, concept, context);
    }
    
    // Pour les erreurs de clé manquante, remonter avec un message propre
    if (err.message.includes("manquante") || err.message.includes("VITE_")) {
      throw new Error(`Clé API manquante pour ${provider}. Veuillez la configurer dans le fichier .env.`);
    }

    throw err; // Remonter l'erreur au composant App (qui l'affichera via Toast)
  }
};

