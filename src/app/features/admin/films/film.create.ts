import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { FilmService } from '../../../services/film.service';
import { ActorService } from '../../../services/actor.service';
import { DirectorService } from '../../../services/director.service';
import { GenreService } from '../../../services/genre.service';

@Component({
    standalone: true,
    selector: 'app-admin-film-create',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './film.create.html',
    styleUrls: ['./film.create.css']
})
export class AdminFilmCreateComponent implements OnInit {

    filmForm = {
        title: '',
        description: '',
        durationMinutes: 0,
        releaseDate: '',
        ageRating: null as number | null,
        directorId: null as number | null,
        actorIds: [] as number[],
        genreIds: [] as number[]
    };

    imageFile: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;
    loading = false;

    directors: any[] = [];
    actors: any[] = [];
    genres: any[] = [];

    constructor(
        private filmService: FilmService,
        private actorService: ActorService,
        private directorService: DirectorService,
        private genreService: GenreService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadDropdownData();
    }

    loadDropdownData() {
        this.actorService.getAllActors().subscribe(data => this.actors = data);
        this.directorService.getAllDirectors().subscribe(data => this.directors = data);
        this.genreService.getAllGenres().subscribe(data => this.genres = data);
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;

        if (!input.files || input.files.length === 0) return;

        this.imageFile = input.files[0];

        const reader = new FileReader();
        reader.onload = () => this.imagePreview = reader.result;
        reader.readAsDataURL(this.imageFile);
    }

    createFilm() {

        if (!this.filmForm.title ||
            !this.filmForm.description ||
            !this.filmForm.durationMinutes ||
            !this.filmForm.releaseDate) {
            alert('Please fill all required fields');
            return;
        }

        this.loading = true;

        const film = {
            title: this.filmForm.title,
            description: this.filmForm.description,
            durationMinutes: this.filmForm.durationMinutes,
            releaseDate: this.filmForm.releaseDate,
            ageRating: this.filmForm.ageRating,
            director: this.filmForm.directorId ? { id: this.filmForm.directorId } : null,
            actors: this.filmForm.actorIds.map(id => ({ id })),
            genres: this.filmForm.genreIds.map(id => ({ id }))
        };

        this.filmService.createFilm(film as any, this.imageFile || undefined).subscribe({
            next: () => {
                alert('Film created successfully!');
                this.router.navigate(['/admin/films']);
            },
            error: err => {
                console.error('Error creating film', err);
                this.loading = false;
            }
        });
    }
}