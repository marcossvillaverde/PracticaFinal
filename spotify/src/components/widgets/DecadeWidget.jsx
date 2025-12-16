'use client';

import { useState } from 'react';

const DECADES = [
  { id: '1960', label: '60s', emoji: '☮️' },
  { id: '1970', label: '70s', emoji: '🕺' },
  { id: '1980', label: '80s', emoji: '🎹' },
  { id: '1990', label: '90s', emoji: '💾' },
  { id: '2000', label: '00s', emoji: '💿' },
  { id: '2010', label: '10s', emoji: '📱' },
  { id: '2020', label: '20s', emoji: '😷' },
];

export default function DecadeWidget({ onSelect }) {
  const [selectedDecades, setSelectedDecades] = useState([]);

  const toggleDecade = (id) => {
    let newSelection;
    if (selectedDecades.includes(id)) {
      newSelection = selectedDecades.filter(d => d !== id);
    } else {
      newSelection = [...selectedDecades, id];
    }
    setSelectedDecades(newSelection);
    onSelect(newSelection);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        📅 Décadas
        {selectedDecades.length > 0 && (
          <span className="text-xs font-normal text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
            {selectedDecades.length} seleccionadas
          </span>
        )}
      </h3>
      
      <div className="grid grid-cols-4 gap-2">
        {DECADES.map((decade) => (
          <button
            key={decade.id}
            onClick={() => toggleDecade(decade.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 border
              ${selectedDecades.includes(decade.id)
                ? 'bg-green-600 border-green-500 text-white shadow-lg scale-105'
                : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white'
              }`}
          >
            <span className="text-lg mb-1">{decade.emoji}</span>
            <span className="text-xs font-bold">{decade.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}