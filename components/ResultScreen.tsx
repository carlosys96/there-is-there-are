
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { HighScore, Difficulty } from '../types';
import { getHighScores, saveHighScoreLocal, saveToGoogleSheet } from '../utils/storage';

interface ResultScreenProps {
  score: number; // This is now Weighted Points
  correctCount: number; // This is number of right answers
  total: number;
  difficulty: Difficulty;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, correctCount, total, difficulty, onRestart }) => {
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [hasSaved, setHasSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load scores on mount
  useEffect(() => {
    setHighScores(getHighScores());
  }, []);

  const handleSaveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSaving(true);

    const newEntry: HighScore = {
      name: playerName.trim(),
      score: score, // Points
      correct: correctCount,
      total: total,
      difficulty: difficulty,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    };

    // 1. Save Locally
    const updated = saveHighScoreLocal(newEntry);
    setHighScores(updated);

    // 2. Save to Cloud (Google Sheet)
    await saveToGoogleSheet(newEntry);

    setIsSaving(false);
    setHasSaved(true);
  };

  const percentage = Math.round((correctCount / total) * 100) || 0;

  let message = "";
  let emoji = "";

  if (percentage === 100) {
    message = "¡Increíble! ¡Eres un experto! 🌟";
    emoji = "🏆";
  } else if (percentage >= 60) {
    message = "¡Buen trabajo! Sigue así. 👍";
    emoji = "⭐";
  } else {
    message = "¡Tú puedes! Inténtalo de nuevo. 💪";
    emoji = "📚";
  }

  return (
    <div className="flex flex-col w-full items-center justify-start p-4 animate-fade-in pb-20">
      <div className="w-full max-w-2xl bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl p-6 md:p-10 text-center relative overflow-hidden">
        
        {/* Decorative background blob */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-700/50 to-transparent pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-7xl mb-4 animate-bounce-short filter drop-shadow-lg">{emoji}</div>
          <h2 className="text-4xl font-bold text-white mb-2">Resultado Final</h2>
          <p className="text-gray-300 mb-8 text-lg">{message}</p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-900/60 p-4 md:p-6 rounded-2xl border border-yellow-500/30 flex flex-col items-center transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">{score}</div>
              <div className="text-xs md:text-sm text-yellow-200 uppercase tracking-wider font-bold">Puntos Totales ⚡</div>
            </div>
            <div className="bg-slate-900/60 p-4 md:p-6 rounded-2xl border border-cyan-500/30 flex flex-col items-center transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">{correctCount}<span className="text-2xl text-gray-500">/{total}</span></div>
              <div className="text-xs md:text-sm text-cyan-200 uppercase tracking-wider font-bold">Aciertos ✅</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-400 mb-8 bg-slate-700/30 p-2 rounded-lg inline-block">
             Dificultad: <span className="text-white font-bold">{difficulty}</span>
          </div>

          {/* Action Buttons */}
          <div className="mb-10">
             <Button onClick={onRestart} variant="primary" className="w-full text-xl py-4 shadow-xl shadow-indigo-500/20">
              Jugar de Nuevo 🔄
            </Button>
          </div>

          {/* Leaderboard Input Section */}
          {!hasSaved ? (
            <form onSubmit={handleSaveScore} className="bg-slate-700/40 p-6 rounded-2xl border border-slate-600 mb-6">
              <label className="block text-gray-300 mb-3 font-medium">¡Guarda tu récord en la tabla!</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Escribe tu nombre..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-500 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none transition-all"
                  maxLength={20}
                  disabled={isSaving}
                />
                <button 
                  type="submit"
                  disabled={!playerName.trim() || isSaving}
                  className={`bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center min-w-[120px]`}
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </form>
          ) : (
             <div className="mb-8 p-4 bg-green-900/20 border border-green-500/50 rounded-xl text-green-300 flex items-center justify-center gap-2 animate-fade-in">
               <span>✨ ¡Puntaje guardado exitosamente!</span>
             </div>
          )}

        </div>
      </div>

      {/* Leaderboard Table Section */}
      <div className="w-full max-w-2xl mt-8">
        <div className="flex justify-center items-center mb-4 px-2">
           <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
             🏆 Tabla de Posiciones (Top 20)
           </h3>
        </div>

        {highScores.length > 0 ? (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-gray-400 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-4">#</th>
                    <th className="p-4">Jugador</th>
                    <th className="p-4 text-center">Puntos</th>
                    <th className="p-4 text-center">Aciertos</th>
                    <th className="p-4 text-right">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {highScores.map((entry, idx) => (
                    <tr 
                      key={idx} 
                      className={`transition-colors hover:bg-slate-700/30 ${entry.name === playerName && hasSaved ? "bg-cyan-900/20" : ""}`}
                    >
                      <td className="p-4 font-mono text-gray-500 w-12">{idx + 1}</td>
                      <td className="p-4 font-bold text-white text-base">
                        {entry.name}
                        {idx < 3 && <span className="ml-2">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>}
                        <span className="block text-[10px] font-normal text-gray-500">{entry.difficulty || 'EASY'}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-yellow-400">{entry.score}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          entry.correct === entry.total ? 'bg-green-900 text-green-300' : 'text-gray-300'
                        }`}>
                          {entry.correct || 0} / {entry.total}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-400 text-xs font-mono">{entry.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700 text-gray-500">
            Aún no hay puntuaciones registradas. ¡Sé el primero!
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;
