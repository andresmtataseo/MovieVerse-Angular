/**
 * Interfaces para los detalles completos de una película
 * Basado en la respuesta de la API de TMDB /movie/{id}
 */

/**
 * Interfaz para los géneros en los detalles de película
 */
export interface MovieGenre {
  id: number;
  name: string;
}

/**
 * Interfaz para las compañías de producción
 */
export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

/**
 * Interfaz para los países de producción
 */
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

/**
 * Interfaz para los idiomas hablados
 */
export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

/**
 * Interfaz para la colección a la que pertenece la película
 */
export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

/**
 * Interfaz principal para los detalles completos de una película
 * Respuesta exacta de la API de TMDB /movie/{id}
 */
export interface MovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: BelongsToCollection | null;
  budget: number;
  genres: MovieGenre[];
  homepage: string;
  id: number;
  imdb_id: string | null;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}