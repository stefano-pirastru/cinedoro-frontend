import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Film } from '../models/film'

@Injectable({
    providedIn: 'root'
})
export class FilmService {

    private api = 'http://localhost:8080/api/film'

    constructor(private http: HttpClient) { }

    getAllFilms(): Observable<Film[]> {
        return this.http.get<Film[]>(`${this.api}`)
    }

    getFilmById(id: number): Observable<any> {
        return this.http.get<any>(`${this.api}/${id}`)
    }

    createFilm(film: Film, image?: File): Observable<Film> {
        const formData = new FormData();
        formData.append('film', new Blob([JSON.stringify(film)], { type: 'application/json' }));
        if (image) {
            formData.append('image', image);
        }
        return this.http.post<Film>(this.api, formData);
    }

    updateFilm(id: number, film: Film) {
        return this.http.put(`${this.api}/${id}`, film)
    }

    deleteFilm(id: number) {
        return this.http.delete(`${this.api}/${id}`)
    }
    searchFilms(query: string): Observable<Film[]> {
        let params = new HttpParams()
            .set('q', query)
        return this.http.get<Film[]>(`${this.api}/search`, { params });
    }

}