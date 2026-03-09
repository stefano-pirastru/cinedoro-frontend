import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, Observable, of } from 'rxjs';

import { BookingService, BookingDTO } from '../../services/booking.service';
import { Ticket } from '../../services/ticket.service';

interface BookingDetails {
    booking: any;
    tickets: Ticket[];
    screening?: any;
    film?: any;
    seats: any[];
}

@Component({
    selector: 'app-my-bookings',
    templateUrl: './my-bookings.component.html',
    styleUrls: ['./my-bookings.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class MyBookingsComponent implements OnInit {
    bookings$: Observable<any[]> = of([]); // initialize as empty array

    constructor(private bookingService: BookingService) { }

    ngOnInit(): void {
        const userId = Number(localStorage.getItem('userId'));
        this.bookings$ = this.bookingService.getBookingDetails(userId).pipe(
            map(data => Array.isArray(data) ? data : [data]) // ensure it's always an array
        );
    }
}