import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from "@angular/router";
import { FilmService } from '../../../services/film.service';
import { Film } from '../../../models/film';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-admin-film-list',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './film-list.component.html',
    styleUrl: './film-list.component.css'
})
export class AdminFilmListComponent {

    films$: Observable<any>;
    searchQuery: string = '';

    constructor(private filmService: FilmService) {
        this.films$ = this.filmService.getAllFilms();
    }

    deleteFilm(id: number) {
        if (confirm('Are you sure you want to delete this film?')) {
            this.filmService.deleteFilm(id).subscribe(() => {
                this.refreshFilms();
            });
        }
    }

    searchFilms() {
        if (this.searchQuery.trim() === '') {
            this.refreshFilms();
        } else {
            this.films$ = this.filmService.searchFilms(this.searchQuery);
        }
    }

    private refreshFilms() {
        this.films$ = this.filmService.getAllFilms();
    }
}