import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ticket {
    id: number;
    bookingId: number;
    screeningId: number;
    seatId: number;
    price: number;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
    private baseUrl = 'http://localhost:8080/api/tickets';

    constructor(private http: HttpClient) { }

    createTicket(ticket: { bookingId: number; screeningId: number; seatId: number; price: number }): Observable<Ticket> {
        return this.http.post<Ticket>(this.baseUrl, ticket);
    }

    getTicketById(id: number): Observable<Ticket> {
        return this.http.get<Ticket>(`${this.baseUrl}/${id}`);
    }

    getTicketsByBooking(bookingId: number): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.baseUrl}/by-booking/${bookingId}`);
    }

    getTicketsByScreening(screeningId: number): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.baseUrl}/by-screening/${screeningId}`);
    }

    getTicketsByUser(userId: number): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.baseUrl}/by-user/${userId}`);
    }

    getOccupiedSeats(screeningId: number): Observable<number[]> {
        return this.http.get<number[]>(`${this.baseUrl}/occupied-seats/${screeningId}`)
    }

    deleteTicket(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}