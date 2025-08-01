/**
 * Interfaces para la API externa TMDB (The Movie Database)
 *
 * Estas interfaces representan exactamente la estructura de respuesta
 * que devuelve la API de TMDB. Se mantienen separadas del dominio
 * interno para evitar acoplamiento con la API externa.
 */

/**
 * Respuesta completa de la API para películas en cartelera
 * Estructura exacta que devuelve TMDB para /movie/now_playing
 */
export interface RESTNowPlaying {
  dates:         Dates;        // Fechas de estreno (mínima y máxima)
  page:          number;       // Página actual de resultados
  results:       TMDBMovie[];  // Array de películas
  total_pages:   number;       // Total de páginas disponibles
  total_results: number;       // Total de resultados
}

/**
 * Rango de fechas para películas en cartelera
 */
export interface Dates {
  maximum: Date;  // Fecha máxima de estreno
  minimum: Date;  // Fecha mínima de estreno
}

/**
 * Estructura de una película tal como la devuelve TMDB
 * Mantiene los nombres exactos de la API (snake_case)
 */
export interface TMDBMovie {
  adult:             boolean;   // Indica si es contenido para adultos
  backdrop_path:     string | null;    // Ruta del fondo (sin URL base)
  genre_ids:         number[];  // IDs de géneros
  id:                number;    // ID único de TMDB
  original_language: string;    // Idioma original
  original_title:    string;    // Título original
  overview:          string;    // Sinopsis
  popularity:        number;    // Índice de popularidad
  poster_path:       string | null;    // Ruta del poster (sin URL base) - puede ser null
  release_date:      Date;      // Fecha de lanzamiento
  title:             string;    // Título localizado
  video:             boolean;   // Indica si es un video
  vote_average:      number;    // Calificación promedio
  vote_count:        number;    // Número de votos
}
