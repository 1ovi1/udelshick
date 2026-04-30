import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CandidateVacancyRouteState } from '../../models/candidate/candidate-vacancy-route-state.interface';
import { CandidateVacancyItem } from '../../models/candidate/candidate-vacancy-item.interface';
import { CandidateDataService } from '../../services/candidate.service';
import { CandidateVacancyCardComponent } from './components/candidate-vacancy-card/candidate-vacancy-card.component';

@Component({
  selector: 'app-candidate-vacancies-page',
  imports: [
    NzLayoutModule,
    NzButtonModule,
    NzPaginationModule,
    NzInputModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    CandidateVacancyCardComponent,
  ],
  templateUrl: './candidate-vacancies.page.html',
  styleUrl: './candidate-vacancies.page.scss',
})
export class CandidateVacanciesPage implements OnInit {
  private readonly candidateDataService = inject(CandidateDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly vacancies = signal<CandidateVacancyItem[]>([]);
  protected readonly pageIndex = signal(1);
  protected readonly pageSize = signal(8);
  protected readonly total = signal(0);
  protected readonly searchQuery = signal('');

  protected readonly isApplyModalOpen = signal(false);
  protected readonly isApplying = signal(false);
  protected readonly selectedVacancyId = signal<string | null>(null);

  protected readonly applyForm = this.formBuilder.group({
    coverLetter: this.formBuilder.control(''),
  });

  protected readonly filteredVacancies = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();

    if (!query) {
      return this.vacancies();
    }

    return this.vacancies().filter((item) => {
      return (
        item.position.toLowerCase().includes(query) ||
        item.companyName.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    });
  });

  ngOnInit(): void {
    this.loadVacancies();
  }

  protected onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
  }

  protected onPageIndexChange(page: number): void {
    if (page === this.pageIndex()) {
      return;
    }

    this.pageIndex.set(page);
    this.loadVacancies();
  }

  protected onPageSizeChange(size: number): void {
    if (size === this.pageSize()) {
      return;
    }

    this.pageSize.set(size);
    this.pageIndex.set(1);
    this.loadVacancies();
  }

  protected openVacancy(vacancy: CandidateVacancyItem): void {
    const state: CandidateVacancyRouteState = {
      sourceRole: 'candidate',
      vacancyPreview: vacancy,
    };

    void this.router.navigate(['/layout/vacancy', vacancy.id], { state });
  }

  protected openApplyModal(vacancyId: string): void {
    this.selectedVacancyId.set(vacancyId);
    this.applyForm.reset({ coverLetter: '' });
    this.isApplyModalOpen.set(true);
  }

  protected closeApplyModal(): void {
    this.isApplyModalOpen.set(false);
    this.isApplying.set(false);
    this.selectedVacancyId.set(null);
    this.applyForm.reset({ coverLetter: '' });
  }

  protected submitApply(): void {
    if (this.isApplying()) {
      return;
    }

    const vacancyId = this.selectedVacancyId();

    if (!vacancyId) {
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
          this.loadVacancies();
        },
        error: () => {
          this.isApplying.set(false);
        },
      });
  }

  private loadVacancies(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.candidateDataService
      .getVacancies(this.pageIndex(), this.pageSize())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.vacancies.set(result.items);
          this.total.set(result.meta.total);
          this.loadError.set(null);
          this.isLoading.set(false);
        },
        error: () => {
          this.loadError.set('Не удалось загрузить вакансии. Попробуйте позже.');
          this.isLoading.set(false);
        },
      });
  }
}
