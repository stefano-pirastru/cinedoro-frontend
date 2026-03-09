import { Component, OnInit } from '@angular/core'
import { SeatService } from '../../../services/seat.service'
import { TicketService } from '../../../services/ticket.service'
import { Seat } from '../../../models/seat'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { BookingService } from '../../../services/booking.service'
import { ScreeningService } from '../../../services/screening.service'
import { UserService } from '../../../services/user.service'
import { CinemaService, CinemaServiceService } from '../../../services/cinema-service.service'
import { Screening } from '../../../models/screening'
import { forkJoin, switchMap, map, tap } from 'rxjs'
import { FormsModule } from '@angular/forms'

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.html',
  styleUrls: ['./seat-selection.css']
})
export class SeatSelectionComponent implements OnInit {

  seats: Seat[] = []
  seatMatrix: Seat[][] = []
  occupiedSeats: number[] = []
  selectedSeats: number[] = []

  screening: Screening | null = null
  screeningId!: number
  loading = false
  errorMessage = ''

  cinemaServices: CinemaService[] = []
  selectedServices: { [serviceId: number]: number } = {}

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private seatService: SeatService,
    private ticketService: TicketService,
    private bookingService: BookingService,
    private screeningService: ScreeningService,
    private userService: UserService,
    private cinemaService: CinemaServiceService
  ) { }

  ngOnInit() {

    console.log("SeatSelectionComponent initialized")

    if (!this.userService.isLoggedIn()) {
      console.log("User not logged in")
      alert('Please log in to continue')
      this.router.navigate(['/login'])
      return
    }

    console.log("User logged in")

    this.screeningId = Number(this.route.snapshot.paramMap.get('screeningId'))
    console.log("Screening ID from route:", this.screeningId)

    this.screeningService.getScreeningById(this.screeningId).subscribe({
      next: screening => {
        console.log("Screening loaded:", screening)

        this.screening = screening
        this.loadSeats()
        this.loadOccupiedSeats()
      },
      error: err => {
        console.error("Error loading screening:", err)
        this.errorMessage = 'Failed to load screening information'
      }
    })

    this.cinemaService.getAllServices().subscribe({
      next: services => {
        console.log("Cinema services loaded:", services)
        this.cinemaServices = services
      },
      error: err => {
        console.error("Error loading cinema services:", err)
        this.errorMessage = 'Failed to load cinema services'
      }
    })
  }

  getSelectedServicesTotal(): number {
    console.log("Calculating selected services total", this.selectedServices)

    let total = 0

    for (const serviceId in this.selectedServices) {
      if (this.selectedServices.hasOwnProperty(serviceId)) {

        const service = this.cinemaServices.find(s => s.id == parseInt(serviceId))

        console.log("Processing service:", service)

        if (service) {
          const quantity = this.selectedServices[serviceId]
          const subtotal = quantity * service.price

          console.log("Service subtotal:", subtotal)

          total += subtotal
        }
      }
    }

    console.log("Total services price:", total)

    return total
  }

  bookSeats() {

    console.log("Starting booking process")

    if (!this.screening) {
      console.log("Screening not loaded")
      alert('Screening information not loaded')
      return
    }

    if (this.selectedSeats.length === 0) {
      console.log("No seats selected")
      alert('Please select at least one seat')
      return
    }

    console.log("Selected seats:", this.selectedSeats)
    console.log("Selected services:", this.selectedServices)

    const userId = this.getCurrentUserId()
    console.log("Current userId:", userId)

    if (!userId) {
      console.log("User ID missing")
      alert('Please log in to complete the booking')
      this.router.navigate(['/login'])
      return
    }

    const totalPrice =
      (this.selectedSeats.length * this.screening.basePrice)
      + this.getSelectedServicesTotal()

    console.log("Total booking price:", totalPrice)

    const bookingRequest = {
      userId: userId,
      screeningId: this.screeningId,
      totalPrice: totalPrice
    }

    console.log("Booking request payload:", bookingRequest)

    this.loading = true
    this.errorMessage = ''

    this.bookingService.createBooking(bookingRequest).pipe(

      switchMap(booking => {

        console.log("Booking created:", booking)

        const ticketRequests = this.selectedSeats.map(seatId => {

          const ticketRequest = {
            bookingId: booking.id,
            screeningId: this.screeningId,
            seatId: seatId,
            price: this.screening!.basePrice
          }

          console.log("Creating ticket:", ticketRequest)

          return this.ticketService.createTicket(ticketRequest)
        })

        const serviceRequests = Object.entries(this.selectedServices).map(([serviceId, quantity]) => {

          const serviceRequest = {
            bookingId: booking.id,
            extraProductId: parseInt(serviceId),
            quantity: quantity
          }

          console.log("Booking service:", serviceRequest)

          return this.cinemaService.bookService(serviceRequest)
        })

        console.log("Ticket requests:", ticketRequests)
        console.log("Service requests:", serviceRequests)

        return forkJoin([...ticketRequests, ...serviceRequests]).pipe(
          map(() => booking.id)
        )
      }),

      tap(bookingId => {
        console.log("All tickets and services booked. Booking ID:", bookingId)

        this.loading = false
        this.router.navigate(['/ticket', bookingId])
      })

    ).subscribe({
      next: response => {
        console.log("Booking pipeline completed:", response)
      },
      error: err => {
        console.error("Booking error:", err)
        this.loading = false
        this.errorMessage = 'Failed to complete booking. Please try again.'
      }
    })
  }

  loadSeats() {

    if (!this.screening) {
      console.log("Screening not available when loading seats")
      return
    }

    console.log("Loading seats for hall:", this.screening.hallId)

    this.seatService.getSeatsByHall(this.screening.hallId)
      .subscribe({
        next: seats => {
          console.log("Seats loaded:", seats)

          this.seats = seats
          this.buildSeatMatrix()
        },
        error: err => {
          console.error("Error loading seats:", err)
          this.errorMessage = 'Failed to load seat information'
        }
      })
  }

  loadOccupiedSeats() {

    console.log("Loading occupied seats for screening:", this.screeningId)

    this.ticketService.getOccupiedSeats(this.screeningId)
      .subscribe({
        next: data => {
          console.log("Occupied seats:", data)

          this.occupiedSeats = data
        },
        error: err => {
          console.error("Error loading occupied seats:", err)
          this.errorMessage = 'Failed to load seat availability'
        }
      })
  }

  buildSeatMatrix() {

    console.log("Building seat matrix")

    const rows: { [key: number]: Seat[] } = {}

    this.seats.forEach(seat => {

      if (!rows[seat.rowNumber]) {
        rows[seat.rowNumber] = []
      }

      rows[seat.rowNumber].push(seat)
    })

    this.seatMatrix = Object.values(rows).map(row =>
      row.sort((a, b) => a.seatNumber - b.seatNumber)
    )

    console.log("Seat matrix:", this.seatMatrix)
  }

  selectSeat(seat: Seat) {

    console.log("Seat clicked:", seat)

    if (this.isOccupied(seat.id)) {
      console.log("Seat is occupied:", seat.id)
      return
    }

    if (this.selectedSeats.includes(seat.id)) {

      console.log("Removing selected seat:", seat.id)

      this.selectedSeats = this.selectedSeats.filter(id => id !== seat.id)

    } else {

      console.log("Adding selected seat:", seat.id)

      this.selectedSeats.push(seat.id)
    }

    console.log("Current selected seats:", this.selectedSeats)
  }

  isOccupied(seatId: number) {
    const occupied = this.occupiedSeats.includes(seatId)

    if (occupied) {
      console.log("Seat", seatId, "is occupied")
    }

    return occupied
  }

  isSelected(seatId: number) {
    const selected = this.selectedSeats.includes(seatId)

    if (selected) {
      console.log("Seat", seatId, "is selected")
    }

    return selected
  }

  private getCurrentUserId(): number | null {

    const userIdStr = sessionStorage.getItem('userId') || localStorage.getItem('userId')

    console.log("User ID from storage:", userIdStr)

    if (userIdStr) {
      const parsed = parseInt(userIdStr, 10)
      console.log("Parsed user ID:", parsed)
      return parsed
    }

    console.log("No user ID found in storage")

    return null
  }
}