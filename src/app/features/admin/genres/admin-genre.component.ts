import { Component, OnInit, signal } from '@angular/core';
import { GenreService } from '../../../services/genre.service';
import { Genre } from '../../../models/genre';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-admin-genre',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
    templateUrl: './admin-genre.component.html',
    styleUrls: ['./admin-genre.component.css']
})
export class AdminGenreComponent implements OnInit {

    // Reactive list of genres
    genres = signal<any[]>([]);

    // New genre form model
    newGenre = signal<any>({ name: '' });

    constructor(private genreService: GenreService) { }

    ngOnInit(): void {
        this.loadGenres();
    }

    // Load all genres
    loadGenres() {
        this.genreService.getAllGenres().subscribe({
            next: (data) => this.genres.set(data),
            error: (err) => console.error('Error fetching genres:', err)
        });
    }

    // Create a new genre
    createGenre() {
        const genre = this.newGenre();
        if (!genre.name.trim()) return;

        this.genreService.createGenre(genre).subscribe({
            next: () => {
                this.newGenre.set({ name: '' });
                this.loadGenres();
            },
            error: (err) => console.error('Error creating genre:', err)
        });
    }

    // Delete a genre
    deleteGenre(id?: number) {
        if (!id) return;

        this.genreService.deleteGenre(id).subscribe({
            next: () => this.loadGenres(),
            error: (err) => console.error('Error deleting genre:', err)
        });
    }
}