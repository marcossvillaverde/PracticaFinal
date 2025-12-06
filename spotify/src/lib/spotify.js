import { getAccessToken } from '@/lib/auth';

const API_BASE = 'https://api.spotify.com/v1';

// Buscar artistas
export async function searchArtists(query) {
  const token = getAccessToken();
  if (!token) return [];

  try {
    const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&type=artist&limit=5`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.artists.items;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Función principal de generación
export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity, mood } = preferences;
  const token = getAccessToken();
  let allTracks = [];

  // 1. Obtener canciones base (por artista y género)
  // ----------------------------------------------------
  if (artists && artists.length > 0) {
    for (const artist of artists) {
      try {
        const response = await fetch(`${API_BASE}/artists/${artist.id}/top-tracks?market=ES`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.tracks) allTracks.push(...data.tracks);
      } catch (e) { console.error(e); }
    }
  }

  if (genres && genres.length > 0) {
    for (const genre of genres) {
      try {
        const response = await fetch(
          `${API_BASE}/search?type=track&q=genre:${encodeURIComponent(genre)}&limit=20`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const data = await response.json();
        if (data.tracks?.items) allTracks.push(...data.tracks.items);
      } catch (e) { console.error(e); }
    }
  }

  // Eliminar duplicados iniciales
  allTracks = Array.from(new Map(allTracks.map(t => [t.id, t])).values());

  // 2. Filtrado básico (Década y Popularidad)
  // ----------------------------------------------------
  if (decades && decades.length > 0) {
    allTracks = allTracks.filter(track => {
      if (!track.album.release_date) return false;
      const year = parseInt(track.album.release_date.substring(0, 4));
      return decades.some(decade => year >= parseInt(decade) && year < parseInt(decade) + 10);
    });
  }

  if (popularity) {
    const [min, max] = popularity;
    allTracks = allTracks.filter(t => t.popularity >= min && t.popularity <= max);
  }

  // 3. Filtrado avanzado por MOOD (Audio Features)
  // ----------------------------------------------------
  if (mood && allTracks.length > 0) {
    // La API de features acepta máximo 100 IDs por llamada
    const trackIds = allTracks.map(t => t.id).slice(0, 100).join(',');
    
    try {
      const featureResponse = await fetch(`${API_BASE}/audio-features?ids=${trackIds}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const featureData = await featureResponse.json();
      
      // Crear un mapa de características para acceso rápido
      const featuresMap = {};
      featureData.audio_features.forEach(f => {
        if (f) featuresMap[f.id] = f;
      });

      // Filtrar tracks basándonos en los sliders (+- 20% de tolerancia)
      allTracks = allTracks.filter(track => {
        const f = featuresMap[track.id];
        if (!f) return false;

        // Convertimos el slider (0-100) a escala de API (0.0-1.0)
        const targetEnergy = mood.energy / 100;
        const targetValence = mood.valence / 100;
        const targetDance = mood.danceability / 100;
        const tolerance = 0.25; // Margen de error flexible

        const matchEnergy = Math.abs(f.energy - targetEnergy) <= tolerance;
        const matchValence = Math.abs(f.valence - targetValence) <= tolerance;
        const matchDance = Math.abs(f.danceability - targetDance) <= tolerance;

        // Deben coincidir al menos 2 de 3 características para ser flexibles
        return [matchEnergy, matchValence, matchDance].filter(Boolean).length >= 2;
      });

    } catch (e) {
      console.error("Error filtrando por mood:", e);
    }
  }

  // Limitar a 30 canciones finales
  return allTracks.slice(0, 30);
}