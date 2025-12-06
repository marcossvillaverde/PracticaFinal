'use client';

import { useState } from 'react';

// Lista de géneros disponibles
const AVAILABLE_GENRES = [
  'pop', 'rock', 'hip-hop', 'indie', 'alternative', 'dance', 
  'electronic', 'r-n-b', 'latin', 'reggaeton', 'country', 
  'classical', 'jazz', 'metal', 'k-pop', 'punk'
];

export default function GenreWidget({ onSelect }) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    let newSelection;
    if (selectedGenres.includes(genre)) {
      // Si ya está, lo quitamos
      newSelection = selectedGenres.filter(g => g !== genre);
    } else {
      // Si no está y hay menos de 5, lo añadimos
      if (selectedGenres.length >= 5) return;
      newSelection = [...selectedGenres, genre];
    }
    
    setSelectedGenres(newSelection);
    // Comunicamos el cambio al componente padre (Dashboard)
    if (onSelect) {
      onSelect(newSelection);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        🎸 Géneros Musicales
        <span className="text-xs font-normal text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
          {selectedGenres.length}/5
        </span>
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize
              ${selectedGenres.includes(genre)
                ? 'bg-green-500 text-white shadow-green-500/20 shadow-lg transform scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
          >
            {genre.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
}