import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from '../../../core/services/GroupService/group-service';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { GroupDto } from '../../../core/interfaces/group.interface';

@Component({
    selector: 'app-manage-groups',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './manage-groups.html',
    styleUrl: './manage-groups.scss',
})
export class ManageGroups implements OnInit {
    private readonly _router = inject(Router);
    private readonly _groupService = inject(GroupService);
    private readonly _tokenService = inject(TokenService);

    groups = signal<GroupDto[]>([]);
    loading = signal<boolean>(true);
    error = signal<string | null>(null);
    deleting = signal<string | null>(null);

    ngOnInit(): void {
        this.loadGroups();
    }

    loadGroups(): void {
        const user = this._tokenService.getUser();
        if (!user || !user.userId) {
            this.error.set('User information not found.');
            this.loading.set(false);
            return;
        }

        this.loading.set(true);
        this._groupService.getGroupsByInstructor(user.userId).subscribe({
            next: (result) => {
                // Handle both simple array and PagedResult
                const items = (result as any).items || (Array.isArray(result) ? result : []);
                this.groups.set(items);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading groups:', err);
                this.error.set('Failed to load groups. Please try again.');
                this.loading.set(false);
            }
        });
    }

    createGroup(): void {
        this._router.navigate(['/instructor/groups/create']);
    }

    viewGroup(groupId: string): void {
        this._router.navigate(['/instructor/groups', groupId]);
    }

    deleteGroup(event: Event, groupId: string): void {
        event.stopPropagation(); // Prevent card click

        if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
            return;
        }

        this.deleting.set(groupId);
        this._groupService.deleteGroup(groupId).subscribe({
            next: () => {
                this.groups.update(current => current.filter(g => g.groupId !== groupId));
                this.deleting.set(null);
            },
            error: (err) => {
                console.error('Error deleting group:', err);
                alert('Failed to delete group.');
                this.deleting.set(null);
            }
        });
    }

    // Navigation methods matching sidebar
    navigateToDashboard(): void { this._router.navigate(['/instructor']); }
    navigateToCourses(): void { this._router.navigate(['/instructor/courses']); }
    navigateToGroups(): void { this._router.navigate(['/instructor/groups']); }
    navigateToEarnings(): void { this._router.navigate(['/instructor/earnings']); }

    handleSignOut(): void {
        // Implement signout logic or reuse shared logic
        this._router.navigate(['/login']);
    }
}
