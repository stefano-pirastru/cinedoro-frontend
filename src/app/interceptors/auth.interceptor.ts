// Questa classe legge il token dal localStorage, controlla che la richiesta vada al backend, clona la richiesta
// e aggiunge Authorization: Bearer <token>
// Header browser | "ti porto questo token" | il "badge" JWT vero e proprio
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Se non c'e token oppure la chiamata non va al backend, lascio la request invariata.
  if (!token || !req.url.startsWith('http://localhost:8080')) {
    return next(req);
  }

  // Clono la request originale e aggiungo l'header Authorization richiesto dal backend protetto.
  const authenticatedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authenticatedRequest);
};
