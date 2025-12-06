'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout, getAccessToken } from '@/lib/auth';
import { generatePlaylist } from '@/lib/spotify';
import GenreWidget from '@/components/widgets/GenreWidget';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';
import MoodWidget from '@/components/widgets/MoodWidget'; // <--- NUEVO IMPORT
import PlaylistDisplay from '@/components/PlaylistDisplay';

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
    mood: null // <--- NUEVO ESTADO
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

  // Manejadores
  const handleGenreSelect = (val) => setPreferences(p => ({ ...p, genres: val }));
  const handleArtistSelect = (val) => setPreferences(p => ({ ...p, artists: val }));
  const handleDecadeSelect = (val) => setPreferences(p => ({ ...p, decades: val }));
  const handlePopularitySelect = (val) => setPreferences(p => ({ ...p, popularity: val }));
  const handleMoodSelect = (val) => setPreferences(p => ({ ...p, mood: val })); // <--- NUEVO MANEJADOR

  const handleGenerate = async () => {
    if (preferences.genres.length === 0 && preferences.artists.length === 0) {
      alert("¡Selecciona al menos un género o artista!");
      return;
    }

    setIsGenerating(true);
    setPlaylist([]); 

    try {
      const tracks = await generatePlaylist(preferences);
      
      if (tracks.length === 0) {
        alert("Filtros demasiado estrictos. Intenta relajar el Mood o la Popularidad.");
      }
      
      setPlaylist(tracks);
    } catch (error) {
      console.error(error);
      alert("Error al generar playlist.");
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
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
          Spotify Taste Mixer
        </h1>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-900">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Autenticado
          </div>
          <button 
            onClick={handleLogout}
            className="px-5 py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-full font-semibold transition-all text-sm shadow-lg"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* COLUMNA IZQUIERDA: Widgets */}
          <div className="xl:col-span-5 space-y-6 pb-20">
            <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700 sticky top-4 z-20 shadow-xl ring-1 ring-white/5">
              <h2 className="text-lg font-bold text-gray-200">🎛️ Configuración</h2>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`
                  px-6 py-2 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2
                  ${isGenerating ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400 text-black'}
                `}
              >
                {isGenerating ? 'Mezclando...' : '✨ Generar Mezcla'}
              </button>
            </div>
            
            <GenreWidget onSelect={handleGenreSelect} />
            <ArtistWidget onSelect={handleArtistSelect} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DecadeWidget onSelect={handleDecadeSelect} />
              <PopularityWidget onSelect={handlePopularitySelect} />
            </div>

            {/* NUEVO WIDGET AQUI */}
            <MoodWidget onSelect={handleMoodSelect} />
            
          </div>
          
          {/* COLUMNA DERECHA */}
          <div className="xl:col-span-7">
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 min-h-[600px] backdrop-blur-sm sticky top-24">
              <div className="flex justify-between items-center mb-6 border-b border-gray-700/50 pb-4">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  💿 Tu Mezcla <span className="text-sm font-normal text-gray-400">({playlist.length})</span>
                </h2>
              </div>
              
              <PlaylistDisplay tracks={playlist} onRemoveTrack={handleRemoveTrack} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}