export interface Hall {
    id: number
    name: string
    capacity: number
}

export interface Seat {
    id: number
    rowNumber: number
    seatNumber: number
    hall: Hall
}