import { Location } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Auth } from '../../../auth/auth.service';
import { AdminDataService } from '../../services/admin.service';
import { CandidateDataService } from '../../services/candidate.service';
import { CompanyDataService } from '../../services/company.service';
import { formatDateRu } from '../../utils/date-format.util';
import { getDefaultLayoutPath } from '../../utils/layout-tabs.utils';
import { formatSalaryRub } from '../../utils/salary-format.util';
import { VacancyDetailsMapper, VacancyDetailsViewModel } from './mappers/vacancy-details.mapper';

@Component({
  selector: 'app-vacancy-details-page',
  imports: [
    NzLayoutModule,
    NzCardModule,
    NzTagModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './vacancy-details.page.html',
  styleUrl: './vacancy-details.page.scss',
})
export class VacancyDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly auth = inject(Auth);
  private readonly adminDataService = inject(AdminDataService);
  private readonly candidateDataService = inject(CandidateDataService);
  private readonly companyDataService = inject(CompanyDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly formatDate = formatDateRu;
  protected readonly formatSalary = formatSalaryRub;

  protected readonly isLoading = signal(false);
  protected readonly isApplying = signal(false);
  protected readonly isApplyModalOpen = signal(false);
  protected readonly loadError = signal<string | null>(null);

  protected readonly vacancyId = signal<string | null>(null);
  protected readonly vacancy = signal<VacancyDetailsViewModel | null>(null);

  protected readonly applyForm = this.formBuilder.group({
    coverLetter: this.formBuilder.control(''),
  });

  protected readonly role = this.auth.role;
  protected readonly isCandidateRole = computed(() => this.role() === 'candidate');

  protected readonly canApply = computed(() => {
    const item = this.vacancy();

    return this.isCandidateRole() && !!item && item.hasApplied !== true;
  });

  ngOnInit(): void {
    const vacancyId = this.route.snapshot.paramMap.get('vacancyId');

    if (!vacancyId) {
      this.loadError.set('Идентификатор вакансии не найден.');
      return;
    }

    this.vacancyId.set(vacancyId);

    if (this.isCandidateRole()) {
      this.loadCandidateVacancy(vacancyId);
      return;
    }

    if (this.role() === 'company') {
      this.loadCompanyVacancy(vacancyId);
      return;
    }

    if (this.role() === 'admin') {
      this.loadAdminVacancy(vacancyId);
      return;
    }

    this.loadError.set('Недостаточно прав для просмотра вакансии.');
  }

  protected goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    void this.router.navigateByUrl(getDefaultLayoutPath(this.role()));
  }

  protected openApplyModal(): void {
    if (!this.canApply()) {
      return;
    }

    this.applyForm.reset({ coverLetter: '' });
    this.isApplyModalOpen.set(true);
  }

  protected closeApplyModal(): void {
    this.isApplyModalOpen.set(false);
    this.isApplying.set(false);
    this.applyForm.reset({ coverLetter: '' });
  }

  protected submitApply(): void {
    const vacancyId = this.vacancyId();

    if (!vacancyId || this.isApplying()) {
      return;
    }

    const coverLetterRaw = this.applyForm.getRawValue().coverLetter?.trim();
    this.isApplying.set(true);

    this.candidateDataService
      .applyToVacancy(vacancyId, {
        coverLetter: coverLetterRaw ? coverLetterRaw : undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.closeApplyModal();
          this.loadCandidateVacancy(vacancyId);
        },
        error: () => {
          this.isApplying.set(false);
        },
      });
  }

  private loadCandidateVacancy(vacancyId: string): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.candidateDataService
      .getVacancyDetails(vacancyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (vacancy) => {
          this.vacancy.set(VacancyDetailsMapper.fromCandidate(vacancy));
          this.isLoading.set(false);
        },
        error: () => {
          this.vacancy.set(null);
          this.isLoading.set(false);
          this.loadError.set('Не удалось загрузить детали вакансии.');
        },
      });
  }

  private loadCompanyVacancy(vacancyId: string): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.companyDataService
      .getVacancyDetails(vacancyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (vacancy) => {
          this.vacancy.set(VacancyDetailsMapper.fromCompany(vacancy));
          this.isLoading.set(false);
        },
        error: () => {
          this.vacancy.set(null);
          this.isLoading.set(false);
          this.loadError.set('Не удалось загрузить детали вакансии.');
        },
      });
  }

  private loadAdminVacancy(vacancyId: string): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.adminDataService
      .getVacancyDetails(vacancyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (vacancy) => {
          this.vacancy.set(VacancyDetailsMapper.fromAdmin(vacancy));
          this.isLoading.set(false);
        },
        error: () => {
          this.vacancy.set(null);
          this.isLoading.set(false);
          this.loadError.set('Не удалось загрузить детали вакансии.');
        },
      });
  }
}
