# Cinema API Documentation

This document provides a detailed description of the backend API for the Cinema application. It is intended to be used by an LLM to generate the frontend code.

## Base URL

All API endpoints are relative to the base URL (e.g., `http://localhost:8080`).

> **Note:** Some endpoints return entities directly (e.g., `Ticket`, `Seat`, `Genre`, `CinemaService`). Be aware of potential circular references or large JSON responses due to bidirectional relationships (e.g., `Ticket` <-> `Booking`, `Seat` <-> `Ticket`). Ensure the backend handles JSON serialization correctly or handle it on the frontend if necessary.

---

## 1. Film Controller

**Base Path:** `/api/film`

### Endpoints

#### 1.1 Get All Films

- **Method:** `GET`
- **Path:** `/`
- **Description:** Retrieves a list of all films.
- **Response:** `List<FilmDTO>`

```json
[
  {
    "id": 1,
    "title": "Inception",
    "durationMinutes": 148,
    "description": "A thief who steals corporate secrets through the use of dream-sharing technology...",
    "releaseDate": "2010-07-16",
    "ageRating": 13,
    "directorId": 101,
    "screeningsId": [201, 202],
    "actorsId": [301, 302],
    "genresId": [401, 402]
  }
]
```

#### 1.2 Get Film by ID

- **Method:** `GET`
- **Path:** `/{id}`
- **Description:** Retrieves a specific film by its ID with full details (Director, Actors, Genres, Screenings).
- **Response:** `FilmDetailDTO`

```json
{
  "id": 1,
  "title": "Inception",
  "durationMinutes": 148,
  "description": "A thief who steals corporate secrets...",
  "releaseDate": "2010-07-16",
  "ageRating": 13,
  "director": {
    "id": 101,
    "firstName": "Christopher",
    "lastName": "Nolan"
  },
  "screenings": [
    {
      "id": 201,
      "filmId": 1,
      "hallId": 10,
      "screeningDate": "2023-10-27",
      "screeningTime": "18:30:00",
      "basePrice": 12.5
    }
  ],
  "actors": [
    {
      "id": 301,
      "firstName": "Leonardo",
      "lastName": "DiCaprio",
      "birthDate": "1974-11-11",
      "nationality": "American"
    }
  ],
  "genres": [
    {
      "id": 401,
      "name": "Sci-Fi"
    }
  ]
}
```

#### 1.3 Create Film

- **Method:** `POST`
- **Path:** `/`
- **Description:** Creates a new film.
- **Request Body:** `FilmDTO`

```json
{
  "title": "New Movie",
  "durationMinutes": 120,
  "description": "Description here",
  "releaseDate": "2023-10-27",
  "ageRating": 12,
  "directorId": 101,
  "actorsId": [301, 302],
  "genresId": [401]
}
```

- **Response:** `FilmDTO` (The created film with ID)

#### 1.4 Update Film

- **Method:** `PUT`
- **Path:** `/{id}`
- **Description:** Updates an existing film.
- **Request Body:** `FilmDTO`

```json
{
  "title": "Updated Title",
  "durationMinutes": 130,
  "description": "Updated description",
  "releaseDate": "2023-10-27",
  "ageRating": 12,
  "directorId": 101,
  "actorsId": [301],
  "genresId": [401]
}
```

- **Response:** `204 No Content` if successful.

#### 1.5 Delete Film

- **Method:** `DELETE`
- **Path:** `/{id}`
- **Description:** Deletes a film by its ID.
- **Response:** `204 No Content` if successful.

#### 1.6 Search Films

- **Method:** `GET`
- **Path:** `/search?q={query}`
- **Description:** Searches for films by title or other criteria.
- **Response:** `Page<FilmDTO>`

```json
{
  "content": [
    {
      "id": 1,
      "title": "Inception",
      ...
    }
  ],
  "totalPages": 5,
  "totalElements": 50,
  "size": 10,
  "number": 0
}
```

#### 1.7 Find Films by Date

- **Method:** `GET`
- **Path:** `/by-date?date={yyyy-MM-dd}`
- **Description:** Finds films showing on a specific date.
- **Response:** `List<FilmDTO>`

---

## 2. User Controller

**Base Path:** `/api/users`

### Endpoints

#### 2.1 Get All Users

- **Method:** `GET`
- **Path:** `/`
- **Description:** Retrieves a list of all users.
- **Response:** `List<UserDTO>`

```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "CUSTOMER",
    "createdAt": "2023-01-01T10:00:00"
  }
]
```

#### 2.2 Get User by ID

- **Method:** `GET`
- **Path:** `/{id}`
- **Description:** Retrieves a user by ID.
- **Response:** `UserDTO`

