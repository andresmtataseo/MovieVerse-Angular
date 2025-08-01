import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Movie, UserActivity } from '../interfaces/movie.interface';

/**
 * Servicio para la lógica de negocio relacionada con películas
 *
 * Este servicio maneja:
 * - Filtrado de películas por categorías
 * - Actividades de usuario
 * - Lógica de negocio local (no dependiente de API externa)
 *
 * NOTA: Los métodos comentados muestran cómo se implementaría
 * el filtrado de películas cuando se tenga un estado local
 */
@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor() { }

    // Métodos comentados que muestran la implementación de filtros
    // Estos métodos se usarían cuando tengamos un estado local de películas

    // /**
    //  * Obtiene solo las películas que son estrenos recientes
    //  * @returns Observable con películas filtradas por isNewRelease
    //  */
    // getNewReleases(): Observable<Movie[]> {
    //   return of(this.movies.filter(movie => movie.isNewRelease));
    // }

    // /**
    //  * Obtiene películas en tendencia o con alta calificación
    //  * @returns Observable con películas filtradas por isTrending o rating > 7.5
    //  */
    // getTrending(): Observable<Movie[]> {
    //   return of(this.movies.filter(movie => movie.isTrending || movie.rating > 7.5));
    // }

    // /**
    //  * Obtiene películas que próximamente estarán en cines
    //  * @returns Observable con películas filtradas por isComingSoon
    //  */
    // getComingSoon(): Observable<Movie[]> {
    //   return of(this.movies.filter(movie => movie.isComingSoon));
    // }

    /**
     * Obtiene las actividades recientes de usuarios
     *
     * Este método simula la obtención de notificaciones de actividades
     * como "Usuario X agregó Película Y a favoritos"
     *
     * @returns Observable con las actividades de usuario
     */
    getUserActivities(): Observable<UserActivity[]> {
      return of([]); // Por ahora retorna array vacío
    }

    /**
     * Obtiene el número de actividades no leídas
     *
     * Útil para mostrar un badge con el número de notificaciones
     * pendientes en la interfaz de usuario
     *
     * @returns Observable con el número de actividades no leídas
     */
    getUnreadActivitiesCount(): Observable<number> {
      return of(3); // Simula 3 notificaciones no leídas
    }
}
