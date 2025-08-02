import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { RESTNowPlaying } from '../interfaces/tmdbMovies.interface';
import { catchError, delay, map, Observable, tap, throwError } from 'rxjs';
import { MovieMapper } from '../interfaces/mappers/movie.mapper';
import { Movie } from '../interfaces/movie.interface';
import { Genre, GenreResponse } from '../interfaces/genre.interface';
import { MovieDetails } from '../interfaces/movie-details.interface';

/**
 * Servicio principal para la comunicación con la API de TMDB
 *
 * Este servicio implementa:
 * - Gestión de estado reactivo con signals
 * - Manejo de errores centralizado
 * - Transformación de datos usando mappers
 * - Configuración de headers y parámetros HTTP
 * - Carga automática de géneros al inicializar
 */
@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  // Inyección del cliente HTTP para realizar peticiones
  private http = inject(HttpClient);

  // Estado reactivo para la paginación
  nowPlayingPage = signal<number>(1);
  upcomingPage = signal<number>(1);
  trendingTimeWindow = signal<'day' | 'week'>('day');

  // Estado reactivo para los géneros (cargados una vez y reutilizados)
  genres = signal<Genre[]>([]);

  constructor() {
    // Los géneros se cargarán cuando sean necesarios, no automáticamente
    // Esto evita la dependencia circular en la inicialización
  }

  /**
   * Obtiene la lista de géneros cinematográficos disponibles
   *
   * Los géneros se cargan una sola vez y se almacenan en el estado
   * para ser reutilizados en toda la aplicación
   *
   * @returns Observable con la lista de géneros
   */
  getGenres(): Observable<Genre[]> {
    // Si ya tenemos géneros cargados, los devolvemos directamente
    if (this.genres().length > 0) {
      return new Observable(observer => {
        observer.next(this.genres());
        observer.complete();
      });
    }

    const url = `${environment.apiUrl}/genre/movie/list`;

    // Configuración de headers con token de autorización
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${environment.token}`);

    // Parámetros de consulta para obtener géneros en español
    const params = new HttpParams()
      .set('language', 'es');

    return this.http.get<GenreResponse>(url, { headers, params })
      .pipe(
        // Actualiza el estado con los géneros obtenidos
        tap((response) => this.genres.set(response.genres)),
        // Retorna los géneros del estado
        map(() => this.genres()),
        // Manejo de errores
        catchError((error) => {
          console.error(error);
          return throwError(() => new Error('Error al obtener las géneros'));
        })
      );
  }

  /**
   * Obtiene las películas actualmente en cartelera
   *
   * @param page - Número de página (opcional, usa el estado por defecto)
   * @returns Observable con la lista de películas transformadas
   */
  getNowPlaying(page?: number): Observable<Movie[]> {
    const url = `${environment.apiUrl}/movie/now_playing`;

    // Headers con token de autorización
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${environment.token}`);

    // Parámetros: página y idioma localizado
    const params = new HttpParams()
      .set('page', page ?? this.nowPlayingPage())
      .set('language', 'es-MX');

    return this.http.get<RESTNowPlaying>(url, { headers, params })
      .pipe(
        // Actualiza el estado de la página actual
        tap((response) => this.nowPlayingPage.set(response.page)),
        // Simula delay para mostrar loading (solo para demo)
        delay(1000),
        // Transforma las películas usando el mapper
        map((response) => MovieMapper.mapTMDBMoviesToMovies(response.results)),
        // Manejo de errores
        catchError((error) => {
          console.error(error);
          return throwError(() => new Error('No se pudo obtener las películas'));
        })
      );
  }

  /**
   * Obtiene las películas próximas a estrenar
   *
   * @param page - Número de página (opcional, usa el estado por defecto)
   * @returns Observable con la lista de películas próximas transformadas
   */
  getUpcoming(page?: number): Observable<Movie[]> {
    const url = `${environment.apiUrl}/movie/upcoming`;

    // Headers con token de autorización
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${environment.token}`);

    // Parámetros: página, idioma localizado y región
    const params = new HttpParams()
      .set('page', page ?? this.upcomingPage())
      .set('language', 'es-MX')
      .set('region', 'MX');

    return this.http.get<RESTNowPlaying>(url, { headers, params })
      .pipe(
        // Actualiza el estado de la página actual
        tap((response) => this.upcomingPage.set(response.page)),
        // Simula delay para mostrar loading (solo para demo)
        delay(1000),
        // Transforma las películas usando el mapper
        map((response) => MovieMapper.mapTMDBMoviesToMovies(response.results)),
        // Manejo de errores
        catchError((error) => {
          console.error(error);
          return throwError(() => new Error('No se pudo obtener las películas próximas'));
        })
      );
  }

  /**
   * Obtiene las películas en tendencia (diarias o semanales)
   * @param timeWindow - 'day' para tendencias diarias, 'week' para semanales
   * @returns Observable con las películas en tendencia
   */
  getTrending(timeWindow: 'day' | 'week' = 'day'): Observable<Movie[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.token}`,
      'accept': 'application/json'
    });

    const params = new HttpParams()
      .set('language', 'es-MX');

    return this.http.get<RESTNowPlaying>(`${environment.apiUrl}/trending/movie/${timeWindow}`, { headers, params })
      .pipe(
        delay(1000), // Delay para demostración
        tap(() => this.trendingTimeWindow.set(timeWindow)),
        map(response => response.results.map(movie => MovieMapper.mapTMDBMovieToMovie(movie))),
        catchError(error => {
          console.error('Error al obtener películas en tendencia:', error);
          return throwError(() => new Error('Error al cargar las películas en tendencia'));
        })
      );
  }

  /**
   * Obtiene los detalles completos de una película por su ID
   * @param movieId - ID de la película
   * @returns Observable con los detalles completos de la película
   */
  getMovieDetails(movieId: number): Observable<MovieDetails> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.token}`,
      'accept': 'application/json'
    });

    const params = new HttpParams()
      .set('language', 'es-MX');

    return this.http.get<MovieDetails>(`${environment.apiUrl}/movie/${movieId}`, { headers, params })
      .pipe(
        delay(1000), // Delay para demostración
        map(movieDetails => ({
          ...movieDetails,
          // Construir URLs completas para las imágenes
          poster_path: movieDetails.poster_path ? `${environment.imageUrl}${movieDetails.poster_path}` : null,
          backdrop_path: movieDetails.backdrop_path ? `${environment.imageUrl}${movieDetails.backdrop_path}` : null,
          production_companies: movieDetails.production_companies.map(company => ({
            ...company,
            logo_path: company.logo_path ? `${environment.imageUrl}${company.logo_path}` : null
          }))
        })),
        catchError(error => {
          console.error('Error al obtener detalles de la película:', error);
          return throwError(() => new Error('Error al cargar los detalles de la película'));
        })
      );
  }
}
