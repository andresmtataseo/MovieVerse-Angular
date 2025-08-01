import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../interfaces/movie.interface';
import { CinemaService } from '../../services/cinema.service';
import { Genre } from '../../interfaces/genre.interface';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
  // Inputs reactivos para recibir datos del componente padre
  movie = input.required<Movie>();           // Película a mostrar (requerido)
  showPlayButton = input<boolean>(false);    // Mostrar botón de play (opcional)
  showIcons = input<boolean>(false);         // Mostrar iconos adicionales (opcional)

  // Inyección del servicio para acceder a los géneros
  genres = inject(CinemaService).genres;

  /**
   * Determina el color del badge de rating basado en la calificación
   *
   * @param rating - Calificación de la película (0-10)
   * @returns Clase CSS para el color del badge
   */
  getRatingColor(rating: number): string {
    if (rating >= 8.0) return 'bg-green-500';    // Excelente
    if (rating >= 7.0) return 'bg-yellow-500';   // Buena
    if (rating >= 6.0) return 'bg-orange-500';   // Regular
    return 'bg-red-500';                         // Mala
  }

  /**
   * Obtiene los objetos Genre completos basándose en los IDs de géneros
   *
   * @param genres - Array de IDs de géneros
   * @returns Array de objetos Genre con nombre e ID
   */
  getGenres(genres: number[]): Genre[] {
    return this.genres().filter(
        genre => genres.includes(genre.id))
        .map(genre => genre);
  }

  /**
   * Calcula la representación visual de estrellas para el rating
   * Convierte el rating de 10 puntos a un sistema de 5 estrellas
   *
   * @param rating - Calificación de la película (0-10)
   * @returns Objeto con el número de estrellas llenas, medias y vacías
   */
  getRatingStars(rating: number): { full: number; half: boolean; empty: number } {
    // Convertir rating de 10 a 5 estrellas
    const starsRating = rating / 2;
    const fullStars = Math.floor(starsRating);
    const hasHalfStar = starsRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return {
      full: fullStars,
      half: hasHalfStar,
      empty: emptyStars
    };
  }

  /**
   * Maneja el error de carga de imagen y establece una imagen placeholder
   *
   * @param event - Evento de error de la imagen
   */
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/placeholder-movie.svg';
  }
}
