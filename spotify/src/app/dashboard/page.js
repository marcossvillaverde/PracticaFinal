'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout, getAccessToken } from '@/lib/auth';
import { generatePlaylist } from '@/lib/spotify';

// Importación de Componentes Estructurales
import Header from '@/components/Header';
import PlaylistDisplay from '@/components/PlaylistDisplay';

// Importación de Widgets
import GenreWidget from '@/components/widgets/GenreWidget';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';
import MoodWidget from '@/components/widgets/MoodWidget';

export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [preferences, setPreferences] = useState({
    genres: [],
    artists: [],
    decades: [],
    popularity: null,
    mood: null
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }
    const accessToken = getAccessToken();
    setToken(accessToken);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Manejadores de Estado
  const handleGenreSelect = (val) => setPreferences(p => ({ ...p, genres: val }));
  const handleArtistSelect = (val) => setPreferences(p => ({ ...p, artists: val }));
  const handleDecadeSelect = (val) => setPreferences(p => ({ ...p, decades: val }));
  const handlePopularitySelect = (val) => setPreferences(p => ({ ...p, popularity: val }));
  const handleMoodSelect = (val) => setPreferences(p => ({ ...p, mood: val }));

  const handleGenerate = async () => {
    if (preferences.genres.length === 0 && preferences.artists.length === 0) {
      alert("¡Selecciona al menos un género o artista para empezar!");
      return;
    }

    setIsGenerating(true);
    setPlaylist([]); 

    try {
      const tracks = await generatePlaylist(preferences);
      
      if (tracks.length === 0) {
        alert("No se encontraron canciones. Intenta filtros menos estrictos.");
      }
      
      setPlaylist(tracks);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con Spotify.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveTrack = (trackId) => {
    setPlaylist(prev => prev.filter(t => t.id !== trackId));
  };

  if (!token) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-900 text-white font-sans">
      
      {/* 1. Componente Header separado */}
      <Header onLogout={handleLogout} />

      <main>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* COLUMNA IZQUIERDA: Widgets */}
          <div className="xl:col-span-5 space-y-6 pb-12">
            
            {/* Panel de Control */}
            <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700 sticky top-4 z-20 shadow-xl ring-1 ring-white/5">
              <h2 className="text-lg font-bold text-gray-200">🎛️ Configuración</h2>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`
                  px-6 py-2 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2
                  ${isGenerating 
                    ? 'bg-gray-600 cursor-not-allowed opacity-80' 
                    : 'bg-green-500 hover:bg-green-400 text-black hover:shadow-green-500/20'}
                `}
              >
                {isGenerating ? 'Mezclando...' : '✨ Generar Mezcla'}
              </button>
            </div>
            
            {/* Lista de Widgets */}
            <div className="space-y-6">
              <GenreWidget onSelect={handleGenreSelect} />
              <ArtistWidget onSelect={handleArtistSelect} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DecadeWidget onSelect={handleDecadeSelect} />
                <PopularityWidget onSelect={handlePopularitySelect} />
              </div>
               <MoodWidget onSelect={handleMoodSelect} />
            </div>
            
          </div>
          
          {/* COLUMNA DERECHA: PlaylistDisplay (que usa TrackCard internamente) */}
          <div className="xl:col-span-7">
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 min-h-[600px] backdrop-blur-sm sticky top-24">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-700/50 pb-4">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  💿 Tu Mezcla
                  <span className="text-sm font-normal text-gray-400 bg-black/20 px-2 py-1 rounded">
                    {playlist.length} canciones
                  </span>
                </h2>
              </div>
              
              <PlaylistDisplay 
                tracks={playlist} 
                onRemoveTrack={handleRemoveTrack} 
                isLoading={isGenerating}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}