import { Routes } from '@angular/router';
import { NowPlayingComponent } from './now-playing/now-playing.component';
import { TrendingComponent } from './trending/trending.component';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { DetailsMovieComponent } from './details-movie/details-movie.component';

export const routes: Routes = [
  { path: '', redirectTo: '/now-playing', pathMatch: 'full' },
  { path: 'now-playing', component: NowPlayingComponent },
  { path: 'trending', component: TrendingComponent },
  { path: 'upcoming', component: UpcomingComponent },
  { path: 'details-movie/:id', component: DetailsMovieComponent },
  { path: 'favorites', component: NowPlayingComponent }, // Temporalmente redirige a now-playing
  { path: '**', redirectTo: '/now-playing' }
];
