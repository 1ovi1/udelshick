import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { AdminDataService } from '../../services/admin.service';
import { AdminActivityItem } from '../../models/admin/admin-activity-item.interface';
import { AdminUsersTab } from '../../models/admin/admin-users-tab.type';
import { ADMIN_USERS_TABS } from './constants/admin-users-tab-view.constant';
import { formatDateRu } from '../../utils/date-format.util';
import {
  toAdminActivityStatusColor,
  toAdminActivityStatusLabel,
} from '../../utils/admin-activity-status.util';

@Component({
  selector: 'app-admin-users-page',
  imports: [
    NzLayoutModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzTabsModule,
  ],
  templateUrl: './admin-users.page.html',
  styleUrl: './admin-users.page.scss',
})
export class AdminUsersPage implements OnInit {
  private readonly adminDataService = inject(AdminDataService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoading = signal(false);
  protected readonly users = signal<AdminActivityItem[]>([]);
  protected readonly tabs = ADMIN_USERS_TABS;
  protected readonly formatDate = formatDateRu;
  protected readonly toStatusLabel = toAdminActivityStatusLabel;
  protected readonly toStatusColor = toAdminActivityStatusColor;
  protected readonly pageIndex = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly total = signal(0);
  protected readonly activeTab = signal<AdminUsersTab>('all');
  protected readonly deletingAuthId = signal<string | null>(null);

  protected readonly selectedTabIndex = computed(() => {
    const tab = this.activeTab();
    const index = this.tabs.findIndex((item) => item.key === tab);

    return index >= 0 ? index : 0;
  });

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

  protected onTabIndexChange(index: number): void {
    const tab = this.tabs[index]?.key;

    if (!tab || tab === this.activeTab()) {
      return;
    }

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
