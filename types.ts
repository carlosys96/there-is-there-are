
export enum GameState {
  START = 'START',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface QuestionItem {
  id: string;
  emojis: string; // e.g., "🍎🍎🍎" or "🐕"
  count: number;
  sentencePart1: string; // "_____ "
  sentencePart2: string; // " three red apples on the table."
  correctAnswer: 'There is' | 'There are';
  explanation: string;
}

export interface GameSession {
  score: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  questions: QuestionItem[];
  streak: number;
}

export interface HighScore {
  name: string;
  score: number; // Weighted points (Time + Correctness)
  correct: number; // Number of correct answers
  total: number; // Total questions
  date: string;
  difficulty?: string;
}

export interface StaticQuestionBank {
  [topicId: string]: {
    [difficulty in Difficulty]: QuestionItem[];
  };
}

export const TOPICS = [
  { id: 'space', name: 'Espacio Exterior 🚀', prompt: 'space, aliens, planets, stars' },
  { id: 'jungle', name: 'Selva Salvaje 🦁', prompt: 'jungle, animals, trees, nature' },
  { id: 'school', name: 'Escuela Mágica 🎒', prompt: 'school supplies, classroom, magic items' },
  { id: 'food', name: 'Festival de Comida 🍔', prompt: 'food, fruits, fast food, snacks' },
];
