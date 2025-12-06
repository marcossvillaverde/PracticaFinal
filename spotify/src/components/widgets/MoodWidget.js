'use client';

import { useState } from 'react';

export default function MoodWidget({ onSelect }) {
  // Estado para: Energía, Felicidad (Valence) y Bailabilidad
  const [mood, setMood] = useState({
    energy: 50,      // 0 = Calmado, 100 = Enérgico
    valence: 50,     // 0 = Melancólico, 100 = Alegre
    danceability: 50 // 0 = Estático, 100 = Bailable
  });

  const handleChange = (feature, value) => {
    const newMood = { ...mood, [feature]: parseInt(value) };
    setMood(newMood);
    onSelect(newMood);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        🎭 Mood y Energía
      </h3>

      <div className="space-y-6">
        {/* Slider Energía */}
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>💤 Calmado</span>
            <span className="text-white font-bold">Energía: {mood.energy}%</span>
            <span>⚡ Enérgico</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={mood.energy}
            onChange={(e) => handleChange('energy', e.target.value)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>

        {/* Slider Felicidad (Valence) */}
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>😢 Melancólico</span>
            <span className="text-white font-bold">Ánimo: {mood.valence}%</span>
            <span>😃 Alegre</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={mood.valence}
            onChange={(e) => handleChange('valence', e.target.value)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Slider Bailabilidad */}
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>🗿 Estático</span>
            <span className="text-white font-bold">Ritmo: {mood.danceability}%</span>
            <span>💃 Bailable</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={mood.danceability}
            onChange={(e) => handleChange('danceability', e.target.value)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
}