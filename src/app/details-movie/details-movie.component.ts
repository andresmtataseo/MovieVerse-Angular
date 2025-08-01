import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/**
 * Página de detalle de película
 *
 * COMPONENTE EN DESARROLLO
 *
 * Este componente está preparado para mostrar:
 * - Información completa de la película
 * - Trailer y galería de imágenes
 * - Reparto y equipo técnico
 * - Reseñas y calificaciones
 * - Películas similares
 * - Funcionalidad de favoritos
 */
@Component({
  selector: 'app-details-movie',
  imports: [],
  templateUrl: './details-movie.component.html',
  styleUrl: './details-movie.component.css'
})
export class DetailsMovieComponent {
  // Obtiene el ID de la película desde los parámetros de la URL
  movieId = inject(ActivatedRoute).snapshot.params['id'];

  // TODO: Implementar carga de datos de la película por ID
  // TODO: Agregar componente de trailer
  // TODO: Implementar galería de imágenes
  // TODO: Mostrar información del reparto
  // TODO: Agregar funcionalidad de favoritos
  // TODO: Implementar películas similares
 }
