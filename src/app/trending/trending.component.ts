import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieCardComponent } from '../shared/components/movie-card/movie-card.component';
import { CinemaService } from '../shared/services/cinema.service';
import { Movie } from '../shared/interfaces/movie.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './trending.component.html',
  styleUrl: './trending.component.css'
})
export class TrendingComponent implements OnInit {
  // Estados reactivos para el componente
  movies = signal<Movie[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  timeWindow = signal<'day' | 'week'>('day');

  // Inyección del servicio de cinema
  private cinemaService = inject(CinemaService);

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Carga los datos necesarios: géneros y películas en tendencia
   * Usa forkJoin para cargar ambos simultáneamente
   */
  private loadData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      genres: this.cinemaService.getGenres(),
      trending: this.cinemaService.getTrending(this.timeWindow())
    }).subscribe({
      next: ({ trending }) => {
        this.movies.set(trending);
        this.isLoading.set(false);
        console.log('Películas en tendencia cargadas:', trending);
      },
      error: (error) => {
        this.error.set(error.message || 'Error al cargar las películas en tendencia');
        this.isLoading.set(false);
        console.error('Error:', error);
      }
    });
  }

  /**
   * Cambia el período de tiempo (día/semana) y recarga los datos
   */
  toggleTimeWindow(): void {
    const newTimeWindow = this.timeWindow() === 'day' ? 'week' : 'day';
    this.timeWindow.set(newTimeWindow);
    this.loadData();
  }

  /**
   * Determina si se debe mostrar el botón de play en una película específica
   */
  shouldShowPlayButton(movie: Movie): boolean {
    return movie.rating >= 7.0;
  }

  /**
   * Determina si se deben mostrar iconos adicionales en una película específica
   */
  shouldShowIcons(movie: Movie): boolean {
    return movie.popularity > 100;
  }

  /**
   * Getter para el estado de error
   */
  hasError(): string | null {
    return this.error();
  }
}
