import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from '../../../core/services/SubscriptionService/subscription-service';
import {
  SubscriptionPackageDto,
  InstructorSubscriptionDto,
  SubscribeDto,
  PagedResult,
} from '../../../core/interfaces/subscription.interface';
import { TokenService } from '../../../core/services/TokenService/token-service';

@Component({
  selector: 'app-instructor-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription.html',
  styleUrl: './subscription.scss',
})
export class InstructorSubscription implements OnInit {
  private readonly _subscriptionService = inject(SubscriptionService);
  private readonly _tokenService = inject(TokenService);

  packages = signal<SubscriptionPackageDto[]>([]);
  currentSubscription = signal<InstructorSubscriptionDto | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  showSubscribeModal = signal<boolean>(false);
  selectedPackage = signal<SubscriptionPackageDto | null>(null);

  ngOnInit(): void {
    this.loadPackages();
    this.loadCurrentSubscription();
  }

  loadPackages(): void {
    this._subscriptionService.getAllPackages(1, 100).subscribe({
      next: (result: PagedResult<SubscriptionPackageDto>) => {
        this.packages.set(result.items);
      },
      error: (err) => {
        console.error('Error loading packages:', err);
        this.error.set(err.message || 'Failed to load packages');
      },
    });
  }

  loadCurrentSubscription(): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this._subscriptionService.getInstructorSubscription(user.userId).subscribe({
      next: (subscription) => {
        this.currentSubscription.set(subscription);
        this.loading.set(false);
      },
      error: (err) => {
        // If 404, no subscription exists yet
        if (err.status === 404) {
          this.currentSubscription.set(null);
        } else {
          console.error('Error loading subscription:', err);
          this.error.set(err.message || 'Failed to load subscription');
        }
        this.loading.set(false);
      },
    });
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
      month: 'long',
      day: 'numeric',
    });
  }

  isSubscriptionActive(): boolean {
    const subscription = this.currentSubscription();
    if (!subscription) return false;
    return subscription.isActive && new Date(subscription.endDate) > new Date();
  }

  openSubscribeModal(pkg: SubscriptionPackageDto): void {
    this.selectedPackage.set(pkg);
    this.showSubscribeModal.set(true);
  }

  closeSubscribeModal(): void {
    this.showSubscribeModal.set(false);
    this.selectedPackage.set(null);
  }

  subscribe(): void {
    const pkg = this.selectedPackage();
    const user = this._tokenService.getUser();

    if (!pkg || !user || !user.userId) {
      this.error.set('Please select a package');
      return;
    }

    const subscribeData: SubscribeDto = {
      instructorId: user.userId,
      packageId: pkg.packageId,
    };

    this._subscriptionService.subscribe(subscribeData).subscribe({
      next: () => {
        alert('Subscription successful!');
        this.closeSubscribeModal();
        this.loadCurrentSubscription();
      },
      error: (err) => {
        console.error('Error subscribing:', err);
        this.error.set(err.message || 'Failed to subscribe');
      },
    });
  }

  cancelSubscription(): void {
    const subscription = this.currentSubscription();
    if (!subscription) return;

    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    this._subscriptionService.cancelSubscription(subscription.subscriptionId).subscribe({
      next: () => {
        alert('Subscription cancelled successfully');
        this.loadCurrentSubscription();
      },
      error: (err) => {
        console.error('Error cancelling subscription:', err);
        this.error.set(err.message || 'Failed to cancel subscription');
      },
    });
  }

  renewSubscription(): void {
    const subscription = this.currentSubscription();
    if (!subscription) return;

    this._subscriptionService.renewSubscription(subscription.subscriptionId).subscribe({
      next: () => {
        alert('Subscription renewed successfully!');
        this.loadCurrentSubscription();
      },
      error: (err) => {
        console.error('Error renewing subscription:', err);
        this.error.set(err.message || 'Failed to renew subscription');
      },
    });
  }
}

