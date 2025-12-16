'use client';

import { useState } from 'react';

export default function PopularityWidget({ onSelect }) {
  // Estado inicial: rango 0-100 (toda la música)
  const [range, setRange] = useState([0, 100]); 
  
  // Categorías descriptivas según el rango seleccionado
  const getLabel = () => {
    const [min, max] = range;
    if (max <= 30) return "💎 Joyas Ocultas (Underground)";
    if (min >= 70) return "🌟 Top Hits (Mainstream)";
    if (min >= 30 && max <= 70) return "⚖️ Equilibrado";
    return "🌍 De todo un poco";
  };

  const handleChange = (e) => {
    // Simplificamos: un solo slider que define si queremos más mainstream o más indie
    // Valor 0 = Full Underground, 100 = Full Mainstream
    const value = parseInt(e.target.value);
    
    // Convertimos ese valor único en un rango para la API
    // Si el usuario elige 80 (Mainstream), buscamos canciones con popularidad 60-100
    // Si elige 20 (Indie), buscamos 0-40
    const min = Math.max(0, value - 20);
    const max = Math.min(100, value + 20);
    
    setRange([min, max]);
    onSelect([min, max]);
  };

  // Calculamos el valor central para el slider visual
  const currentValue = (range[0] + range[1]) / 2;

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        📊 Popularidad
      </h3>
      
      <div className="mb-4 text-center">
        <span className={`text-sm font-bold px-3 py-1 rounded-full border 
          ${currentValue > 70 ? 'bg-purple-900/50 text-purple-200 border-purple-500' : 
            currentValue < 30 ? 'bg-blue-900/50 text-blue-200 border-blue-500' : 
            'bg-gray-700 text-gray-200 border-gray-500'}`}>
          {getLabel()}
        </span>
      </div>

      <div className="relative pt-1">
        <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
          <span>Underground</span>
          <span>Mainstream</span>
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={currentValue}
          onChange={handleChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all"
        />
        
        <p className="text-xs text-center text-gray-500 mt-3">
          Busca canciones con popularidad entre {range[0]}% y {range[1]}%
        </p>
      </div>
    </div>
  );
}