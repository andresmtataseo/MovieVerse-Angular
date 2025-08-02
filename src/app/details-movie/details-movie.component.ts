import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CinemaService } from '../shared/services/cinema.service';
import { MovieDetails } from '../shared/interfaces/movie-details.interface';

/**
 * Página de detalle de película
 * 
 * Muestra información completa de una película específica:
 * - Información básica (título, sinopsis, calificación)
 * - Géneros y detalles técnicos
 * - Compañías de producción
 * - Países y idiomas
 * - Imágenes (poster y backdrop)
 */
@Component({
  selector: 'app-details-movie',
  imports: [CommonModule],
  templateUrl: './details-movie.component.html',
  styleUrl: './details-movie.component.css'
})
export class DetailsMovieComponent implements OnInit {
  // Servicios inyectados
  private readonly cinemaService = inject(CinemaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Estados reactivos
  movieDetails = signal<MovieDetails | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // ID de la película obtenido de la URL
  movieId = this.route.snapshot.params['id'];

  ngOnInit(): void {
    this.loadMovieDetails();
  }

  /**
   * Carga los detalles de la película
   */
  private loadMovieDetails(): void {
    if (!this.movieId) {
      this.error.set('ID de película no válido');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.cinemaService.getMovieDetails(Number(this.movieId)).subscribe({
      next: (details) => {
        this.movieDetails.set(details);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar los detalles de la película');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Navega de vuelta a la página anterior
   */
  goBack(): void {
    this.router.navigate(['/']);
  }

  /**
   * Formatea la duración en minutos a horas y minutos
   */
  formatRuntime(runtime: number | null): string {
    if (!runtime) return 'No disponible';
    
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  /**
   * Formatea el presupuesto o ingresos con separadores de miles
   */
  formatCurrency(amount: number): string {
    if (amount === 0) return 'No disponible';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Formatea la fecha de lanzamiento
   */
  formatReleaseDate(date: string): string {
    if (!date) return 'No disponible';
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Maneja errores de carga de imágenes
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/placeholder-movie.svg';
  }
}
