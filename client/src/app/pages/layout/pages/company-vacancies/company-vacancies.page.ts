import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CompanyVacancyTab } from '../../models/company/company-vacancy-tab.type';
import { CompanyVacancyItem } from '../../models/company/company-vacancy-item.interface';
import { CompanySkillItem } from '../../models/company/company-skill-item.interface';
import { CreateCompanyVacancyRequest } from '../../models/company/create-company-vacancy-request.interface';
import { ExperienceLevel } from '../../models/company/experience-level.type';
import { VacancyStatus } from '../../models/company/vacancy-status.type';
import { CompanyDataService } from '../../services/company.service';
import { COMPANY_VACANCY_TABS } from './constants/vacancy-tab-view.constant';
import { COMPANY_EXPERIENCE_OPTIONS } from './constants/experience-option.constant';
import { toExperienceLevelLabel } from '../../utils/experience-level.util';
import { formatDateRu } from '../../utils/date-format.util';
import { formatSalaryRub } from '../../utils/salary-format.util';
import { toVacancyStatusColor, toVacancyStatusLabel } from '../../utils/vacancy-status.util';

@Component({
  selector: 'app-company-vacancies-page',
  imports: [
    NzLayoutModule,
    NzTableModule,
    NzTagModule,
    NzTabsModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './company-vacancies.page.html',
  styleUrl: './company-vacancies.page.scss',
})
export class CompanyVacanciesPage implements OnInit {
  private readonly companyDataService = inject(CompanyDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly tabs = COMPANY_VACANCY_TABS;
  protected readonly experienceOptions = COMPANY_EXPERIENCE_OPTIONS;
  protected readonly formatDate = formatDateRu;
  protected readonly formatSalary = formatSalaryRub;
  protected readonly toStatusLabel = toVacancyStatusLabel;
  protected readonly toStatusColor = toVacancyStatusColor;
  protected readonly toExperienceLabel = toExperienceLevelLabel;

  protected readonly isLoading = signal(false);
  protected readonly isCreating = signal(false);
  protected readonly isCreateModalOpen = signal(false);
  protected readonly vacancies = signal<CompanyVacancyItem[]>([]);
  protected readonly skills = signal<CompanySkillItem[]>([]);
  protected readonly pageIndex = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly total = signal(0);
  protected readonly activeTab = signal<CompanyVacancyTab>('all');
  protected readonly actionVacancyId = signal<string | null>(null);

  protected readonly selectedTabIndex = computed(() => {
    const tab = this.activeTab();
    const index = this.tabs.findIndex((item) => item.key === tab);

    return index >= 0 ? index : 0;
  });

  protected readonly createForm = this.formBuilder.group({
    position: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(120)],
    }),
    location: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(120)],
    }),
    salary: this.formBuilder.control<number | null>(null),
    experienceLevel: this.formBuilder.nonNullable.control<ExperienceLevel>('middle', {
      validators: [Validators.required],
    }),
    requirements: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(10)],
    }),
    skillIds: this.formBuilder.nonNullable.control<string[]>([], {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.loadSkills();
    this.loadVacancies();
  }

  protected onTabIndexChange(index: number): void {
    const nextTab = this.tabs[index]?.key;

    if (!nextTab || nextTab === this.activeTab()) {
      return;
    }

    this.activeTab.set(nextTab);
    this.pageIndex.set(1);
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

  protected openCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  protected closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
    this.isCreating.set(false);
    this.createForm.reset({
      position: '',
      location: '',
      salary: null,
      experienceLevel: 'middle',
      requirements: '',
      skillIds: [],
    });
  }

  protected submitCreateVacancy(): void {
    if (this.createForm.invalid || this.isCreating()) {
      this.createForm.markAllAsTouched();
      return;
    }

    const value = this.createForm.getRawValue();
    const payload: CreateCompanyVacancyRequest = {
      position: value.position.trim(),
      location: value.location.trim(),
      requirements: value.requirements.trim(),
      experienceLevel: value.experienceLevel,
      skillIds: value.skillIds,
    };

    if (value.salary !== null && value.salary !== undefined) {
      payload.salary = value.salary;
    }

    this.isCreating.set(true);

    this.companyDataService
      .createVacancy(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.closeCreateModal();
          this.pageIndex.set(1);
          this.loadVacancies();
        },
        error: () => {
          this.isCreating.set(false);
        },
      });
  }

  protected sendForReview(vacancyId: string): void {
    this.runVacancyAction(vacancyId, () => this.companyDataService.publishVacancy(vacancyId));
  }

  protected archive(vacancyId: string): void {
    this.runVacancyAction(vacancyId, () => this.companyDataService.archiveVacancy(vacancyId));
  }

  protected isActionLoading(vacancyId: string): boolean {
    return this.actionVacancyId() === vacancyId;
  }

  private loadSkills(): void {
    this.companyDataService
      .getSkills()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (skills) => {
          this.skills.set(skills);
        },
      });
  }

  private loadVacancies(): void {
    this.isLoading.set(true);

    const activeTab = this.activeTab();
    const status: VacancyStatus | undefined = activeTab === 'all' ? undefined : activeTab;

    this.companyDataService
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

  private runVacancyAction(vacancyId: string, action: () => import('rxjs').Observable<void>): void {
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
