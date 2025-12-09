import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AffiliateService } from '../../../core/services/Affiliates/affiliates';
import { AffiliateDto, PagedResult } from '../../../core/interfaces/affiliate.interface';

@Component({
  selector: 'app-affiliates-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './affiliates-management.html',
  styleUrl: './affiliates-management.scss',
})
export class AffiliatesManagement implements OnInit {
  private readonly _affiliateService = inject(AffiliateService);

  affiliates = signal<AffiliateDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);

  showPayoutModal = signal<boolean>(false);
  selectedAffiliate = signal<AffiliateDto | null>(null);
  payoutAmount = signal<number | null>(null);
  commissionData = signal<{ affiliateId: string; totalCommission: number } | null>(null);

  ngOnInit(): void {
    this.loadAffiliates();
  }

  loadAffiliates(page: number = 1): void {
    this.loading.set(true);
    this.error.set(null);

    this._affiliateService.getAllAffiliates(page, this.pageSize()).subscribe({
      next: (result: PagedResult<AffiliateDto>) => {
        this.affiliates.set(result.items);
        this.pageNumber.set(result.pageNumber);
        this.pageSize.set(result.pageSize);
        this.totalPages.set(result.totalPages);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);

        // Load commission data for each affiliate
        result.items.forEach((affiliate) => {
          this.loadCommission(affiliate.affiliateId);
        });
      },
      error: (err) => {
        console.error('Error loading affiliates:', err);
        this.error.set(err.message || 'Failed to load affiliates');
        this.loading.set(false);
      },
    });
  }

  loadCommission(affiliateId: string): void {
    this._affiliateService.getTotalCommission(affiliateId).subscribe({
      next: (data) => {
        // Store commission data (you might want to use a map for this)
        this.commissionData.set(data);
      },
      error: (err) => {
        console.error('Error loading commission:', err);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.loadAffiliates(page);
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

  openPayoutModal(affiliate: AffiliateDto): void {
    this.selectedAffiliate.set(affiliate);
    this.payoutAmount.set(null);
    this.loadCommission(affiliate.affiliateId);
    this.showPayoutModal.set(true);
  }

  closePayoutModal(): void {
    this.showPayoutModal.set(false);
    this.selectedAffiliate.set(null);
    this.payoutAmount.set(null);
  }

  processPayout(): void {
    const affiliate = this.selectedAffiliate();
    const amount = this.payoutAmount();

    if (!affiliate) return;

    const payoutAmount = amount || affiliate.totalCommission;

    if (payoutAmount > affiliate.totalCommission) {
      this.error.set('Payout amount cannot exceed total commission');
      return;
    }

    this._affiliateService.processPayout(affiliate.affiliateId, payoutAmount).subscribe({
      next: () => {
        alert('Payout processed successfully');
        this.closePayoutModal();
        this.loadAffiliates(this.pageNumber());
      },
      error: (err) => {
        console.error('Error processing payout:', err);
        this.error.set(err.message || 'Failed to process payout');
      },
    });
  }

  getCommissionForAffiliate(affiliateId: string): number {
    const commission = this.commissionData();
    return commission && commission.affiliateId === affiliateId ? commission.totalCommission : 0;
  }
}

