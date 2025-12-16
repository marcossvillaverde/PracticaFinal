'use client';

import { useState, useEffect } from 'react';
import { searchArtists } from '@/lib/spotify';

export default function ArtistWidget({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para buscar cuando el usuario deja de escribir (Debounce)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsLoading(true);
        const artists = await searchArtists(query);
        setResults(artists || []);
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, 500); // Espera 500ms antes de buscar para no saturar la API

    return () => clearTimeout(timer);
  }, [query]);

  const toggleArtist = (artist) => {
    let newSelection;
    const isSelected = selectedArtists.some(a => a.id === artist.id);

    if (isSelected) {
      newSelection = selectedArtists.filter(a => a.id !== artist.id);
    } else {
      if (selectedArtists.length >= 5) return;
      newSelection = [...selectedArtists, artist];
    }

    setSelectedArtists(newSelection);
    setQuery(''); // Limpiar buscador al seleccionar
    setResults([]); // Limpiar resultados
    onSelect(newSelection);
  };

  const removeArtist = (artistId) => {
    const newSelection = selectedArtists.filter(a => a.id !== artistId);
    setSelectedArtists(newSelection);
    onSelect(newSelection);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        🎤 Artistas Favoritos
        <span className="text-xs font-normal text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
          {selectedArtists.length}/5
        </span>
      </h3>

      {/* Buscador */}
      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar artista (ej. Bad Bunny)..."
          className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-green-500 transition-colors"
        />
        {isLoading && (
          <div className="absolute right-3 top-3.5">
            <div className="animate-spin h-5 w-5 border-2 border-green-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Lista de Resultados de Búsqueda (Flotante o estática) */}
      {results.length > 0 && (
        <ul className="mb-4 bg-gray-700 rounded-lg overflow-hidden max-h-60 overflow-y-auto border border-gray-600">
          {results.map((artist) => (
            <li 
              key={artist.id}
              onClick={() => toggleArtist(artist)}
              className="flex items-center gap-3 p-3 hover:bg-gray-600 cursor-pointer transition-colors border-b border-gray-600 last:border-0"
            >
              {artist.images && artist.images.length > 0 ? (
                <img src={artist.images[0].url} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-xs">?</div>
              )}
              <span className="text-sm font-medium text-white">{artist.name}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Artistas Seleccionados (Chips) */}
      <div className="flex flex-wrap gap-2">
        {selectedArtists.map((artist) => (
          <div key={artist.id} className="flex items-center gap-2 bg-green-900/40 border border-green-500/30 px-3 py-1.5 rounded-full hover:bg-green-900/60 transition-colors">
            {artist.images && artist.images.length > 0 && (
              <img src={artist.images[0].url} alt={artist.name} className="w-6 h-6 rounded-full object-cover" />
            )}
            <span className="text-sm text-green-100">{artist.name}</span>
            <button 
              onClick={() => removeArtist(artist.id)}
              className="text-green-300 hover:text-white ml-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-green-800"
            >
              ×
            </button>
          </div>
        ))}
        
        {selectedArtists.length === 0 && (
          <p className="text-gray-500 text-sm italic w-full text-center py-2">
            No has seleccionado artistas aún
          </p>
        )}
      </div>
    </div>
  );
}