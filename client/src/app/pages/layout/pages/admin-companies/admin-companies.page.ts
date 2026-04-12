import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { AdminDataService } from '../../services/admin.service';
import { AdminVacancyItem } from '../../models/admin/admin-vacancy-item.interface';
import { AdminVacancyTab } from '../../models/admin/admin-vacancy-tab.type';
import { VacancyStatus } from '../../models/admin/vacancy-status.type';

@Component({
  selector: 'app-admin-companies-page',
  imports: [NzLayoutModule, NzTableModule, NzTagModule, NzButtonModule, NzPopconfirmModule],
  templateUrl: './admin-companies.page.html',
  styleUrl: './admin-companies.page.scss',
})
export class AdminVacanciesPage implements OnInit {
  private readonly adminDataService = inject(AdminDataService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoading = signal(false);
  protected readonly vacancies = signal<AdminVacancyItem[]>([]);
  protected readonly activeTab = signal<AdminVacancyTab>('all');
  protected readonly pageIndex = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly total = signal(0);
  protected readonly actionVacancyId = signal<string | null>(null);

  protected readonly displayedVacancies = computed(() => {
    const tab = this.activeTab();
    const allVacancies = this.vacancies();

    if (tab === 'published') {
      return allVacancies.filter((item) => item.status === 'published');
    }

    if (tab === 'archived') {
      return allVacancies.filter((item) => item.status === 'archived');
    }

    return allVacancies;
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

  protected setTab(tab: AdminVacancyTab): void {
    this.activeTab.set(tab);
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

  protected formatDate(value: string | null): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value);

    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  protected toStatusLabel(status: VacancyStatus): string {
    if (status === 'published') {
      return 'Опубликована';
    }

    if (status === 'archived') {
      return 'В архиве';
    }

    return 'На рассмотрении';
  }

  protected toStatusColor(status: VacancyStatus): 'green' | 'gold' | 'default' {
    if (status === 'published') {
      return 'green';
    }

    if (status === 'pending_review') {
      return 'gold';
    }

    return 'default';
  }

  protected isActionLoading(vacancyId: string): boolean {
    return this.actionVacancyId() === vacancyId;
  }

  private loadVacancies(): void {
    this.isLoading.set(true);

    this.adminDataService
      .getVacancies(this.pageIndex(), this.pageSize())
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
