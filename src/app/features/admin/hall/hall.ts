import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HallService } from '../../../../app/services/hall.service';
import { Hall, CreateHallRequest } from '../../../../app/models/hall';

@Component({
  selector: 'app-hall',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hall.html',
  styleUrls: ['./hall.css'],
})
export class HallComponent implements OnInit {
  // Reactive list of halls
  halls = signal<any[]>([]);

  // New hall form model
  newHall = signal<CreateHallRequest>({ name: '', capacity: 0 });

  // Editing hall signal
  editingHall = signal<Hall | null>(null);

  // Show create form toggle
  showCreateForm = signal(false);

  constructor(private hallService: HallService) { }

  ngOnInit(): void {
    this.loadHalls();
  }

  // Load halls from API
  loadHalls() {
    this.hallService.getAllHalls().subscribe({
      next: (data) => this.halls.set(data),
      error: (err) => console.error('Error fetching halls:', err),
    });
  }

  // ---------------- CREATE ----------------
  showCreateHallForm() {
    this.showCreateForm.set(true);
    this.newHall.set({ name: '', capacity: 0 });
  }

  cancelCreate() {
    this.showCreateForm.set(false);
  }

  createHall() {
    const hall = this.newHall();
    if (!hall.name || hall.capacity <= 0) {
      alert('Please enter a valid name and capacity greater than 0');
      return;
    }

    this.hallService.createHall(hall).subscribe({
      next: () => {
        this.loadHalls();
        this.cancelCreate();
      },
      error: (err) => console.error('Error creating hall:', err),
    });
  }

  // ---------------- EDIT ----------------
  startEditing(hall: Hall) {
    this.editingHall.set({ ...hall });
  }

  cancelEdit() {
    this.editingHall.set(null);
  }

  updateHall() {
    const hall = this.editingHall();
    if (!hall || !hall.id || !hall.name || hall.capacity <= 0) {
      alert('Please enter a valid name and capacity greater than 0');
      return;
    }

    this.hallService.updateHall(hall.id, hall).subscribe({
      next: () => {
        this.loadHalls();
        this.cancelEdit();
      },
      error: (err) => console.error('Error updating hall:', err),
    });
  }

  // ---------------- DELETE ----------------
  deleteHall(id: number) {
    if (!confirm('Are you sure you want to delete this hall?')) return;

    this.hallService.deleteHall(id).subscribe({
      next: () => this.loadHalls(),
      error: (err) => console.error('Error deleting hall:', err),
    });
  }
}