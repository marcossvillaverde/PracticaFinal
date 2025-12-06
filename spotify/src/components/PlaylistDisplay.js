'use client';

import { useState, useEffect } from 'react';

export default function PlaylistDisplay({ tracks, onRemoveTrack }) {
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos al iniciar
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('spotify_favorites') || '[]');
    setFavorites(saved);
  }, []);

  // Manejar Like/Unlike
  const toggleFavorite = (track) => {
    let newFavorites;
    const isFav = favorites.some(f => f.id === track.id);

    if (isFav) {
      newFavorites = favorites.filter(f => f.id !== track.id);
    } else {
      newFavorites = [...favorites, track];
    }

    setFavorites(newFavorites);
    localStorage.setItem('spotify_favorites', JSON.stringify(newFavorites));
  };

  // Convertir milisegundos a minutos:segundos
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  };

  if (!tracks || tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 space-y-4 border-2 border-dashed border-gray-700 rounded-xl bg-gray-900/30">
        <span className="text-6xl opacity-30">💿</span>
        <p className="text-center max-w-xs text-lg">
          Selecciona tus preferencias y pulsa "Generar Mezcla" para ver la magia.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tracks.map((track, index) => (
        <div 
          key={`${track.id}-${index}`}
          className="group flex items-center gap-4 bg-gray-800/80 hover:bg-gray-700 p-3 rounded-lg border border-transparent hover:border-gray-600 transition-all duration-200"
        >
          {/* Número */}
          <span className="text-gray-500 w-6 text-center font-mono text-sm">{index + 1}</span>

          {/* Portada */}
          <img 
            src={track.album.images[2]?.url || track.album.images[0]?.url} 
            alt={track.name}
            className="w-12 h-12 rounded shadow-md object-cover"
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate">{track.name}</h4>
            <p className="text-sm text-gray-400 truncate">
              {track.artists.map(a => a.name).join(', ')}
            </p>
          </div>

          {/* Duración (visible solo en desktop) */}
          <span className="text-xs text-gray-500 hidden sm:block font-mono">
            {formatDuration(track.duration_ms)}
          </span>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Botón Favorito */}
            <button
              onClick={() => toggleFavorite(track)}
              className={`p-2 rounded-full transition-colors ${
                favorites.some(f => f.id === track.id) 
                  ? 'text-green-500 hover:bg-green-900/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
              title="Guardar en favoritos"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Botón Eliminar */}
            <button
              onClick={() => onRemoveTrack(track.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-900/30 rounded-full transition-colors"
              title="Quitar de la lista"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}