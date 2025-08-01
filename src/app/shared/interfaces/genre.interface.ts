/**
 * Interfaces para géneros cinematográficos
 *
 * Estas interfaces manejan la categorización de películas por género,
 * permitiendo una mejor organización y filtrado del contenido.
 */

/**
 * Respuesta de la API para géneros
 * Estructura que devuelve TMDB para /genre/movie/list
 */
export interface GenreResponse {
  genres: Genre[];  // Array de géneros disponibles
}

/**
 * Interfaz para un género cinematográfico
 * Representa una categoría de películas (Acción, Comedia, Drama, etc.)
 */
export interface Genre {
  id:   number;  // Identificador único del género
  name: string;  // Nombre del género (ej: "Acción", "Comedia")
}
