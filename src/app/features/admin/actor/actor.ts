import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Actor, ActorService } from '../../../../app/services/actor.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-actor',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './actor.html',
  styleUrls: ['./actor.css'],
})
export class ActorComponent implements OnInit {

  // Reactive signals
  actors = signal<any[]>([]);
  loading = signal<boolean>(true);

  newActor = signal<Partial<Actor>>({ firstName: '', lastName: '', birthdate: '' });
  editingActor = signal<Partial<Actor> | null>(null);

  constructor(private actorService: ActorService) { }

  ngOnInit(): void {
    this.loadActors();
  }

  // Load all actors
  loadActors(): void {
    this.loading.set(true);
    this.actorService.getAllActors().subscribe({
      next: (data) => this.actors.set(data),
      error: (err) => console.error('Error fetching actors:', err),
      complete: () => this.loading.set(false)
    });
  }

  // Show create form
  showCreateActorForm(): void {
    this.newActor.set({ firstName: '', lastName: '', birthdate: '' });
  }

  // Cancel create
  cancelCreate(): void {
    this.newActor.set({ firstName: '', lastName: '', birthdate: '' });
  }

  // Create new actor
  createActor(): void {
    const actor = this.newActor();
    if (!actor.firstName || !actor.lastName) return;

    this.actorService.createActor(actor as Actor).subscribe({
      next: (res) => {
        this.actors.set([...this.actors(), res]);
        this.cancelCreate();
      },
      error: (err) => console.error('Error creating actor:', err)
    });
  }

  // Show edit form
  showEditActorForm(actor: Actor): void {
    this.editingActor.set({ ...actor });
  }

  // Cancel edit
  cancelEdit(): void {
    this.editingActor.set(null);
  }

  // Update actor
  updateActor(): void {
    const actor = this.editingActor();
    if (!actor || !actor.id) return;

    this.actorService.updateActor(actor.id, actor as Actor).subscribe({
      next: () => {
        this.loadActors();
        this.cancelEdit();
      },
      error: (err) => console.error('Error updating actor:', err)
    });
  }

  // Delete actor
  deleteActor(id: number): void {
    this.actorService.deleteActor(id).subscribe({
      next: () => {
        const updatedList = this.actors().filter(a => a.id !== id);
        this.actors.set(updatedList);
      },
      error: (err) => console.error('Error deleting actor:', err)
    });
  }
}