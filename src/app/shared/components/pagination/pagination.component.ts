import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() isLoading: boolean = false;
  
  @Output() pageChange = new EventEmitter<number>();

  /**
   * Navega a la página anterior
   */
  goToPreviousPage(): void {
    if (this.currentPage > 1 && !this.isLoading) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  /**
   * Navega a la página siguiente
   */
  goToNextPage(): void {
    if (this.currentPage < this.totalPages && !this.isLoading) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  /**
   * Navega a una página específica
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage && !this.isLoading) {
      this.pageChange.emit(page);
    }
  }

  /**
   * Genera un array de números de página para mostrar
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas alrededor de la actual
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  /**
   * Verifica si se debe mostrar el botón de primera página
   */
  shouldShowFirstPage(): boolean {
    return this.currentPage > 3 && this.totalPages > 5;
  }

  /**
   * Verifica si se debe mostrar el botón de última página
   */
  shouldShowLastPage(): boolean {
    return this.currentPage < this.totalPages - 2 && this.totalPages > 5;
  }
}