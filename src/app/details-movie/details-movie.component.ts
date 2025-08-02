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
   * Maneja errores de carga de imágenes generales
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/placeholder-movie.svg';
  }

  /**
   * Maneja errores de carga de logos de compañías de producción
   */
  onCompanyLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Ocultar la imagen y mostrar el placeholder SVG
    img.style.display = 'none';
    
    // Buscar el contenedor padre y agregar una clase para mostrar el placeholder
    const container = img.closest('.w-20.h-20');
    if (container) {
      container.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-base-300 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-8 w-8 text-base-content/40" 
               fill="none" 
               viewBox="0 0 24 24" 
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      `;
    }
  }
}
