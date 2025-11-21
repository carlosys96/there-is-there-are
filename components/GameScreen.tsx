
import React, { useState, useEffect, useRef } from 'react';
import { QuestionItem, Difficulty } from '../types';
import Button from './Button';

interface GameScreenProps {
  questions: QuestionItem[];
  difficulty: Difficulty;
  onEndGame: (points: number, correctCount: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ questions, difficulty, onEndGame }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [points, setPoints] = useState(0); // Total weighted score
  const [correctCount, setCorrectCount] = useState(0); // Number of right answers
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [streak, setStreak] = useState(0);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Difficulty settings: Points scaling
  const getDifficultySettings = () => {
    switch (difficulty) {
      case Difficulty.HARD: 
        return { 
          maxTime: 20, 
          bonusMultiplier: 10, // High time reward
          basePoints: 300      // High base reward
        };
      case Difficulty.MEDIUM: 
        return { 
          maxTime: 30, 
          bonusMultiplier: 5, 
          basePoints: 150 
        };
      case Difficulty.EASY: 
      default: 
        return { 
          maxTime: 45, 
          bonusMultiplier: 2,  // Low time reward
          basePoints: 50       // Low base reward
        };
    }
  };

  const { maxTime, bonusMultiplier, basePoints } = getDifficultySettings();

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Initialize timer for new question
  useEffect(() => {
    setTimeLeft(maxTime);
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeRunOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, maxTime]);

  const handleTimeRunOut = () => {
    if (showFeedback) return;
    setSelectedAnswer('TIMEOUT');
    setShowFeedback(true);
    setStreak(0);
    playErrorSound();
  };

  const handleAnswer = (answer: string) => {
    if (showFeedback) return; // Prevent double clicking
    if (timerRef.current) clearInterval(timerRef.current); // Stop timer
    
    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (answer === currentQuestion.correctAnswer) {
      // Calculate dynamic score
      const timeBonus = Math.max(0, timeLeft * bonusMultiplier);
      const streakBonus = streak * 10; // Small bonus for streaks
      const questionScore = basePoints + timeBonus + streakBonus;
      
      setPoints((prev) => prev + questionScore);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      playSuccessSound();
    } else {
      setStreak(0);
      playErrorSound();
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onEndGame(points, correctCount);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  // Simple audio feedback
  const playSuccessSound = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  const playErrorSound = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  // Calculate progress percentage for timer bar
  const timerPercentage = (timeLeft / maxTime) * 100;
  const timerColor = timeLeft < 5 ? 'bg-red-500' : timeLeft < 10 ? 'bg-yellow-500' : 'bg-cyan-400';

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto p-4 justify-center">
      {/* Progress Header */}
      <div className="flex flex-col gap-2 mb-6 bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-lg">
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-widest">Puntos</span>
            <span className="text-xl font-bold text-yellow-400">{points}</span>
          </div>
          
          {/* Timer Display */}
          <div className="flex flex-col items-center w-1/3">
            <div className={`text-2xl font-mono font-bold ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {timeLeft}s
            </div>
          </div>

          <div className="flex flex-col items-end">
             <span className="text-xs text-gray-400 uppercase tracking-widest">Racha</span>
             <div className="flex items-center">
               <span className="text-2xl mr-1">🔥</span>
               <span className="text-xl font-bold text-orange-400">{streak}</span>
             </div>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2 overflow-hidden relative">
          <div 
            className={`h-2.5 rounded-full transition-all duration-1000 ease-linear ${timerColor}`} 
            style={{ width: `${timerPercentage}%` }}
          ></div>
        </div>
        
        {/* Difficulty Badge */}
        <div className="flex justify-center -mt-1">
           <span className="text-[10px] bg-slate-900 px-2 rounded text-gray-500 border border-slate-700 uppercase tracking-widest">
             Nivel {difficulty === 'EASY' ? 'Fácil' : difficulty === 'MEDIUM' ? 'Medio' : 'Difícil'} (+{basePoints} pts)
           </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden flex-grow flex flex-col relative">
        
        {/* Visual Area */}
        <div className="bg-gradient-to-b from-indigo-100 to-white p-10 flex items-center justify-center flex-grow min-h-[200px]">
           <div className={`text-7xl md:text-9xl transition-all duration-500 ${showFeedback ? 'scale-110' : 'animate-bounce-short'}`}>
             {currentQuestion.emojis}
           </div>
        </div>

        {/* Sentence Area */}
        <div className="p-8 pb-12 text-center">
          <div className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
            {showFeedback ? (
              <span>
                <span className={`font-bold ${currentQuestion.correctAnswer === 'There is' ? 'text-purple-600' : 'text-blue-600'}`}>
                  {currentQuestion.correctAnswer}
                </span>
                <span> {currentQuestion.sentencePart2}</span>
              </span>
            ) : (
              <span>
                <span className="inline-block w-32 border-b-4 border-slate-300 mx-1"></span>
                <span>{currentQuestion.sentencePart2}</span>
              </span>
            )}
          </div>

          {/* Interaction Area */}
          {!showFeedback ? (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <Button onClick={() => handleAnswer('There is')} variant="primary" className="text-xl py-4 shadow-[0_4px_0_rgb(55,48,163)] active:shadow-none active:translate-y-1">
                There is
              </Button>
              <Button onClick={() => handleAnswer('There are')} variant="secondary" className="text-xl py-4 shadow-[0_4px_0_rgb(107,33,168)] active:shadow-none active:translate-y-1">
                There are
              </Button>
            </div>
          ) : (
            <div className="animate-fade-in">
               <div className={`mb-6 p-4 rounded-xl ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border-2`}>
                  <h3 className={`text-xl font-bold mb-1 ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                    {selectedAnswer === currentQuestion.correctAnswer ? '¡Correcto! 🎉' : selectedAnswer === 'TIMEOUT' ? '¡Tiempo Agotado! ⏰' : '¡Casi! 😅'}
                  </h3>
                  <p className="text-slate-700">
                    {currentQuestion.explanation}
                  </p>
                  {selectedAnswer === currentQuestion.correctAnswer && (
                    <div className="mt-2 text-sm font-bold text-green-600">
                      +{basePoints + Math.max(0, timeLeft * bonusMultiplier) + (streak-1)*10} puntos
                    </div>
                  )}
               </div>
               <Button onClick={handleNext} variant="neutral" className="w-full md:w-auto">
                 {isLastQuestion ? 'Ver Resultados' : 'Siguiente Pregunta'} →
               </Button>
            </div>
          )}
        </div>
      </div>
      <div className="text-center mt-2 text-gray-500 text-sm">
        Pregunta {currentIndex + 1} de {questions.length}
      </div>
    </div>
  );
};

export default GameScreen;
