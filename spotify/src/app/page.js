'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <main className="text-center space-y-8">
        {/* Título y Logo */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-green-500 tracking-tighter">
            Spotify Taste Mixer
          </h1>
          <p className="text-xl text-gray-300 max-w-md mx-auto">
            Mezcla tus gustos, descubre nuevas joyas y crea la playlist perfecta basada en tus preferencias.
          </p>
        </div>

        {/* Botón de Login */}
        <button
          onClick={handleLogin}
          className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
        >
          <span>🎵</span>
          Iniciar Sesión con Spotify
        </button>

        {/* Footer pequeño */}
        <p className="text-sm text-gray-500 mt-12">
          Proyecto Final - Next.js & Spotify API
        </p>
      </main>
    </div>
  );
}