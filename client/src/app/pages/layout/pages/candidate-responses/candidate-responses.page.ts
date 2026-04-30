import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ApplicationStatus } from '../../models/candidate/application-status.type';
import { CandidateApplicationItem } from '../../models/candidate/candidate-application-item.interface';
import { CandidateApplicationTab } from '../../models/candidate/candidate-application-tab.type';
import { CandidateVacancyRouteState } from '../../models/candidate/candidate-vacancy-route-state.interface';
import { CandidateDataService } from '../../services/candidate.service';
import { CANDIDATE_APPLICATION_TABS } from './constants/candidate-application-tab-view.constant';
import {
  toCandidateApplicationStatusColor,
  toCandidateApplicationStatusLabel,
} from '../../utils/candidate-application-status.util';
import { formatDateRu } from '../../utils/date-format.util';

@Component({
  selector: 'app-candidate-responses-page',
  imports: [
    NzLayoutModule,
    NzTableModule,
    NzTabsModule,
    NzTagModule,
    NzButtonModule,
    NzPopconfirmModule,
  ],
  templateUrl: './candidate-responses.page.html',
  styleUrl: './candidate-responses.page.scss',
})
export class CandidateResponsesPage implements OnInit {
  private readonly candidateDataService = inject(CandidateDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  protected readonly tabs = CANDIDATE_APPLICATION_TABS;
  protected readonly formatDate = formatDateRu;
  protected readonly toStatusLabel = toCandidateApplicationStatusLabel;
  protected readonly toStatusColor = toCandidateApplicationStatusColor;

  protected readonly isLoading = signal(false);
  protected readonly applications = signal<CandidateApplicationItem[]>([]);
  protected readonly pageIndex = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly total = signal(0);
  protected readonly activeTab = signal<CandidateApplicationTab>('all');
  protected readonly actionApplicationId = signal<string | null>(null);

  protected readonly selectedTabIndex = computed(() => {
    const index = this.tabs.findIndex((tab) => tab.key === this.activeTab());
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

  protected openVacancy(vacancyId: string, vacancyPosition: string, companyName: string): void {
    const state: CandidateVacancyRouteState = {
      sourceRole: 'candidate',
      vacancyPreview: {
        id: vacancyId,
        position: vacancyPosition,
        companyName,
        location: 'Не указано',
        salary: null,
        experienceLevel: 'no_experience',
        matchingSkillsPercent: 0,
      },
    };

    void this.router.navigate(['/layout/vacancy', vacancyId], { state });
  }

  protected deleteApplication(applicationId: string): void {
    this.runAction(applicationId, () => this.candidateDataService.deleteApplication(applicationId));
  }

  protected isActionLoading(applicationId: string): boolean {
    return this.actionApplicationId() === applicationId;
  }

  protected onActionClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  private loadApplications(): void {
    this.isLoading.set(true);

    const activeTab = this.activeTab();
    const status: ApplicationStatus | undefined = activeTab === 'all' ? undefined : activeTab;

    this.candidateDataService
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

  private runAction(applicationId: string, action: () => import('rxjs').Observable<void>): void {
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
