'use client';

export default function TrackCard({ track, index, isFavorite, onToggleFavorite, onRemove }) {
  // Función auxiliar para formatear tiempo (ms -> mm:ss)
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  };

  return (
    <div className="group flex items-center gap-4 bg-gray-800/80 hover:bg-gray-700 p-3 rounded-lg border border-transparent hover:border-gray-600 transition-all duration-200">
      {/* Número de lista */}
      <span className="text-gray-500 w-6 text-center font-mono text-sm">{index + 1}</span>

      {/* Portada del Álbum */}
      <img 
        src={track.album.images[2]?.url || track.album.images[0]?.url} 
        alt={track.name}
        className="w-12 h-12 rounded shadow-md object-cover"
      />

      {/* Información de la canción */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white truncate">{track.name}</h4>
        <p className="text-sm text-gray-400 truncate">
          {track.artists.map(a => a.name).join(', ')}
        </p>
      </div>

      {/* Duración */}
      <span className="text-xs text-gray-500 hidden sm:block font-mono">
        {formatDuration(track.duration_ms)}
      </span>

      {/* Botones de Acción */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleFavorite(track)}
          className={`p-2 rounded-full transition-colors ${
            isFavorite 
              ? 'text-green-500 hover:bg-green-900/30' 
              : 'text-gray-400 hover:text-white hover:bg-gray-600'
          }`}
          title="Guardar en favoritos"
        >
          ♥
        </button>

        <button
          onClick={() => onRemove(track.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-900/30 rounded-full transition-colors"
          title="Quitar de la lista"
        >
          ✕
        </button>
      </div>
    </div>
  );
}