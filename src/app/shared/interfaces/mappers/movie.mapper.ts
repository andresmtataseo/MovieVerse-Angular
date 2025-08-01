import { environment } from "../../../../environments/environments";
import { Movie } from "../movie.interface";
import { TMDBMovie } from "../tmdbMovies.interface";

/**
 * Clase Mapper para transformar datos entre la API externa y el dominio interno
 *
 * Implementa el patrón Mapper/Adapter para:
 * - Separar la lógica de transformación de datos
 * - Mantener el dominio limpio de dependencias externas
 * - Facilitar cambios en la API sin afectar el resto de la aplicación
 * - Centralizar la lógica de mapeo en un solo lugar
 */
export class MovieMapper {

  /**
   * Transforma una película de TMDB al modelo de dominio interno
   *
   * @param TMDBmovie - Película tal como la devuelve la API de TMDB
   * @returns Película en el formato del dominio interno
   */
  static mapTMDBMovieToMovie(TMDBmovie: TMDBMovie): Movie {
    return {
      id: TMDBmovie.id,
      title: TMDBmovie.title,
      // Construye la URL completa del poster usando la configuración
      posterUrl: `${environment.imageUrl}${TMDBmovie.poster_path}`,
      rating: TMDBmovie.vote_average,
      genres: TMDBmovie.genre_ids,
      // Extrae solo el año de la fecha de lanzamiento
      year: new Date(TMDBmovie.release_date).getFullYear(),
      popularity: TMDBmovie.popularity,
      description: TMDBmovie.overview,
    };
  }

  /**
   * Transforma un array de películas de TMDB al modelo de dominio interno
   *
   * @param TMDBmovies - Array de películas de TMDB
   * @returns Array de películas en el formato del dominio interno
   */
  static mapTMDBMoviesToMovies(TMDBmovies: TMDBMovie[]): Movie[] {
    return TMDBmovies.map(TMDBmovie => MovieMapper.mapTMDBMovieToMovie(TMDBmovie));
  }
}
