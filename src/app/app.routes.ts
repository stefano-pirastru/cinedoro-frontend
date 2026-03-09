import { Routes } from '@angular/router';
import { FilmListComponent } from './features/films/film-list.component';
import { ScreeningByFilmComponent } from './features/screenings/screening-by-film/screening-by-film';
import { AdminComponent } from './features/admin/admin.component';
import { FilmDetail } from './features/film-detail/film-detail';
import { BookingComponent } from './features/booking/booking';
import { AdminFilmListComponent } from './features/admin/films/film-list.component';
import { Login } from './features/auth/login/login';
import { UserRegistration } from './features/auth/register/register';
import { DirectorListComponent } from './features/admin/directors/director-list.component';
import { TicketComponent } from './features/tickets/tickets';
import { MyBookingsComponent } from './features/my-bookings/my-bookings.component';
import { Screenings } from './features/admin/screenings/screenings';
import { CinemaServiceComponent } from './features/admin/cinema-service/cinema-service';
import { ActorComponent } from './features/admin/actor/actor';
import { AdminFilmCreateComponent } from './features/admin/films/film.create';
import { AdminGenreComponent } from './features/admin/genres/admin-genre.component';
import { Home } from './features/home/home';
import { HallComponent } from './features/admin/hall/hall';
export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: UserRegistration },
    { path: 'films', component: FilmListComponent },
    { path: 'bookings', component: BookingComponent },
    { path: 'my-bookings', component: MyBookingsComponent },
    { path: 'film/detail/:filmId', component: FilmDetail },
    { path: 'booking/:screeningId', component: BookingComponent },
    { path: 'screenings/film/:filmId', component: ScreeningByFilmComponent },
    {
        path: 'ticket/:bookingId',
        component: TicketComponent
    },
    {
        path: '',
        redirectTo: 'films',
        pathMatch: 'full'
    },
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            { path: '', redirectTo: 'films', pathMatch: 'full' },
            { path: 'films', component: AdminFilmListComponent },
            { path: 'hall', component: HallComponent },
            { path: 'genres', component: AdminGenreComponent },
            { path: 'actors', component: ActorComponent },
            { path: 'directors', component: DirectorListComponent },
            { path: 'cinema-service', component: CinemaServiceComponent },
            { path: 'films/create', component: AdminFilmCreateComponent },
            { path: 'films/edit/:id', component: AdminFilmCreateComponent },
            { path: 'screenings', component: Screenings }
        ]
    }
];
