import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieCardComponent } from '../shared/components/movie-card/movie-card.component';
import { Movie } from '../shared/interfaces/movie.interface';
import { CinemaService } from '../shared/services/cinema.service';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-now-playing',
  imports: [MovieCardComponent, RouterLink],
  templateUrl: './now-playing.component.html',
  styleUrl: './now-playing.component.css'
})
export class NowPlayingComponent implements OnInit {
 // Estados reactivos para manejar la UI
  movies = signal<Movie[]>([]);           // Lista de películas
  isLoading = signal<boolean>(true);      // Estado de carga
  hasError = signal<string>('');          // Mensaje de error

  // Inyección del servicio principal de cinema
  private cinemaService = inject(CinemaService);

  constructor() {}

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente
   * Carga automáticamente las películas en cartelera y los géneros simultáneamente
   */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Carga géneros y películas simultáneamente
   * Esto asegura que los géneros estén disponibles cuando se rendericen las movie-cards
   */
  loadData(): void {
    this.isLoading.set(true);
    
    // Cargar géneros y películas al mismo tiempo
    forkJoin({
      genres: this.cinemaService.getGenres(),
      movies: this.cinemaService.getNowPlaying()
    }).subscribe({
      next: (data) => {
        console.log('Géneros cargados:', data.genres);
        console.log('Películas cargadas:', data.movies);
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
    return movie.title === 'The Space Between Us';
  }

  /**
   * Determina si se deben mostrar iconos adicionales en una película específica
   *
   * @param movie - Película a evaluar
   * @returns true si se deben mostrar iconos
   */
  shouldShowIcons(movie: Movie): boolean {
    return movie.title === 'Money Monster';
  }
}
