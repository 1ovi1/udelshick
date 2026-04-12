import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { AdminDataService } from '../../services/admin.service';
import { AdminActivityItem } from '../../models/admin/admin-activity-item.interface';
import { AdminUsersTab } from '../../models/admin/admin-users-tab.type';

@Component({
  selector: 'app-admin-users-page',
  imports: [NzLayoutModule, NzTableModule, NzTagModule, NzButtonModule, NzPopconfirmModule],
  templateUrl: './admin-users.page.html',
  styleUrl: './admin-users.page.scss',
})
export class AdminUsersPage implements OnInit {
  private readonly adminDataService = inject(AdminDataService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoading = signal(false);
  protected readonly users = signal<AdminActivityItem[]>([]);
  protected readonly pageIndex = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly total = signal(0);
  protected readonly activeTab = signal<AdminUsersTab>('all');
  protected readonly deletingAuthId = signal<string | null>(null);

  protected readonly displayedUsers = computed(() => {
    const tab = this.activeTab();
    const allUsers = this.users();

    if (tab === 'candidate') {
      return allUsers.filter((item) => item.status === 'candidate');
    }

    if (tab === 'company') {
      return allUsers.filter((item) => item.status === 'company');
    }

    return allUsers;
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  protected onQueryParamsChange(params: NzTableQueryParams): void {
    const nextPage = params.pageIndex;
    const nextPageSize = params.pageSize;

    if (nextPage === this.pageIndex() && nextPageSize === this.pageSize()) {
      return;
    }

    this.pageIndex.set(nextPage);
    this.pageSize.set(nextPageSize);
    this.loadUsers();
  }

  protected setTab(tab: AdminUsersTab): void {
    this.activeTab.set(tab);
  }

  protected deleteUser(authId: string): void {
    if (this.deletingAuthId()) {
      return;
    }

    this.deletingAuthId.set(authId);

    this.adminDataService
      .deleteUser(authId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletingAuthId.set(null);
          this.loadUsers();
        },
        error: () => {
          this.deletingAuthId.set(null);
        },
      });
  }

  protected isDeleting(authId: string): boolean {
    return this.deletingAuthId() === authId;
  }

  protected formatDate(value: string): string {
    const date = new Date(value);

    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  protected toStatusLabel(status: 'candidate' | 'company'): string {
    return status === 'candidate' ? 'Кандидат' : 'Компания';
  }

  protected toStatusColor(status: 'candidate' | 'company'): 'green' | 'default' {
    return status === 'candidate' ? 'green' : 'default';
  }

  private loadUsers(): void {
    this.isLoading.set(true);

    this.adminDataService
      .getUsers(this.pageIndex(), this.pageSize())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.users.set(result.items);
          this.total.set(result.meta.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }
}
