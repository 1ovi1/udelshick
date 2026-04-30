import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CompanyCandidateItem } from '../../models/company/company-candidate-item.interface';
import { CompanyCandidateResume } from '../../models/company/company-candidate-resume.interface';
import { CompanyVacancyItem } from '../../models/company/company-vacancy-item.interface';
import { CompanyDataService } from '../../services/company.service';
import { CandidateCardComponent } from './components/candidate-card/candidate-card.component';

@Component({
  selector: 'app-company-candidates-page',
  imports: [
    NzLayoutModule,
    NzButtonModule,
    NzModalModule,
    NzTagModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzIconModule,
    NzPaginationModule,
    CandidateCardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './company-candidates.page.html',
  styleUrl: './company-candidates.page.scss',
})
export class CompanyCandidatesPage implements OnInit {
  private readonly companyDataService = inject(CompanyDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly isLoading = signal(false);
  protected readonly candidates = signal<CompanyCandidateItem[]>([]);
  protected readonly pageIndex = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly total = signal(0);
  protected readonly searchQuery = signal('');

  protected readonly filteredCandidates = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();

    if (!query) {
      return this.candidates();
    }

    return this.candidates().filter((item) => {
      const fullName = this.fullName(item).toLowerCase();

      return (
        fullName.includes(query) ||
        item.profession.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    });
  });

  protected readonly isResumeModalOpen = signal(false);
  protected readonly isResumeLoading = signal(false);
  protected readonly selectedResume = signal<CompanyCandidateResume | null>(null);

  protected readonly isInviteModalOpen = signal(false);
  protected readonly isInviting = signal(false);
  protected readonly selectedCandidateId = signal<string | null>(null);
  protected readonly selectableVacancies = signal<CompanyVacancyItem[]>([]);

  protected readonly inviteForm = this.formBuilder.group({
    vacancyId: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.loadCandidates();
    this.loadSelectableVacancies();
  }

  protected onPageIndexChange(nextPage: number): void {
    if (nextPage === this.pageIndex()) {
      return;
    }

    this.pageIndex.set(nextPage);
    this.loadCandidates();
  }

  protected onPageSizeChange(nextPageSize: number): void {
    if (nextPageSize === this.pageSize()) {
      return;
    }

    this.pageSize.set(nextPageSize);
    this.pageIndex.set(1);
    this.loadCandidates();
  }

  protected onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
  }

  protected openResume(candidateProfileId: string): void {
    this.isResumeModalOpen.set(true);
    this.isResumeLoading.set(true);
    this.selectedResume.set(null);

    this.companyDataService
      .getCandidateResume(candidateProfileId)
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
    this.selectedResume.set(null);
    this.isResumeLoading.set(false);
  }

  protected openInviteModal(candidateProfileId: string): void {
    this.selectedCandidateId.set(candidateProfileId);
    this.inviteForm.reset({ vacancyId: '' });
    this.isInviteModalOpen.set(true);
  }

  protected closeInviteModal(): void {
    this.isInviteModalOpen.set(false);
    this.isInviting.set(false);
    this.selectedCandidateId.set(null);
    this.inviteForm.reset({ vacancyId: '' });
  }

  protected submitInvite(): void {
    if (this.inviteForm.invalid || this.isInviting()) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    const candidateProfileId = this.selectedCandidateId();

    if (!candidateProfileId) {
      return;
    }

    const vacancyId = this.inviteForm.getRawValue().vacancyId;
    this.isInviting.set(true);

    this.companyDataService
      .inviteCandidate(candidateProfileId, vacancyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.closeInviteModal();
        },
        error: () => {
          this.isInviting.set(false);
        },
      });
  }

  protected fullName(item: CompanyCandidateItem): string {
    return `${item.firstName} ${item.lastName}`;
  }

  private loadCandidates(): void {
    this.isLoading.set(true);

    this.companyDataService
      .getCandidates(this.pageIndex(), this.pageSize())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.candidates.set(result.items);
          this.total.set(result.meta.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  private loadSelectableVacancies(): void {
    this.companyDataService
      .getVacancies(1, 100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          const filtered = result.items.filter((item) => item.status !== 'archived');
          this.selectableVacancies.set(filtered);
        },
      });
  }
}
