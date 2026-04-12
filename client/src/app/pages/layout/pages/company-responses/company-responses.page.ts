import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ApplicationStatus } from '../../models/company/application-status.type';
import { CompanyApplicationItem } from '../../models/company/company-application-item.interface';
import { CompanyApplicationTab } from '../../models/company/company-application-tab.type';
import { CompanyCandidateResume } from '../../models/company/company-candidate-resume.interface';
import { CompanyDataService } from '../../services/company.service';
import { COMPANY_APPLICATION_TABS } from './constants/application-tab-view.constant';
import { formatDateRu } from '../../utils/date-format.util';
import {
  toApplicationStatusColor,
  toApplicationStatusLabel,
} from '../../utils/application-status.util';

@Component({
  selector: 'app-company-responses-page',
  imports: [
    NzLayoutModule,
    NzTableModule,
    NzTabsModule,
    NzButtonModule,
    NzTagModule,
    NzModalModule,
    NzPopconfirmModule,
  ],
  templateUrl: './company-responses.page.html',
  styleUrl: './company-responses.page.scss',
})
export class CompanyResponsesPage implements OnInit {
  private readonly companyDataService = inject(CompanyDataService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly tabs = COMPANY_APPLICATION_TABS;
  protected readonly formatDate = formatDateRu;
  protected readonly toStatusLabel = toApplicationStatusLabel;
  protected readonly toStatusColor = toApplicationStatusColor;

  protected readonly isLoading = signal(false);
  protected readonly applications = signal<CompanyApplicationItem[]>([]);
  protected readonly pageIndex = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly total = signal(0);
  protected readonly activeTab = signal<CompanyApplicationTab>('all');
  protected readonly actionApplicationId = signal<string | null>(null);

  protected readonly isResumeModalOpen = signal(false);
  protected readonly isResumeLoading = signal(false);
  protected readonly selectedResume = signal<CompanyCandidateResume | null>(null);

  protected readonly selectedTabIndex = computed(() => {
    const tab = this.activeTab();
    const index = this.tabs.findIndex((item) => item.key === tab);

    return index >= 0 ? index : 0;
  });

  ngOnInit(): void {
    this.loadApplications();
  }

  protected onTabIndexChange(index: number): void {
    const tab = this.tabs[index]?.key;

    if (!tab || tab === this.activeTab()) {
      return;
    }

    this.activeTab.set(tab);
    this.pageIndex.set(1);
    this.loadApplications();
  }

  protected onQueryParamsChange(params: NzTableQueryParams): void {
    const nextPage = params.pageIndex;
    const nextPageSize = params.pageSize;

    if (nextPage === this.pageIndex() && nextPageSize === this.pageSize()) {
      return;
    }

    this.pageIndex.set(nextPage);
    this.pageSize.set(nextPageSize);
    this.loadApplications();
  }

  protected openResume(applicationId: string): void {
    this.isResumeModalOpen.set(true);
    this.isResumeLoading.set(true);
    this.selectedResume.set(null);

    this.companyDataService
      .getApplicationResume(applicationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resume) => {
          this.selectedResume.set(resume);
          this.isResumeLoading.set(false);
        },
        error: () => {
          this.isResumeLoading.set(false);
        },
      });
  }

  protected closeResumeModal(): void {
    this.isResumeModalOpen.set(false);
    this.isResumeLoading.set(false);
    this.selectedResume.set(null);
  }

  protected invite(applicationId: string): void {
    this.runApplicationAction(applicationId, () =>
      this.companyDataService.inviteApplication(applicationId),
    );
  }

  protected reject(applicationId: string): void {
    this.runApplicationAction(applicationId, () =>
      this.companyDataService.rejectApplication(applicationId),
    );
  }

  protected isActionLoading(applicationId: string): boolean {
    return this.actionApplicationId() === applicationId;
  }

  private loadApplications(): void {
    this.isLoading.set(true);

    const activeTab = this.activeTab();
    const status: ApplicationStatus | undefined = activeTab === 'all' ? undefined : activeTab;

    this.companyDataService
      .getApplications(this.pageIndex(), this.pageSize(), status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.applications.set(result.items);
          this.total.set(result.meta.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  private runApplicationAction(
    applicationId: string,
    action: () => import('rxjs').Observable<void>,
  ): void {
    if (this.actionApplicationId()) {
      return;
    }

    this.actionApplicationId.set(applicationId);

    action()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.actionApplicationId.set(null);
          this.loadApplications();
        },
        error: () => {
          this.actionApplicationId.set(null);
        },
      });
  }
}
