import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../../core/services/SubscriptionService/subscription-service';
import { SubscriptionPackageDto, PagedResult } from '../../../core/interfaces/subscription.interface';

@Component({
  selector: 'app-subscriptions-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscriptions-management.html',
  styleUrl: './subscriptions-management.scss',
})
export class SubscriptionsManagement implements OnInit {
  private readonly _subscriptionService = inject(SubscriptionService);
  private readonly _router = inject(Router);

  packages = signal<SubscriptionPackageDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);

  showCreateModal = signal<boolean>(false);
  showEditModal = signal<boolean>(false);
  selectedPackage = signal<SubscriptionPackageDto | null>(null);

  // Form data - using regular object instead of signal for ngModel
  formData: Partial<SubscriptionPackageDto> = {
    name: '',
    description: '',
    price: 0,
    durationDays: 30,
  };

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(page: number = 1): void {
    this.loading.set(true);
    this.error.set(null);

    this._subscriptionService.getAllPackages(page, this.pageSize()).subscribe({
      next: (result: PagedResult<SubscriptionPackageDto>) => {
        this.packages.set(result.items);
        this.pageNumber.set(result.pageNumber);
        this.pageSize.set(result.pageSize);
        this.totalPages.set(result.totalPages);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading packages:', err);
        this.error.set(err.message || 'Failed to load packages');
        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.loadPackages(page);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  openCreateModal(): void {
    this.formData = {
      name: '',
      description: '',
      price: 0,
      durationDays: 30,
    };
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.formData = {
      name: '',
      description: '',
      price: 0,
      durationDays: 30,
    };
  }

  openEditModal(pkg: SubscriptionPackageDto): void {
    this.selectedPackage.set(pkg);
    this.formData = {
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      durationDays: pkg.durationDays,
    };
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedPackage.set(null);
    this.formData = {
      name: '',
      description: '',
      price: 0,
      durationDays: 30,
    };
  }

  createPackage(): void {
    const data = this.formData;
    if (!data.name || !data.description || !data.price || !data.durationDays) {
      this.error.set('Please fill all required fields');
      return;
    }

    this._subscriptionService.createPackage(data as SubscriptionPackageDto).subscribe({
      next: () => {
        alert('Package created successfully');
        this.closeCreateModal();
        this.loadPackages(this.pageNumber());
      },
      error: (err) => {
        console.error('Error creating package:', err);
        this.error.set(err.message || 'Failed to create package');
      },
    });
  }

  updatePackage(): void {
    const pkg = this.selectedPackage();
    const data = this.formData;

    if (!pkg || !data.name || !data.description || !data.price || !data.durationDays) {
      this.error.set('Please fill all required fields');
      return;
    }

    this._subscriptionService.updatePackage(pkg.packageId, data as SubscriptionPackageDto).subscribe({
      next: () => {
        alert('Package updated successfully');
        this.closeEditModal();
        this.loadPackages(this.pageNumber());
      },
      error: (err) => {
        console.error('Error updating package:', err);
        this.error.set(err.message || 'Failed to update package');
      },
    });
  }

  deletePackage(packageId: string): void {
    if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) return;

    this._subscriptionService.deletePackage(packageId).subscribe({
      next: () => {
        alert('Package deleted successfully');
        this.loadPackages(this.pageNumber());
      },
      error: (err) => {
        console.error('Error deleting package:', err);
        this.error.set(err.message || 'Failed to delete package');
      },
    });
  }
}

