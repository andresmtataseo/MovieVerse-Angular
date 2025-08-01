import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private sidebarService: SidebarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.sidebarService.isOpen$.subscribe(
      isOpen => this.isOpen = isOpen
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeSidebar(): void {
    this.sidebarService.close();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeSidebar();
  }
}
