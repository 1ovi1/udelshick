import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Auth } from '../../../auth/auth.service';
import { CompanyVacancyItem } from '../../models/company/company-vacancy-item.interface';
import { CompanyDataService } from '../../services/company.service';
import { formatDateRu } from '../../utils/date-format.util';
import { toVacancyStatusColor, toVacancyStatusLabel } from '../../utils/vacancy-status.util';

interface CompanyMetrics {
  publishedVacancies: number;
  pendingVacancies: number;
  archivedVacancies: number;
  newApplications: number;
  invitedApplications: number;
  rejectedApplications: number;
}

@Component({
  selector: 'app-company-profile-page',
  imports: [NzLayoutModule, NzTabsModule, NzCardModule, NzTableModule, NzTagModule],
  templateUrl: './company-profile.page.html',
  styleUrl: './company-profile.page.scss',
})
export class CompanyProfilePage implements OnInit {
  private readonly companyDataService = inject(CompanyDataService);
  private readonly auth = inject(Auth);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly user = this.auth.user;
  protected readonly isLoading = signal(false);
  protected readonly formatDate = formatDateRu;
  protected readonly toVacancyStatusLabel = toVacancyStatusLabel;
  protected readonly toVacancyStatusColor = toVacancyStatusColor;
  protected readonly metrics = signal<CompanyMetrics>({
    publishedVacancies: 0,
    pendingVacancies: 0,
    archivedVacancies: 0,
    newApplications: 0,
    invitedApplications: 0,
    rejectedApplications: 0,
  });
  protected readonly recentVacancies = signal<CompanyVacancyItem[]>([]);

  protected readonly totalVacancies = computed(() => {
    const value = this.metrics();

    return value.publishedVacancies + value.pendingVacancies + value.archivedVacancies;
  });

  protected readonly totalApplications = computed(() => {
    const value = this.metrics();

    return value.newApplications + value.invitedApplications + value.rejectedApplications;
  });

  ngOnInit(): void {
    this.loadSummary();
  }

  private loadSummary(): void {
    this.isLoading.set(true);

    forkJoin({
      publishedVacancies: this.companyDataService.getVacancies(1, 1, 'published'),
      pendingVacancies: this.companyDataService.getVacancies(1, 1, 'pending_review'),
      archivedVacancies: this.companyDataService.getVacancies(1, 1, 'archived'),
      newApplications: this.companyDataService.getApplications(1, 1, 'new'),
      invitedApplications: this.companyDataService.getApplications(1, 1, 'invited'),
      rejectedApplications: this.companyDataService.getApplications(1, 1, 'rejected'),
      recentVacancies: this.companyDataService.getVacancies(1, 5),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.metrics.set({
            publishedVacancies: result.publishedVacancies.meta.total,
            pendingVacancies: result.pendingVacancies.meta.total,
            archivedVacancies: result.archivedVacancies.meta.total,
            newApplications: result.newApplications.meta.total,
            invitedApplications: result.invitedApplications.meta.total,
            rejectedApplications: result.rejectedApplications.meta.total,
          });
          this.recentVacancies.set(result.recentVacancies.items);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }
}
