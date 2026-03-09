import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Observable, combineLatest, map, switchMap, tap } from 'rxjs';
import { Screening } from '../../models/screening';
import { Film } from '../../models/film';
import { SeatService } from '../../services/seat.service';
import { CinemaService, CinemaServiceService } from '../../services/cinema-service.service';
import { ScreeningService } from '../../services/screening.service';
import { FilmService } from '../../services/film.service';
import { BookingService } from '../../services/booking.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { Seat } from '../../models/seat';

interface BookingViewModel {
  screening: Screening;
  film: Film;
  seats: Seat[];
  services: CinemaService[];
}

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-booking',
  templateUrl: './booking.html',
  styleUrls: ['./booking.css'],
  standalone: true
})
export class BookingComponent {

  bookingData$!: Observable<BookingViewModel>;
  selectedSeats: number[] = [];
  selectedServices: { [key: number]: number } = {};
  bookingInProgress = false;
  occupiedSeats: number[] = [];
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private screeningService: ScreeningService,
    private filmService: FilmService,
    private seatService: SeatService,
    private cinemaServiceService: CinemaServiceService,
    private bookingService: BookingService,
    private ticketService: TicketService,
    private userService: UserService,
    private location: Location
  ) {

    const screeningId = Number(this.route.snapshot.paramMap.get('screeningId'));
    console.log('SCREENING ID FROM ROUTE:', screeningId);

    const userToken = this.userService.getToken();
    console.log('USER TOKEN:', userToken);

    if (!userToken) {
      alert('Please log in to make a booking');
      this.router.navigate(['/login']);
      return;
    }

    this.bookingData$ = this.screeningService.getScreeningById(screeningId).pipe(

      tap(screening => console.log('SCREENING RESPONSE:', screening)),

      switchMap(screening => {
        return this.ticketService.getOccupiedSeats(screening.id || 0).pipe(
          tap(occupied => console.log('OCCUPIED SEATS RESPONSE:', occupied)),
          map(occupied => ({ screening, occupiedSeats: occupied }))
        );
      }),

      switchMap(({ screening, occupiedSeats }) => {

        console.log('OCCUPIED SEATS SET:', occupiedSeats);
        this.occupiedSeats = occupiedSeats;

        return combineLatest([

          this.filmService.getFilmById(screening.filmId).pipe(
            tap(film => console.log('FILM RESPONSE:', film))
          ),

          this.seatService.getSeatsByHall(screening.hallId).pipe(
            tap(seats => console.log('SEATS RESPONSE:', seats))
          ),

          this.cinemaServiceService.getAllServices().pipe(
            tap(services => console.log('SERVICES RESPONSE:', services))
          )

        ]).pipe(
          map(([film, seats, services]) => {

            const viewModel = { screening, film, seats, services };

            console.log('FINAL BOOKING VIEW MODEL:', viewModel);

            return viewModel;
          })
        );
      })
    );
  }

  toggleSeat(seatId: number) {

    console.log('TOGGLE SEAT CLICKED:', seatId);

    if (this.occupiedSeats.includes(seatId)) {
      console.log('SEAT IS OCCUPIED, CANNOT SELECT');
      return;
    }

    if (this.selectedSeats.includes(seatId)) {
      this.selectedSeats = this.selectedSeats.filter(id => id !== seatId);
    } else {
      this.selectedSeats.push(seatId);
    }

    console.log('SELECTED SEATS:', this.selectedSeats);
  }

  isSeatOccupied(seatId: number): boolean {
    return this.occupiedSeats.includes(seatId);
  }

  updateServiceQuantity(serviceId: number, quantity: number) {

    console.log('SERVICE UPDATED:', serviceId, 'QTY:', quantity);

    if (quantity <= 0) {
      delete this.selectedServices[serviceId];
    } else {
      this.selectedServices[serviceId] = quantity;
    }

    console.log('SELECTED SERVICES:', this.selectedServices);
  }

  calculateTotal(viewModel: BookingViewModel): number {

    const ticketsTotal = this.selectedSeats.length * viewModel.screening.basePrice;

    const servicesTotal = Object.entries(this.selectedServices)
      .reduce((sum, [id, qty]) => {
        const service = viewModel.services.find(s => s.id === Number(id));
        return sum + (service ? service.price * qty : 0);
      }, 0);

    const total = ticketsTotal + servicesTotal;

    console.log('TOTAL PRICE CALCULATED:', total);

    return total;
  }

  handleBooking(viewModel: BookingViewModel) {

    console.log('BOOKING STARTED');

    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    const userId = this.getCurrentUserId();
    console.log('CURRENT USER ID:', userId);

    if (!userId) {
      alert('Please log in to complete the booking');
      this.router.navigate(['/login']);
      return;
    }

    if (this.bookingInProgress) {
      console.log('BOOKING ALREADY IN PROGRESS');
      return;
    }

    this.bookingInProgress = true;

    const bookingPayload = {
      userId: userId,
      screeningId: viewModel.screening.id || 0,
      totalPrice: this.calculateTotal(viewModel)
    };

    console.log('CREATE BOOKING PAYLOAD:', bookingPayload);

    this.bookingService.createBooking(bookingPayload).subscribe({

      next: booking => {

        console.log('BOOKING CREATED:', booking);

        const ticketObservables = this.selectedSeats.map(seatId => {

          const payload = {
            bookingId: booking.id,
            screeningId: viewModel.screening.id || 0,
            seatId,
            price: viewModel.screening.basePrice
          };

          console.log('CREATE TICKET PAYLOAD:', payload);

          return this.ticketService.createTicket(payload).pipe(
            tap(ticket => console.log('TICKET CREATED:', ticket))
          );
        });

        combineLatest(ticketObservables).subscribe({

          next: tickets => {

            console.log('ALL TICKETS CREATED:', tickets);

            const bookedServices = Object.entries(this.selectedServices)
              .filter(([_, qty]) => qty > 0)
              .map(([serviceId, qty]) => ({
                bookingId: booking.id,
                extraProductId: Number(serviceId),
                quantity: qty
              }));

            console.log('BOOKED SERVICES PAYLOAD:', bookedServices);

            if (bookedServices.length > 0) {

              this.bookingService.addServicesToBooking(bookedServices).subscribe({

                next: res => {
                  console.log('SERVICES ADDED TO BOOKING:', res);
                  this.router.navigate(['/ticket', booking.id]);
                  this.bookingInProgress = false;
                },

                error: err => {
                  console.error('FAILED TO ADD SERVICES:', err);
                  this.router.navigate(['/ticket', booking.id]);
                  this.bookingInProgress = false;
                }

              });

            } else {

              console.log('NO EXTRA SERVICES SELECTED');
              this.router.navigate(['/ticket', booking.id]);
              this.bookingInProgress = false;

            }
          },

          error: err => {
            console.error('TICKET CREATION FAILED:', err);
            alert('Failed to create tickets.');
            this.bookingInProgress = false;
          }

        });

      },

      error: err => {
        console.error('BOOKING CREATION FAILED:', err);
        alert('Failed to create booking.');
        this.bookingInProgress = false;
      }

    });
  }

  private getCurrentUserId(): number | null {

    const userIdStr = localStorage.getItem('userId');

    console.log('USER ID FROM LOCAL STORAGE:', userIdStr);

    if (userIdStr) {
      return parseInt(userIdStr, 10);
    }

    return null;
  }
  goBack() {
    this.location.back();
  }

  getSeatsByRow(seats: Seat[]): { [row: number]: Seat[] } {

    console.log('GROUPING SEATS BY ROW');

    const grouped: { [row: number]: Seat[] } = {};

    seats.forEach(seat => {
      if (!grouped[seat.rowNumber]) grouped[seat.rowNumber] = [];
      grouped[seat.rowNumber].push(seat);
    });

    console.log('GROUPED SEATS:', grouped);

    return grouped;
  }

}