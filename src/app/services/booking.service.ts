import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

export interface BookingDTO {
    id: any;
    userId: number;
    screeningId: number;
    totalPrice: number;
}

export interface BookedServiceDTO {
    bookingId: number;
    extraProductId: number;
    quantity: number;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
    private baseUrl = 'http://localhost:8080/api/bookings';
    private bookedServicesUrl = 'http://localhost:8080/api/booked-services';

    constructor(private http: HttpClient) { }

    createBooking(booking: { userId: number; screeningId: number; totalPrice: number }): Observable<BookingDTO> {
        return this.http.post<BookingDTO>(this.baseUrl, booking);
    }

    getBookingById(id: number): Observable<BookingDTO> {
        return this.http.get<BookingDTO>(`${this.baseUrl}/${id}`);
    }

    getBookingsByUser(userId: number): Observable<BookingDTO[]> {
        return this.http.get<BookingDTO[]>(`${this.baseUrl}/user/${userId}`);
    }

    // Add each service one at a time
    addServicesToBooking(services: BookedServiceDTO[]): Observable<any> {
        const serviceRequests = services.map(service =>
            this.http.post(`${this.bookedServicesUrl}`, service)
        );
        // Execute all requests in parallel
        return forkJoin(serviceRequests);
    }

    getBookedServices(bookingId: number): Observable<BookedServiceDTO[]> {
        return this.http.get<BookedServiceDTO[]>(`${this.bookedServicesUrl}/booking/${bookingId}`);
    }

    removeService(bookingId: number, extraProductId: number): Observable<void> {
        return this.http.delete<void>(`${this.bookedServicesUrl}/${bookingId}/${extraProductId}`);
    }

    deleteBooking(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
    getBookingDetails(userId: number) {
        return this.http.get<any[]>(`${this.baseUrl}/user/${userId}/details`);
    }
}