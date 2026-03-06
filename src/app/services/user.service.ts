import { Injectable } from '@angular/core'; // Dice ad Angular che questa classe è un service gestito dal framework
import { HttpClient } from '@angular/common/http'; // Importa lo strumento che Angular usa per fare chiamate HTTP tipo: get, post, put, delete
import { Observable, tap } from 'rxjs'; // Observable è il tipo usato da Angular per gestire risposte asincrone delle chiamate HTTP.
import { User } from '../models/user';

// Dati inviati al backend per il login.
export interface LoginRequest {
  email: string;
  password: string;
}

// Dati inviati al backend per la registrazione.
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Risposta auth usata per salvare i dati nel localStorage.
export interface AuthResponse {
  email: string;
  firstName: string;
  token: string;
  user?: User;
}

@Injectable({
  // Injectable dice ad Angular che questa classe puo essere iniettata dove serve --> cioè la classe subito sotto che è UserService

  providedIn: 'root', // root rende il service disponibile in tutta l'app senza registrarlo altrove.
})
export class UserService {
  // URL base delle chiamate HTTP per gli utenti --> Url del backend a cui faccio le chiamate --> @RequestMapping("/api/users")
  private apiUrl = 'http://localhost:8080/api/auth';

  // Angular passa automaticamente HttpClient nel costruttore. HttpClient(postino) è un servizio Angular che sa fare richieste HTTP, quindi gli passo un URL o dei dati (lettera)
  constructor(private http: HttpClient) {}

  // login invia email e password al backend.
  // Observable<AuthResponse> significa che Angular ricevera la risposta in modo asincrono. Observable serve proprio a gestire dati che arrivano dopo --> Observable = contenitore di un dato che arriverà dopo
  login(credentials: LoginRequest): Observable<AuthResponse> {
    // post(...) fa una chiamata HTTP POST.
    // pipe(...) serve per applicare operazioni alla risposta prima di usarla. Serve a prendere l'Observable e applicargli sopra una tap()
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      // tap(...) esegue un'azione collaterale senza modificare la risposta.
      // Qui salviamo i dati nel localStorage, ma il valore restituito resta lo stesso. Tap fa quindi l'operazione di salvataggio
      tap((response) => this.saveAuthData(response)),
    );
  }

  // register invia i dati del nuovo utente al backend.
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(tap((response) => this.saveAuthData(response)));
  }

  // Salva i dati minimi di autenticazione nel browser.
  // localStorage conserva i dati anche dopo il refresh della pagina.
  // Angular gira nel browser, quindi puo usare localStorage, che e una funzionalita del browser accessibile da JavaScript e TypeScript.
  saveAuthData(data: AuthResponse): void {
    localStorage.setItem('email', data.email);
    localStorage.setItem('firstName', data.firstName);
    localStorage.setItem('token', data.token);
    // Salviamo anche il ruolo restituito dal backend, cosi il frontend puo capire se l'utente e admin anche dopo un refresh della pagina.
    if (data.user?.role) {
      localStorage.setItem('role', data.user.role);
    }
  }

  // Legge il token salvato nel browser.
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Legge l'email salvata nel browser.
  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  // Legge il nome salvato nel browser.
  getFirstName(): string | null {
    return localStorage.getItem('firstName');
  }

  // Restituisce il ruolo salvato dopo il login. Serve per controlli come isAdmin(), redirect o visibilita di parti della UI.
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Se esiste un token, consideriamo l'utente loggato.
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Rimuove i dati di login dal browser.
  logout(): void {
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('token');
    // Quando esco, rimuovo anche il ruolo per evitare che restino dati della sessione precedente nel browser.
    localStorage.removeItem('role');
  }
}
