import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieCardComponent } from '../shared/components/movie-card/movie-card.component';
import { CinemaService } from '../shared/services/cinema.service';
import { Movie } from '../shared/interfaces/movie.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-upcoming',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './upcoming.component.html',
  styleUrl: './upcoming.component.css'
})
export class UpcomingComponent implements OnInit {
  // Estados reactivos para manejar la UI
  movies = signal<Movie[]>([]);           // Lista de películas próximas
  isLoading = signal<boolean>(true);      // Estado de carga
  hasError = signal<string>('');          // Mensaje de error

  // Inyección del servicio principal de cinema
  private cinemaService = inject(CinemaService);

  constructor() {}

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente
   * Carga automáticamente las películas próximas y los géneros simultáneamente
   */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Carga géneros y películas próximas simultáneamente
   * Esto asegura que los géneros estén disponibles cuando se rendericen las movie-cards
   */
  loadData(): void {
    this.isLoading.set(true);
    
    // Cargar géneros y películas próximas al mismo tiempo
    forkJoin({
      genres: this.cinemaService.getGenres(),
      movies: this.cinemaService.getUpcoming()
    }).subscribe({
      next: (data) => {
        console.log('Géneros cargados:', data.genres);
        console.log('Películas próximas cargadas:', data.movies);
        this.movies.set(data.movies);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando datos:', error);
        this.isLoading.set(false);
        this.hasError.set(error.message || 'Error al cargar los datos');
      }
    });
  }

  /**
   * Determina si se debe mostrar el botón de play en una película específica
   *
   * @param movie - Película a evaluar
   * @returns true si se debe mostrar el botón de play
   */
  shouldShowPlayButton(movie: Movie): boolean {
    // Para películas próximas, no mostramos botón de play por defecto
    return false;
  }

  /**
   * Determina si se deben mostrar iconos adicionales en una película específica
   *
   * @param movie - Película a evaluar
   * @returns true si se deben mostrar iconos
   */
  shouldShowIcons(movie: Movie): boolean {
    // Para películas próximas, no mostramos iconos adicionales por defecto
    return false;
  }
}
