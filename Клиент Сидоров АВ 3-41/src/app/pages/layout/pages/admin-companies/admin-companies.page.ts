import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { AdminDataService } from '../../services/admin.service';
import { AdminVacancyItem } from '../../models/admin/admin-vacancy-item.interface';
import { AdminVacancyTab } from '../../models/admin/admin-vacancy-tab.type';
import { VacancyStatus } from '../../models/admin/vacancy-status.type';
import { CandidateVacancyRouteState } from '../../models/candidate/candidate-vacancy-route-state.interface';
import { ADMIN_VACANCY_TABS } from './constants/admin-vacancy-tab-view.constant';
import { formatDateRu } from '../../utils/date-format.util';
import { toVacancyStatusColor, toVacancyStatusLabel } from '../../utils/vacancy-status.util';

@Component({
  selector: 'app-admin-companies-page',
  imports: [
    NzLayoutModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzTabsModule,
  ],
  templateUrl: './admin-companies.page.html',
  styleUrl: './admin-companies.page.scss',
})
export class AdminVacanciesPage implements OnInit {
  private readonly adminDataService = inject(AdminDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly vacancies = signal<AdminVacancyItem[]>([]);
  protected readonly tabs = ADMIN_VACANCY_TABS;
  protected readonly formatDate = formatDateRu;
  protected readonly toStatusLabel = toVacancyStatusLabel;
  protected readonly toStatusColor = toVacancyStatusColor;
  protected readonly activeTab = signal<AdminVacancyTab>('all');
  protected readonly pageIndex = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly total = signal(0);
  protected readonly actionVacancyId = signal<string | null>(null);

  protected readonly selectedTabIndex = computed(() => {
    const tab = this.activeTab();
    const index = this.tabs.findIndex((item) => item.key === tab);

    return index >= 0 ? index : 0;
  });

  ngOnInit(): void {
    this.loadVacancies();
  }

  protected onQueryParamsChange(params: NzTableQueryParams): void {
    const nextPage = params.pageIndex;
    const nextPageSize = params.pageSize;

    if (nextPage === this.pageIndex() && nextPageSize === this.pageSize()) {
      return;
    }

    this.pageIndex.set(nextPage);
    this.pageSize.set(nextPageSize);
    this.loadVacancies();
  }

  protected onTabIndexChange(index: number): void {
    const tab = this.tabs[index]?.key;

    if (!tab || tab === this.activeTab()) {
      return;
    }

    this.activeTab.set(tab);
    this.pageIndex.set(1);
    this.loadVacancies();
  }

  protected publish(vacancyId: string): void {
    this.runAction(vacancyId, () => this.adminDataService.publishVacancy(vacancyId));
  }

  protected archive(vacancyId: string): void {
    this.runAction(vacancyId, () => this.adminDataService.archiveVacancy(vacancyId));
  }

  protected delete(vacancyId: string): void {
    this.runAction(vacancyId, () => this.adminDataService.deleteVacancy(vacancyId));
  }

  protected isActionLoading(vacancyId: string): boolean {
    return this.actionVacancyId() === vacancyId;
  }

  protected openVacancyDetails(item: AdminVacancyItem): void {
    const state: CandidateVacancyRouteState = {
      sourceRole: 'admin',
      vacancyPreview: item,
    };

    void this.router.navigate(['/layout/vacancy', item.id], { state });
  }

  protected onActionClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  private loadVacancies(): void {
    this.isLoading.set(true);

    const activeTab = this.activeTab();
    const status: VacancyStatus | undefined = activeTab === 'all' ? undefined : activeTab;

    this.adminDataService
      .getVacancies(this.pageIndex(), this.pageSize(), status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.vacancies.set(result.items);
          this.total.set(result.meta.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  private runAction(vacancyId: string, action: () => import('rxjs').Observable<void>): void {
    if (this.actionVacancyId()) {
      return;
    }

    this.actionVacancyId.set(vacancyId);

    action()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.actionVacancyId.set(null);
          this.loadVacancies();
        },
        error: () => {
          this.actionVacancyId.set(null);
        },
      });
  }
}
