import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Director } from "../../../models/director";
import { DirectorService } from "../../../services/director.service";
import { FormsModule } from "@angular/forms";

@Component({
    standalone: true,
    selector: 'app-director-list',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './director-list.component.html',
    styleUrls: ['./director-list.component.css'],
})


export class DirectorListComponent implements OnInit {
    //per contenere tutti i registi
    directors = signal<Director[]>([]);

    newDirector: Director = {
        firstName: '',
        lastName: ''
    };

    //serve per prendere una copia del rigista quando clicchiamo modifica nell'update
    editingDirector = signal<Director | null>(null);

    constructor(private directorService: DirectorService) { }

    //carica la lista di registi aggiornata
    ngOnInit(): void {
        this.loadDirectors();
    }
    // metodo per ottenere tutti i registi
    loadDirectors() {
        this.directorService.getAllDirectors()
            .subscribe(dir => this.directors.set(dir));
    }
    //serve per specificare quale regista stiamo modificando 
    //...director è una "copia"
    startEditing(director: Director) {
        this.editingDirector.set({ ...director });
    }

    createDirector() {
        this.directorService.create(this.newDirector)
            //serve per "pulire" il form dopo l'invio
            .subscribe(() => {
                this.newDirector = { firstName: '', lastName: '' };
                //aggiorno la lista con il nuovo regista creato
                this.loadDirectors();
            })
    }

    deleteDirector(id?: number) {
        if (!id) return; // se undefined, esce
        //confirm() metodo di js che restituisce true o false (ok -> true, annulla -> false)
        if (!confirm("Sei sicuro di voler eliminare questo regista?")) return;

        this.directorService.delete(id).subscribe(() => {
            this.loadDirectors();
        })
    }

    updateDirector() {
        const directorToUpdate = this.editingDirector();
        if (!directorToUpdate) return;
        this.directorService.update(directorToUpdate).subscribe({
            next: () => {
                alert("Regista aggiornato correttamente");
                this.editingDirector.set(null);
                this.loadDirectors();
            },

            error: () => {
                alert("Errore durante l'aggiornamento del regista");
            }
        });
    }
}