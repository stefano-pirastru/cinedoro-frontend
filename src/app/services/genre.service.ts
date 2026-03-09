import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Genre {
    id?: number;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class GenreService {

    private apiUrl = 'http://localhost:8080/api/genres';

    constructor(private http: HttpClient) { }

    getAllGenres(): Observable<Genre[]> {
        return this.http.get<Genre[]>(this.apiUrl);
    }

    getGenreById(id: number): Observable<Genre> {
        return this.http.get<Genre>(`${this.apiUrl}/${id}`);
    }

    createGenre(genre: Genre): Observable<Genre> {
        return this.http.post<Genre>(this.apiUrl, genre);
    }

    deleteGenre(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
