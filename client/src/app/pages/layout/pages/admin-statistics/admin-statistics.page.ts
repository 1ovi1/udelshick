import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AdminDataService } from '../../services/admin.service';
import { AdminDashboardMetrics } from '../../models/admin/admin-dashboard-metrics.interface';
import { AdminActivityItem } from '../../models/admin/admin-activity-item.interface';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import {
  toAdminActivityStatusColor,
  toAdminActivityStatusLabel,
} from '../../utils/admin-activity-status.util';
import { formatDateTimeRu } from '../../utils/date-format.util';

@Component({
  selector: 'app-admin-statistics-page',
  imports: [NzLayoutModule, NzCardModule, NzTableModule, NzTagModule],
  templateUrl: './admin-statistics.page.html',
  styleUrl: './admin-statistics.page.scss',
})
export class AdminStatisticsPage implements OnInit {
  private readonly adminDataService = inject(AdminDataService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoading = signal(false);
  protected readonly toStatusLabel = toAdminActivityStatusLabel;
  protected readonly toStatusColor = toAdminActivityStatusColor;
  protected readonly formatDateTime = formatDateTimeRu;
  protected readonly metrics = signal<AdminDashboardMetrics>({
    candidatesCount: 0,
    companiesCount: 0,
    vacanciesCount: 0,
    applicationsCount: 0,
  });
  protected readonly activityItems = signal<AdminActivityItem[]>([]);
  protected readonly pageIndex = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly total = signal(0);

  ngOnInit(): void {
    this.loadDashboard();
  }

  protected onQueryParamsChange(params: NzTableQueryParams): void {
    const nextPage = params.pageIndex;
    const nextPageSize = params.pageSize;

    if (nextPage === this.pageIndex() && nextPageSize === this.pageSize()) {
      return;
    }

    this.pageIndex.set(nextPage);
    this.pageSize.set(nextPageSize);
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.isLoading.set(true);

    this.adminDataService
      .getDashboard(this.pageIndex(), this.pageSize())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dashboard) => {
          this.metrics.set(dashboard.metrics);
          this.activityItems.set(dashboard.recentActivity.items);
          this.total.set(dashboard.recentActivity.meta.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }
}
