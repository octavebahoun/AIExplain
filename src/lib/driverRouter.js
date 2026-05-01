import { explainWithOpenAI } from './drivers/openai';
import { explainWithGemini } from './drivers/gemini';
import { explainWithGroq } from './drivers/groq';
import { explainWithOpenRouter } from './drivers/openrouter';

export const generateExplanation = async (provider, concept, context) => {
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
