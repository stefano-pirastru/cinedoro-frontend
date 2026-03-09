import { Component, computed, effect, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BookingService } from '../../services/booking.service'
import { TicketService, Ticket } from '../../services/ticket.service'
import { CommonModule } from '@angular/common'

interface TicketViewModel {
  bookingId: number
  totalPrice: number
  tickets: Ticket[]
  seatNumbers: string
}

@Component({
  selector: 'app-ticket',
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TicketComponent {

  // Signals
  bookingId = signal<number | null>(null)
  ticketData = signal<TicketViewModel | null>(null)
  loading = signal<boolean>(true)
  errorMessage = signal<string>('')

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private ticketService: TicketService
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('bookingId'))
    if (!id) {
      this.errorMessage.set('Invalid booking ID')
      this.loading.set(false)
      return
    }

    this.bookingId.set(id)
    this.loadTickets(id)
  }

  private loadTickets(id: number) {
    this.loading.set(true)
    this.errorMessage.set('')

    this.bookingService.getBookingById(id).subscribe({
      next: booking => {
        this.ticketService.getTicketsByBooking(id).subscribe({
          next: tickets => {
            const seatNumbers = tickets.map(t => `Seat ${t.seatId}`).join(', ')
            this.ticketData.set({
              bookingId: booking.id,
              totalPrice: booking.totalPrice,
              tickets: tickets,
              seatNumbers: seatNumbers
            })
            this.loading.set(false)
          },
          error: err => {
            console.error('Error loading tickets', err)
            this.errorMessage.set('Failed to load ticket information')
            this.loading.set(false)
          }
        })
      },
      error: err => {
        console.error('Error loading booking', err)
        this.errorMessage.set('Failed to load booking information')
        this.loading.set(false)
      }
    })
  }

  downloadTickets() {
    alert('Download ticket functionality would be implemented here')
  }

  printTickets() {
    window.print()
  }

  goHome() {
    this.router.navigate(['/film'])
  }

  // Computed helpers for template
  ticketList = computed(() => this.ticketData()?.tickets || [])
  seatNumbers = computed(() => this.ticketData()?.seatNumbers || '')
  totalPrice = computed(() => this.ticketData()?.totalPrice || 0)
}