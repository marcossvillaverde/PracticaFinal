'use client';

import { useState, useEffect } from 'react';
import TrackCard from './TrackCard'; // Importamos el componente hijo

export default function PlaylistDisplay({ tracks, onRemoveTrack, isLoading }) {
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos del localStorage al iniciar
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('spotify_favorites') || '[]');
    setFavorites(saved);
  }, []);

  // Lógica de favoritos
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

  // Renderizado Condicional: Cargando
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 animate-pulse">
        <div className="text-center">
          <div className="text-4xl mb-2">💿</div>
          <p>Mezclando tus ingredientes...</p>
        </div>
      </div>
    );
  }

  // Renderizado Condicional: Vacío
  if (!tracks || tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 space-y-4 border-2 border-dashed border-gray-700 rounded-xl bg-gray-900/30">
        <span className="text-6xl opacity-30">🎵</span>
        <p className="text-center max-w-xs text-lg">
          Selecciona tus preferencias y pulsa "Generar Mezcla" para ver la magia.
        </p>
      </div>
    );
  }

  // Renderizado: Lista de Canciones
  return (
    <div className="space-y-4">
      {tracks.map((track, index) => (
        <TrackCard
          key={`${track.id}-${index}`}
          track={track}
          index={index}
          isFavorite={favorites.some(f => f.id === track.id)}
          onToggleFavorite={toggleFavorite}
          onRemove={onRemoveTrack}
        />
      ))}
    </div>
  );
}