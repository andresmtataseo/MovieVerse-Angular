import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieCardComponent } from '../shared/components/movie-card/movie-card.component';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { CinemaService } from '../shared/services/cinema.service';
import { Movie } from '../shared/interfaces/movie.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [MovieCardComponent, PaginationComponent],
  templateUrl: './trending.component.html',
  styleUrl: './trending.component.css'
})
export class TrendingComponent implements OnInit {
  // Estados reactivos para el componente
  movies = signal<Movie[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  timeWindow = signal<'day' | 'week'>('day');
  currentPage = signal<number>(1);        // Página actual
  totalPages = signal<number>(1);         // Total de páginas

  // Inyección del servicio de cinema
  private cinemaService = inject(CinemaService);

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Carga los datos necesarios: géneros y películas en tendencia
   * Usa forkJoin para cargar ambos simultáneamente
   */
  private loadData(page?: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      genres: this.cinemaService.getGenres(),
      trending: this.cinemaService.getTrending(this.timeWindow(), page)
    }).subscribe({
      next: ({ trending }) => {
        this.movies.set(trending);
        this.currentPage.set(this.cinemaService.trendingPage());
        this.totalPages.set(this.cinemaService.trendingTotalPages());
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
    this.currentPage.set(1); // Resetear a la primera página
    this.loadData(1);
  }

  /**
   * Maneja el cambio de página
   */
  onPageChange(page: number): void {
    this.loadData(page);
    // Scroll hacia arriba para mejor UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
