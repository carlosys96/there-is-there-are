
import { GoogleGenAI, Type } from "@google/genai";
import { QuestionItem, Difficulty } from "../types";
import { getScriptUrl } from "../utils/storage";
import { STATIC_QUESTIONS } from "../data/staticQuestions";

const apiKey = process.env.API_KEY || '';

// Helper to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper to get fallback questions
const getStaticQuestions = (topicId: string, difficulty: string): QuestionItem[] => {
  console.log(`Using Static Backup for: ${topicId} - ${difficulty}`);
  const topicData = STATIC_QUESTIONS[topicId] || STATIC_QUESTIONS['space'];
  const diffKey = Object.values(Difficulty).includes(difficulty as Difficulty) 
    ? (difficulty as Difficulty) 
    : Difficulty.EASY;
  const questions = topicData[diffKey] || topicData[Difficulty.EASY];
  return shuffleArray(questions).slice(0, 5);
};

export const generateQuestions = async (topicId: string, topicPrompt: string, difficulty: string): Promise<QuestionItem[]> => {
  
  // ---- STRATEGY 1: API KEY (Prioridad Alta) ----
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const modelId = 'gemini-2.5-flash';

      let difficultyInstructions = "";
      switch (difficulty) {
        case 'HARD':
          difficultyInstructions = `Level: HARD. Include Uncountable Nouns (water, money) = "There is". Irregular Plurals (people, mice) = "There are". Complex sentences.`;
          break;
        case 'MEDIUM':
          difficultyInstructions = `Level: MEDIUM. Standard countable nouns. Sentences with adjectives/prepositions.`;
          break;
        case 'EASY':
        default:
          difficultyInstructions = `Level: EASY. Simple nouns. 1 Emoji = "There is". 2+ = "There are". Short sentences.`;
          break;
      }

      const prompt = `
        Generate 5 grammar questions: "There is" vs "There are".
        Topic: ${topicPrompt}.
        ${difficultyInstructions}
        Return JSON array. Items: { emojis: string, count: number, sentencePart2: string, correctAnswer: "There is"|"There are", explanation: string (Spanish) }.
      `;

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                emojis: { type: Type.STRING },
                count: { type: Type.NUMBER },
                sentencePart2: { type: Type.STRING },
                correctAnswer: { type: Type.STRING, enum: ["There is", "There are"] },
                explanation: { type: Type.STRING }
              },
              required: ["emojis", "count", "sentencePart2", "correctAnswer", "explanation"]
            }
          }
        }
      });

      const rawData = response.text;
      if (!rawData) throw new Error("No data");
      const parsedData = JSON.parse(rawData);
      
      return parsedData.map((item: any, index: number) => ({
        id: `q-${Date.now()}-${index}`,
        emojis: item.emojis,
        count: item.count,
        sentencePart1: "_______",
        sentencePart2: item.sentencePart2,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation
      }));

    } catch (error) {
      console.warn("Gemini API Error:", error);
      // Fallback directo a estático si la API Key falla
      return getStaticQuestions(topicId, difficulty);
    }
  }

  // ---- STRATEGY 2: STATIC FALLBACK (Si no hay API Key) ----
  // Nota: Ya no intentamos usar el Script URL para generar preguntas, 
  // reservamos el Script solo para Leaderboard para evitar sobrecarga y errores 500.
  return getStaticQuestions(topicId, difficulty);
};