#### 2.3 Create User

- **Method:** `POST`
- **Path:** `/`
- **Description:** Creates a new user.
- **Request Body:** `UserDTO`

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "password": "securePassword123",
  "role": "CUSTOMER"
}
```

- **Response:** `UserDTO` (without password)

#### 2.4 Update User

- **Method:** `PUT`
- **Path:** `/{id}`
- **Description:** Updates an existing user.
- **Request Body:** `UserDTO`
- **Response:** `UserDTO`

#### 2.5 Delete User

- **Method:** `DELETE`
- **Path:** `/{id}`
- **Description:** Deletes a user.
- **Response:** `204 No Content`

---

## 3. Booking Controller

**Base Path:** `/api/bookings`

### Endpoints

#### 3.1 Get All Bookings

- **Method:** `GET`
- **Path:** `/`
- **Description:** Retrieves all bookings.
- **Response:** `List<BookingDTO>`

```json
[
  {
    "id": 501,
    "userId": 1,
    "screeningId": 201,
    "totalPrice": 25.5,
    "bookingDate": "2023-10-25T14:30:00"
  }
]
```

#### 3.2 Get Booking by ID

- **Method:** `GET`
- **Path:** `/{id}`
- **Description:** Retrieves a booking by ID.
- **Response:** `BookingDTO`

#### 3.3 Get Bookings by User

- **Method:** `GET`
- **Path:** `/user/{userId}`
- **Description:** Retrieves all bookings for a specific user.
- **Response:** `List<BookingDTO>`

#### 3.4 Create Booking

- **Method:** `POST`
- **Path:** `/`
- **Description:** Creates a new booking.
- **Request Body:** `BookingDTO`

```json
{
  "userId": 1,
  "screeningId": 201,
  "totalPrice": 25.5
}
```

- **Response:** `BookingDTO`

#### 3.5 Delete Booking

- **Method:** `DELETE`
- **Path:** `/{id}`
- **Description:** Cancels/Deletes a booking.
- **Response:** `204 No Content`

---

## 4. Screening Controller

**Base Path:** `/api/screenings`

### Endpoints

#### 4.1 Get All Screenings

- **Method:** `GET`
- **Path:** `/`
- **Description:** Retrieves all screenings.
- **Response:** `List<ScreeningDTO>`

```json
[
  {
    "id": 201,
    "filmId": 1,
    "hallId": 10,
    "screeningDate": "2023-10-27",
    "screeningTime": "18:30:00",
    "basePrice": 12.5
  }
]
```

#### 4.2 Get Screening by ID

- **Method:** `GET`
- **Path:** `/{id}`
- **Description:** Retrieves a screening by ID.
- **Response:** `ScreeningDTO`

#### 4.3 Get Screenings by Film

- **Method:** `GET`
- **Path:** `/film/{filmId}`
- **Description:** Retrieves screenings for a specific film.
- **Response:** `List<ScreeningDTO>`

#### 4.4 Get Screenings by Date

- **Method:** `GET`
- **Path:** `/date?date={yyyy-MM-dd}`
- **Description:** Retrieves screenings on a specific date.
- **Response:** `List<ScreeningDTO>`

#### 4.5 Get Available Seats

- **Method:** `GET`
- **Path:** `/{id}/seats/available`
- **Description:** Retrieves available seats for a screening.
- **Response:** `List<Seat>` (Assuming Seat entity structure)

#### 4.6 Create Screening

- **Method:** `POST`
- **Path:** `/`
- **Description:** Creates a new screening.
- **Request Body:** `ScreeningDTO`

```json
{
  "filmId": 1,
  "hallId": 10,
  "screeningDate": "2023-10-27",
  "screeningTime": "20:00:00",
  "basePrice": 12.5
}
```

- **Response:** `ScreeningDTO`

#### 4.7 Update Screening

- **Method:** `PUT`
- **Path:** `/{id}`
- **Description:** Updates a screening.
- **Request Body:** `ScreeningDTO`
- **Response:** `ScreeningDTO`

#### 4.8 Delete Screening

- **Method:** `DELETE`
- **Path:** `/{id}`
- **Description:** Deletes a screening.
- **Response:** `204 No Content`

---

## 5. Hall Controller

**Base Path:** `/api/halls`

### Endpoints

#### 5.1 Get All Halls

- **Method:** `GET`
- **Path:** `/`
- **Description:** Retrieves all halls.
- **Response:** `List<HallDTO>`

```json
[
  {
    "id": 10,
    "name": "Hall A",
    "capacity": 100
  }
]
```

#### 5.2 Get Hall by ID

- **Method:** `GET`
- **Path:** `/{id}`
- **Description:** Retrieves a hall by ID.
- **Response:** `HallDTO`

#### 5.3 Create Hall

- **Method:** `POST`
- **Path:** `/`
- **Description:** Creates a new hall.
- **Request Body:** `HallDTO`

```json
{
  "name": "Hall B",
  "capacity": 150
}
```

- **Response:** `HallDTO`

---

## 6. Seat Controller

**Base Path:** `/seats`

### Endpoints

#### 6.1 Get All Seats

- **Method:** `GET`
- **Path:** `/`
- **Description:** Retrieves all seats.
- **Response:** `List<Seat>`

```json
[
  {
    "id": 1001,
    "rowNumber": 1,
    "seatNumber": 1,
    "hall": {
      "id": 10,
      "name": "Hall A",
      "capacity": 100
    }
  }
]
```

#### 6.2 Get Seat by ID

- **Method:** `GET`
- **Path:** `/{id}`
- **Description:** Retrieves a seat by ID.
- **Response:** `Seat`

#### 6.3 Get Seats by Hall

- **Method:** `GET`
- **Path:** `/hall/{hallId}`
- **Description:** Retrieves all seats for a specific hall.
- **Response:** `List<Seat>`

#### 6.4 Create Seat

- **Method:** `POST`
- **Path:** `/`
- **Description:** Creates a new seat.
- **Request Body:** `Seat`

```json
{
  "rowNumber": 1,
  "seatNumber": 2,
  "hall": {
    "id": 10
  }
}
```

- **Response:** `Seat`

#### 6.5 Update Seat

- **Method:** `PUT`
- **Path:** `/{id}`
- **Description:** Updates a seat.
- **Request Body:** `Seat`
- **Response:** `Seat`

#### 6.6 Delete Seat

- **Method:** `DELETE`
- **Path:** `/{id}`
- **Description:** Deletes a seat.
- **Response:** `204 No Content`

---

## 7. Actor Controller

**Base Path:** `/api/actors`

### Endpoints

#### 7.1 Get All Actors

- **Method:** `GET`
- **Path:** `/`
- **Description:** Retrieves all actors.
- **Response:** `List<ActorDTO>`

```json
[
  {
    "id": 301,
    "firstName": "Leonardo",
    "lastName": "DiCaprio",
    "birthDate": "1974-11-11",
    "nationality": "American"
  }
]
```

#### 7.2 Get Actor by ID

- **Method:** `GET`
- **Path:** `/{id}`
- **Description:** Retrieves an actor by ID.
- **Response:** `ActorDTO`

#### 7.3 Create Actor

- **Method:** `POST`
- **Path:** `/`
- **Description:** Creates a new actor.
- **Request Body:** `ActorDTO`

```json
{
  "firstName": "Brad",
  "lastName": "Pitt",
  "birthDate": "1963-12-18",
  "nationality": "American"
}
```

- **Response:** `ActorDTO`

#### 7.4 Update Actor

- **Method:** `PUT`
- **Path:** `/{id}`
- **Description:** Updates an actor.
- **Request Body:** `ActorDTO`
- **Response:** `204 No Content`

#### 7.5 Delete Actor

- **Method:** `DELETE`
- **Path:** `/{id}`
- **Description:** Deletes an actor.
- **Response:** `204 No Content`

---

## 8. Genre Controller

**Base Path:** `/api/genres`

### Endpoints

#### 8.1 Get All Genres

- **Method:** `GET`
- **Path:** `/`
- **Description:** Retrieves all genres.
- **Response:** `List<Genre>`

```json
[
  {
    "id": 401,
    "name": "Action"
  }
]
```

#### 8.2 Get Genre by ID

- **Method:** `GET`
- **Path:** `/{id}`
- **Description:** Retrieves a genre by ID.
- **Response:** `Genre`

#### 8.3 Create Genre

- **Method:** `POST`
- **Path:** `/`
- **Description:** Creates a new genre.
- **Request Body:** `Genre`

```json
{
  "name": "Sci-Fi"
}
```

- **Response:** `Genre`

#### 8.4 Delete Genre

- **Method:** `DELETE`
- **Path:** `/{id}`
- **Description:** Deletes a genre.
- **Response:** `204 No Content`

---

## 9. Director Controller

**Base Path:** `/api/director`

### Endpoints

#### 9.1 Get All Directors

- **Method:** `GET`
- **Path:** `/`
- **Description:** Retrieves all directors.
- **Response:** `List<DirectorDTO>`

```json
[
  {
    "id": 101,
    "firstName": "Christopher",
    "lastName": "Nolan"
  }
]
```

#### 9.2 Get Director by ID

- **Method:** `GET`
- **Path:** `/{id}`
- **Description:** Retrieves a director by ID.
- **Response:** `DirectorDTO`

#### 9.3 Create Director

- **Method:** `POST`
- **Path:** `/`
- **Description:** Creates a new director.
- **Request Body:** `DirectorDTO`

```json
{
  "firstName": "Quentin",
  "lastName": "Tarantino"
}
```

- **Response:** `DirectorDTO`

#### 9.4 Update Director

- **Method:** `PUT`
- **Path:** `/{id}`
- **Description:** Updates a director.
- **Request Body:** `DirectorDTO`
- **Response:** `DirectorDTO`

#### 9.5 Delete Director

- **Method:** `DELETE`
- **Path:** `/{id}`
- **Description:** Deletes a director.
- **Response:** `204 No Content`

---

## 10. Ticket Controller

**Base Path:** `/api/tickets`

### Endpoints

#### 10.1 Get Ticket by ID

- **Method:** `GET`
- **Path:** `/{id}`
- **Description:** Retrieves a ticket by ID.
- **Response:** `Ticket`

#### 10.2 Get Tickets by Booking

- **Method:** `GET`
- **Path:** `/by-booking/{bookingId}`
- **Description:** Retrieves tickets for a specific booking.
- **Response:** `List<Ticket>`

#### 10.3 Get Tickets by Screening

- **Method:** `GET`
- **Path:** `/by-screening/{screeningId}`
- **Description:** Retrieves tickets for a specific screening.
- **Response:** `Page<Ticket>`

#### 10.4 Get Tickets by User

- **Method:** `GET`
- **Path:** `/by-user/{userId}`
- **Description:** Retrieves tickets for a specific user.
- **Response:** `Page<Ticket>`

#### 10.5 Get Occupied Seats

- **Method:** `GET`
- **Path:** `/occupied-seats/{screeningId}`
- **Description:** Retrieves occupied seat IDs for a screening.
- **Response:** `List<Integer>`

```json
[1001, 1002, 1005]
```

#### 10.6 Create Ticket

- **Method:** `POST`
- **Path:** `/`
- **Description:** Creates a new ticket.
- **Request Parameters:**
  - `bookingId` (Integer)
  - `screeningId` (Integer)
  - `seatId` (Integer)
  - `price` (BigDecimal, optional)
- **Response:** `Ticket`

#### 10.7 Delete Ticket

- **Method:** `DELETE`
- **Path:** `/{id}`
- **Description:** Deletes a ticket.
- **Response:** `204 No Content`

---

## 11. Cinema Service Controller (Extra Products)

**Base Path:** `/api/cinema-services`

### Endpoints

#### 11.1 Get All Services

- **Method:** `GET`
- **Path:** `/`
- **Description:** Retrieves all extra services (e.g., Popcorn, Drinks).
- **Response:** `List<CinemaService>`

```json
[
  {
    "id": 1,
    "name": "Popcorn",
    "description": "Large Popcorn",
    "price": 5.5
  }
]
```

#### 11.2 Get Service by ID

- **Method:** `GET`
- **Path:** `/{id}`
- **Description:** Retrieves a service by ID.
- **Response:** `CinemaService`

#### 11.3 Create Service

- **Method:** `POST`
- **Path:** `/`
- **Description:** Creates a new service.
- **Request Body:** `CinemaService`
- **Response:** `CinemaService`

---

## 12. Booked Service Controller

**Base Path:** `/api/booked-services`

### Endpoints

#### 12.1 Get All Booked Services

- **Method:** `GET`
- **Path:** `/`
- **Description:** Retrieves all booked services.
- **Response:** `List<BookedServiceDTO>`

#### 12.2 Get Booked Service by ID

- **Method:** `GET`
- **Path:** `/{bookingId}/{extraProductId}`
- **Description:** Retrieves a booked service by composite ID.
- **Response:** `BookedServiceDTO`

#### 12.3 Get Booked Services by Booking

- **Method:** `GET`
- **Path:** `/booking/{bookingId}`
- **Description:** Retrieves booked services for a specific booking.
- **Response:** `List<BookedServiceDTO>`

#### 12.4 Create Booked Service

- **Method:** `POST`
- **Path:** `/`
- **Description:** Adds a service to a booking.
- **Request Body:** `BookedServiceDTO`

```json
{
  "bookingId": 501,
  "extraProductId": 1,
  "quantity": 2
}
```

- **Response:** `BookedServiceDTO`

#### 12.5 Delete Booked Service

- **Method:** `DELETE`
- **Path:** `/{bookingId}/{extraProductId}`
- **Description:** Removes a service from a booking.
- **Response:** `204 No Content`
