
import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import { GameState, QuestionItem, TOPICS, Difficulty } from './types';
import { generateQuestions } from './services/gemini';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [score, setScore] = useState(0); // Weighted Points
  const [correctCount, setCorrectCount] = useState(0); // Number of correct answers
  const [loadingTopic, setLoadingTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);

  const startGame = async (topicId: string, selectedDifficulty: Difficulty) => {
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) return;

    setDifficulty(selectedDifficulty);
    setGameState(GameState.LOADING);
    setLoadingTopic(topic.name);
    setScore(0);
    setCorrectCount(0);

    try {
      // We pass topic.id explicitly now to support static fallback looking up keys
      const generatedQuestions = await generateQuestions(topic.id, topic.prompt, selectedDifficulty);
      setQuestions(generatedQuestions);
      setGameState(GameState.PLAYING);
    } catch (error) {
      console.error("Failed to start game", error);
      setGameState(GameState.ERROR);
    }
  };

  const handleEndGame = (finalPoints: number, finalCorrectCount: number) => {
    setScore(finalPoints);
    setCorrectCount(finalCorrectCount);
    setGameState(GameState.RESULT);
  };

  const restartGame = () => {
    setGameState(GameState.START);
    setQuestions([]);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden overflow-y-auto">
      <div className="max-w-4xl mx-auto min-h-screen flex flex-col">
        {gameState === GameState.START && (
          <div className="flex-grow flex flex-col justify-center">
            <StartScreen onStart={startGame} />
          </div>
        )}

        {gameState === GameState.LOADING && (
          <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute top-2 left-2 w-20 h-20 border-4 border-cyan-400 border-b-transparent rounded-full animate-spin duration-reverse"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-3xl">🤖</div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">Generando Misión...</h2>
            <p className="text-purple-200">Viajando a: {loadingTopic}</p>
            <p className="text-xs text-gray-400 mt-4 max-w-md">La IA está preparando el desafío {difficulty}...</p>
          </div>
        )}

        {gameState === GameState.PLAYING && (
          <div className="flex-grow flex flex-col justify-center">
            <GameScreen 
              questions={questions} 
              difficulty={difficulty}
              onEndGame={handleEndGame} 
            />
          </div>
        )}

        {gameState === GameState.RESULT && (
          <div className="flex-grow">
            <ResultScreen 
              score={score} 
              correctCount={correctCount}
              total={questions.length} 
              difficulty={difficulty}
              onRestart={restartGame} 
            />
          </div>
        )}
        
        {gameState === GameState.ERROR && (
           <div className="flex-grow flex flex-col items-center justify-center">
              <div className="text-5xl mb-4">😿</div>
              <h2 className="text-2xl font-bold mb-4">Oops! Algo salió mal.</h2>
              <button 
                onClick={restartGame}
                className="px-6 py-2 bg-white text-slate-900 rounded-full font-bold hover:bg-gray-200"
              >
                Volver al Inicio
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default App;
