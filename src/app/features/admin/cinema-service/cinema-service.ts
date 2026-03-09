import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CinemaServiceService as CinemaServiceApiService, CinemaService } from '../../../../app/services/cinema-service.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cinema-service',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './cinema-service.html',
  styleUrl: './cinema-service.css',
})
export class CinemaServiceComponent implements OnInit {

  // Signals
  cinemaServices = signal<any[]>([]);
  loading = signal<boolean>(true);

  newService = signal<Partial<CinemaService>>({ name: '', description: '', price: 0 });
  editService = signal<Partial<CinemaService> | null>(null);

  constructor(private cinemaServiceApiService: CinemaServiceApiService) { }

  ngOnInit(): void {
    this.getAllCinemaServices();
  }

  getAllCinemaServices(): void {
    this.loading.set(true);
    this.cinemaServiceApiService.getAllServices().subscribe({
      next: (data) => this.cinemaServices.set(data),
      error: (err) => console.error('Error fetching cinema services', err),
      complete: () => this.loading.set(false)
    });
  }

  showCreateServiceForm(): void {
    this.newService.set({ name: '', description: '', price: 0 });
  }

  cancelCreate(): void {
    this.newService.set({ name: '', description: '', price: 0 });
  }

  createService(): void {
    const service = this.newService();
    if (!service.name || !service.description || service.price === undefined) return;

    this.cinemaServiceApiService.createService(service as CinemaService).subscribe({
      next: (res) => {
        this.cinemaServices.set([...this.cinemaServices(), res]);
        this.cancelCreate();
      },
      error: (err) => console.error('Error creating service', err)
    });
  }

  showEditServiceForm(service: CinemaService): void {
    this.editService.set({ ...service });
  }

  cancelEdit(): void {
    this.editService.set(null);
  }

  onEditInputChange(event: Event, field: 'name' | 'description' | 'price'): void {
    const current = this.editService();
    if (!current) return;

    const value = (event.target as HTMLInputElement).value;
    const updated = { ...current };

    if (field === 'price') updated.price = parseFloat(value);
    else if (field === 'name') updated.name = value;
    else updated.description = value;

    this.editService.set(updated);
  }

  updateService(): void {
    const service = this.editService();
    if (!service || !service.id) return;

    this.cinemaServiceApiService.updateService(service.id, service as CinemaService).subscribe({
      next: (updated) => {
        const updatedList = this.cinemaServices().map(s => s.id === updated.id ? updated : s);
        this.cinemaServices.set(updatedList);
        this.cancelEdit();
      },
      error: (err) => console.error('Error updating service', err)
    });
  }

  deleteService(id: number): void {
    this.cinemaServiceApiService.deleteService(id).subscribe({
      next: () => {
        const updatedList = this.cinemaServices().filter(s => s.id !== id);
        this.cinemaServices.set(updatedList);
      },
      error: (err) => console.error('Error deleting service', err)
    });
  }
}