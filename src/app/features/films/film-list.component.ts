import { Component, OnInit } from '@angular/core'
import { FilmService } from '../../services/film.service'
import { Film } from '../../models/film'
import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs'
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms'

@Component({
    standalone: true,
    selector: 'app-film-list',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './film-list.component.html',
    styleUrl: './film-list.component.css'
})
export class FilmListComponent {

    films$: Observable<Film[]>;
    searchQuery: string = '';
    constructor(private filmService: FilmService) {
        this.films$ = this.filmService.getAllFilms();

    }
    searchFilms() {
        if (this.searchQuery.trim() === '') {
            // Empty query, load all films
            this.films$ = this.filmService.getAllFilms();
        } else {
            this.films$ = this.filmService.searchFilms(this.searchQuery);
        }
    }

}