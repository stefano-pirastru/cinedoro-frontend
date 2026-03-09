import { Component, OnInit } from '@angular/core'
import { FilmService } from '../../services/film.service'
import { Film } from '../../models/film'
import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs'
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms'

@Component({
  standalone: true,
  selector: 'app-home-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  films$: Observable<Film[]>;
  searchQuery: string = '';
  constructor(private filmService: FilmService) {
    this.films$ = this.filmService.getAllFilms();

  }

}