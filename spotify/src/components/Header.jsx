'use client';

export default function Header({ onLogout }) {
  return (
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
          onClick={onLogout}
          className="px-5 py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-full font-semibold transition-all text-sm shadow-lg hover:shadow-red-900/20"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}