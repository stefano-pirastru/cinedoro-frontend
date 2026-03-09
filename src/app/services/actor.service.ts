import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Actor {
    id?: number;
    firstName: string;
    lastName: string;
    birthdate?: string; // optional, ISO string format
}

@Injectable({
    providedIn: 'root',
})
export class ActorService {
    private apiUrl = 'http://localhost:8080/api/actors';

    constructor(private http: HttpClient) { }

    getAllActors(): Observable<Actor[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getActorById(id: number): Observable<Actor> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createActor(actor: Actor): Observable<Actor> {
        return this.http.post<any>(this.apiUrl, actor);
    }

    updateActor(id: number, actor: Actor): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, actor);
    }

    deleteActor(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}