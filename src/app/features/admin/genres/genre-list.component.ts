import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Genre } from '../../../models/genre';
import { GenreService } from '../../../services/genre.service';

@Component({
  standalone: true,
  selector: 'app-genre-list',
  imports: [FormsModule],
  templateUrl: './genre-list.component.html',
  styleUrl: './genre-list.component.css',
})
export class GenreListComponent implements OnInit {
  // SIGNAL:
  // questo crea uno stato reattivo. Il template che legge genres()
  // viene notificato ogni volta che il valore cambia.
  genres = signal<Genre[]>([]);

  // Anche questi sono signal: stesso motivo di genres.
  // Se cambia uno di questi valori, la view si aggiorna subito.
  newGenreName = signal('');
  errorMessage = signal('');
  isLoading = signal(false);
  isSaving = signal(false);

  constructor(private genreService: GenreService) {}

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres(): void {
    // SET:
    // rimpiazza completamente il valore corrente del signal.
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.genreService.getAllGenres().subscribe({
      next: (genres) => {
        // SET su genres:
        // sostituisce l'intera lista con quella arrivata dal backend.
        this.genres.set(genres);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Errore durante il caricamento dei generi.');
        this.isLoading.set(false);
      },
    });
  }

  // Separa la scrittura dell'input dalla create:
  // il signal tiene il valore attuale e il template lo legge con newGenreName().
  onGenreNameChange(value: string): void {
    // SET sul signal collegato all'input:
    // salvo l'ultimo testo digitato.
    this.newGenreName.set(value);
  }

  createGenre(): void {
    // LETTURA DEL SIGNAL:
    // un signal si legge chiamandolo come funzione, quindi newGenreName().
    const name = this.newGenreName().trim();

    if (!name) {
      this.errorMessage.set('Inserisci il nome del genere.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.genreService
      .createGenre({ name })
      // Anche dentro finalize aggiorno un signal:
      // appena la request finisce, il bottone si riabilita.
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (createdGenre) => {
          this.newGenreName.set('');

          // UPDATE:
          // parte dal valore attuale del signal e costruisce il nuovo valore.
          // Qui prendo la lista esistente e aggiungo in coda il genere creato.
          // Questo evita di aspettare un altro loadGenres() per vedere il record.
          this.genres.update((genres) => [...genres, createdGenre]);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Create genre failed', error);
          this.errorMessage.set(
            error.error?.message || error.message || 'Errore durante la creazione del genere.',
          );
        },
      });
  }

  deleteGenre(id: number): void {
    this.errorMessage.set('');

    this.genreService.deleteGenre(id).subscribe({
      next: () => {
        // UPDATE:
        // trasformo la lista corrente rimuovendo il genere cancellato.
        this.genres.update((genres) => genres.filter((genre) => genre.id !== id));
      },
      error: () => {
        this.errorMessage.set("Errore durante l'eliminazione del genere.");
      },
    });
  }
}
