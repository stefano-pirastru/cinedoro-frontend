import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seat } from '../models/seat';

// export interface Seat {
//     id: number;
//     rowNumber: number;
//     seatNumber: number;
//     hall: { id: number; name: string; capacity: number };
// }

@Injectable({ providedIn: 'root' })
export class SeatService {
    private baseUrl = 'http://localhost:8080/api/seats';

    constructor(private http: HttpClient) { }

    getSeatsByHall(hallId: number): Observable<Seat[]> {
        return this.http.get<Seat[]>(`${this.baseUrl}/hall/${hallId}`);
    }
    getSeatsByid(hallId: number): Observable<Seat[]> {
        return this.http.get<Seat[]>(`${this.baseUrl}/${hallId}`);
    }
}