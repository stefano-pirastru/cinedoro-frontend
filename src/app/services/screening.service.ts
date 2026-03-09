import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Screening } from '../models/screening'

@Injectable({
    providedIn: 'root'
})
export class ScreeningService {

    private apiUrl = 'http://localhost:8080/api/screenings'

    constructor(private http: HttpClient) { }

    getAllScreenings(): Observable<Screening[]> {
        return this.http.get<any[]>(this.apiUrl)
    }

    getScreeningsByFilm(filmId: number): Observable<Screening[]> {
        return this.http.get<any[]>(`${this.apiUrl}/film/${filmId}`)
    }

    getScreeningsByDate(date: string): Observable<Screening[]> {
        return this.http.get<any[]>(`${this.apiUrl}/date?date=${date}`)
    }
    getScreeningById(id: number): Observable<Screening> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
    // Create a new screening
    createScreening(screening: Screening): Observable<Screening> {
        return this.http.post<any>(this.apiUrl, screening)
    }

    // Update an existing screening
    updateScreening(id: number, screening: Screening): Observable<Screening> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, screening)
    }

    // Delete a screening by ID
    deleteScreening(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
    }
}