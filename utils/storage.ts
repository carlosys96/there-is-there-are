
import { HighScore } from '../types';

// --- CONFIGURACIÓN PRINCIPAL ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzXxXkuchDxnxze2eQhkb0dYvJOq9juoctoUyo2TZlKwmgTZzqsaKNjH0pI9QTvL0BG/exec';

const STORAGE_KEY = 'grammar_game_leaderboard';
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1qE9ipSqsDSD1u5Kkrb9lXZJxQ3KU8w7QqKtjFxJKRP8/edit?usp=sharing';

// Estado simple de conexión para evitar llamadas fallidas repetidas
let isOfflineMode = false;

export const getScriptUrl = (): string => {
  if (!GOOGLE_SCRIPT_URL) return '';
  return GOOGLE_SCRIPT_URL.trim();
};

export const getHighScores = (): HighScore[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const fetchLeaderboard = async (): Promise<HighScore[]> => {
  // Si ya falló antes, no insistimos, usamos local.
  if (isOfflineMode) return getHighScores();

  const scriptUrl = getScriptUrl();
  if (!scriptUrl) return getHighScores();

  try {
    const urlObj = new URL(scriptUrl);
    urlObj.searchParams.append('action', 'read');
    // Cache buster esencial
    urlObj.searchParams.append('t', Date.now().toString());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(urlObj.toString(), {
      method: 'GET',
      credentials: 'omit',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const text = await response.text();
    const data = JSON.parse(text);
    
    // Normalizar respuesta (array directo o { data: [] })
    const items = Array.isArray(data) ? data : (data.data || []);
    
    if (items.length === 0 && !Array.isArray(data)) {
         // Si la estructura no es válida, fallback
         return getHighScores();
    }

    return mapScores(items);

  } catch (error) {
    console.warn("Modo Offline activado por error de red:", error);
    isOfflineMode = true; // Activamos circuit breaker
    return getHighScores(); 
  }
};

const mapScores = (data: any[]): HighScore[] => {
    return data.map((item: any) => ({
      name: item.name || 'Anónimo',
      score: Number(item.score) || 0,
      total: Number(item.total) || 0,
      date: item.date ? String(item.date) : '', // El servidor ya lo devuelve formateado o string
      difficulty: item.difficulty || 'MEDIUM',
      correct: Number(item.correct) || 0 // Puede venir 0 si el sheet no tiene esta columna
    }));
};

export const saveHighScoreLocal = (entry: HighScore): HighScore[] => {
  const current = getHighScores();
  const updated = [...current, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 20); 
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const saveToGoogleSheet = async (entry: HighScore): Promise<boolean> => {
  const scriptUrl = getScriptUrl();
  if (!scriptUrl || isOfflineMode) return false;

  try {
    // Fire and Forget: Enviamos con no-cors para máxima compatibilidad
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', 
      credentials: 'omit',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(entry),
    });
    return true;
  } catch (error) {
    console.error("Error al guardar en nube:", error);
    isOfflineMode = true;
    return false;
  }
};

export const retryConnection = () => {
  isOfflineMode = false;
  return fetchLeaderboard();
};

export const openGoogleSheet = () => {
  window.open(SHEET_URL, '_blank');
};
