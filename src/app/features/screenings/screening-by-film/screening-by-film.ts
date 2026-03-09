import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FilmService } from '../../../services/film.service';
import { Film } from '../../../models/film';
import { Screening } from '../../../models/screening';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { switchMap, map, startWith, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-screening-by-film',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './screening-by-film.html',
  styleUrls: ['./screening-by-film.css']
})
export class ScreeningByFilmComponent {
  // Observable of the current film
  film$: Observable<Film | null>;
  loading: any;
  screenings: any;
  film: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private filmService: FilmService
  ) {
    this.film$ = this.route.paramMap.pipe(
      map(params => Number(params.get('filmId'))),
      switchMap(filmId =>
        this.filmService.getFilmById(filmId).pipe(
          catchError(err => {
            console.error('Failed to load film', err);
            return of(null); // fallback to null if error occurs
          }),
          startWith(null) // emit null immediately for loading state
        )
      )
    );
  }

  // Group screenings by date
  getGroupedScreenings(screenings: Screening[]): { [date: string]: Screening[] } {
    const grouped: { [key: string]: Screening[] } = {};
    screenings.forEach(s => {
      if (!grouped[s.screeningDate]) {
        grouped[s.screeningDate] = [];
      }
      grouped[s.screeningDate].push(s);
    });
    return grouped;
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  formatTime(timeString: string) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  }

  goBack() {
    this.router.navigate(['/films']);
  }
}