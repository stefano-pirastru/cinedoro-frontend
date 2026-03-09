import { Component, OnInit, signal, WritableSignal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScreeningService } from '../../../../app/services/screening.service';
import { FilmService } from '../../../../app/services/film.service';
import { HallService } from '../../../../app/services/hall.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-screenings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './screenings.html',
  styleUrl: './screenings.css',
})
export class Screenings implements OnInit {
  // Signals for reactive state using any
  screenings: WritableSignal<any[]> = signal([]);
  films: WritableSignal<any[]> = signal([]);
  halls: WritableSignal<any[]> = signal([]);
  loading: WritableSignal<any> = signal(true);
  showCreateForm: WritableSignal<any> = signal(false);
  showEditForm: WritableSignal<any> = signal(false);

  newScreening: WritableSignal<any> = signal({
    filmId: 0,
    hallId: 0,
    screeningDate: '',
    screeningTime: '',
    basePrice: 0,
  });

  editScreening: WritableSignal<any | null> = signal(null);
  editingScreeningId: WritableSignal<any | null> = signal(null);

  constructor(
    private screeningService: ScreeningService,
    private filmService: FilmService,
    private hallService: HallService
  ) { }

  ngOnInit(): void {
    this.getAllScreenings();
    this.loadFilms();
    this.loadHalls();
  }

  getAllScreenings(): void {
    this.loading.set(true);
    this.screeningService.getAllScreenings().subscribe({
      next: (data: any) => {
        this.screenings.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching screenings', err);
        this.loading.set(false);
      },
    });
  }

  loadFilms(): void {
    this.filmService.getAllFilms().subscribe({
      next: (data: any) => this.films.set(data),
      error: (err: any) => console.error('Error fetching films', err),
    });
  }

  loadHalls(): void {
    this.hallService.getAllHalls().subscribe({
      next: (data: any) => this.halls.set(data),
      error: (err: any) => console.error('Error fetching halls', err),
    });
  }

  showCreateScreeningForm(): void {
    this.showCreateForm.set(true);
    this.newScreening.set({ filmId: 0, hallId: 0, screeningDate: '', screeningTime: '', basePrice: 0 });
  }

  cancelCreate(): void {
    this.showCreateForm.set(false);
  }

  createScreening(): void {
    const screening = this.newScreening();
    if (screening.filmId && screening.hallId && screening.screeningDate && screening.screeningTime && screening.basePrice !== undefined) {
      this.screeningService.createScreening(screening).subscribe({
        next: () => {
          this.getAllScreenings();
          this.cancelCreate();
        },
        error: (err: any) => console.error('Error creating screening', err),
      });
    }
  }

  showEditScreeningForm(screening: any): void {
    this.editScreening.set({ ...screening });
    this.editingScreeningId.set(screening.id);
    this.showEditForm.set(true);
  }

  cancelEdit(): void {
    this.showEditForm.set(false);
    this.editScreening.set(null);
    this.editingScreeningId.set(null);
  }

  updateScreening(): void {
    const editing = this.editScreening();
    if (editing && editing.id) {
      this.screeningService.updateScreening(editing.id, editing).subscribe({
        next: () => {
          this.getAllScreenings();
          this.cancelEdit();
        },
        error: (err: any) => console.error('Error updating screening', err),
      });
    }
  }

  deleteScreening(id: any): void {
    this.screeningService.deleteScreening(id).subscribe({
      next: () => this.getAllScreenings(),
      error: (err: any) => console.error('Error deleting screening', err),
    });
  }

  // Computed signal: whether there are screenings
  hasScreenings = computed(() => this.screenings().length > 0);
}