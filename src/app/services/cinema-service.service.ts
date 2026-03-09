import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CinemaService {
    id: number;
    name: string;
    description: string;
    price: number;
}

@Injectable({ providedIn: 'root' })
export class CinemaServiceService {
    private baseUrl = 'http://localhost:8080/api/cinema-services';

    constructor(private http: HttpClient) { }

    getAllServices(): Observable<any[]> {
        return this.http.get<any[]>(this.baseUrl);
    }

    createService(service: Partial<CinemaService>): Observable<CinemaService> {
        return this.http.post<any>(this.baseUrl, service);
    }

    updateService(id: number, service: Partial<CinemaService>): Observable<CinemaService> {
        return this.http.put<CinemaService>(`${this.baseUrl}/${id}`, service);
    }

    deleteService(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    bookService(request: { bookingId: number, extraProductId: number, quantity: number }): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/book`, request);
    }
}