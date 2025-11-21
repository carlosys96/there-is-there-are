
import React, { useState, useEffect } from 'react';
import { TOPICS, Difficulty, HighScore } from '../types';
import { fetchLeaderboard, getHighScores, getScriptUrl } from '../utils/storage';

interface StartScreenProps {
  onStart: (topicId: string, difficulty: Difficulty) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [hasConnection, setHasConnection] = useState(false);

  useEffect(() => {
    // Check if URL is configured in code
    const url = getScriptUrl();
    setHasConnection(!!url);
    
    // Load local immediately to show something
    setHighScores(getHighScores());

    // Then fetch from cloud
    loadScores();
  }, []);

  const loadScores = async () => {
    setIsLoadingScores(true);
    try {
      const scores = await fetchLeaderboard();
      if (scores && scores.length > 0) {
        setHighScores(scores);
      }
    } catch (e) {
      console.error("Error loading scores in component", e);
    } finally {
      setIsLoadingScores(false);
    }
  };

  const difficultyConfig = {
    [Difficulty.EASY]: { color: 'bg-green-500', label: 'Fácil', desc: '45s | Frases cortas' },
    [Difficulty.MEDIUM]: { color: 'bg-yellow-500', label: 'Medio', desc: '30s | Adjetivos' },
    [Difficulty.HARD]: { color: 'bg-red-500', label: 'Difícil', desc: '20s | Plurales Irreg.' }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-full p-6 text-center max-w-5xl mx-auto animate-fade-in pb-20 relative">
      
      {/* Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-sm">
          Grammar Explorer
        </h1>
        <p className="text-xl text-gray-300 mb-2">¡Aprende jugando con There Is y There Are!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* Left Column: Game Settings */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Difficulty Selector */}
          <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center justify-center gap-2">
              <span>🎚️</span> Selecciona Dificultad
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {(Object.keys(Difficulty) as Difficulty[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center ${
                    difficulty === lvl 
                      ? `${difficultyConfig[lvl].color} border-white text-white scale-105 shadow-lg` 
                      : 'bg-slate-700 border-slate-600 text-gray-400 hover:bg-slate-600'
                  }`}
                >
                  <span className="font-bold text-lg">{difficultyConfig[lvl].label}</span>
                  <span className="text-xs opacity-90">{difficultyConfig[lvl].desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Selector */}
          <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-white">Elige tu Aventura:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => onStart(topic.id, difficulty)}
                  className="group relative overflow-hidden bg-slate-700 hover:bg-slate-600 p-5 rounded-2xl border-2 border-slate-600 hover:border-cyan-400 transition-all duration-300 text-left shadow-lg"
                >
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                  <span className="text-3xl mb-2 block">{topic.name.split(' ').pop()}</span>
                  <span className="text-xl font-bold text-white block">{topic.name.split(' ').slice(0, -1).join(' ')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-700 shadow-xl h-full flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                <span>🏆</span> Hall of Fame
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={loadScores} className="text-sm text-cyan-400 hover:text-white" title="Actualizar">↻</button>
                {isLoadingScores && <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>}
              </div>
            </div>
            
            {highScores.length > 0 ? (
              <div className="overflow-y-auto max-h-[400px] pr-2 custom-scrollbar flex-grow">
                <table className="w-full text-left text-sm">
                  <thead className="text-gray-400 uppercase text-xs sticky top-0 bg-slate-900 z-10 shadow-sm">
                    <tr>
                      <th className="pb-3 pl-2 bg-slate-900">Pos</th>
                      <th className="pb-3 bg-slate-900">Jugador</th>
                      <th className="pb-3 text-right bg-slate-900">Puntos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {highScores.slice(0, 20).map((entry, idx) => (
                      <tr key={idx} className="group hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 pl-2 font-mono text-gray-500 w-10">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </td>
                        <td className="py-3 font-medium text-white group-hover:text-cyan-300 transition-colors">
                          <div className="flex flex-col">
                            <span>{entry.name}</span>
                            <div className="flex gap-2 text-[10px] text-gray-500">
                               <span>{entry.difficulty || 'EASY'}</span>
                               <span>• {entry.date}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-right font-bold text-yellow-500">{entry.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 flex-grow">
                <span className="text-4xl mb-2">📉</span>
                {isLoadingScores ? (
                   <p>Conectando...</p>
                ) : hasConnection ? (
                   <div className="flex flex-col items-center">
                      <p className="mb-2">Tabla vacía o error de carga.</p>
                      <button onClick={loadScores} className="text-xs text-cyan-400 underline">Reintentar</button>
                   </div>
                ) : (
                   <p className="text-xs px-4">Modo Offline. Revisa utils/storage.ts</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="mt-8 text-sm text-gray-500">
        Powered by Gemini AI ✨
      </div>
    </div>
  );
};

export default StartScreen;
