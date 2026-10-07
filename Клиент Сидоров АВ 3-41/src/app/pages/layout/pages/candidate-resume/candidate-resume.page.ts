import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  TemplateRef,
  computed,
  inject,
  viewChild,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CandidateResumeEducationItem } from '../../models/candidate/candidate-resume-education-item.interface';
import { CandidateResumeExperienceItem } from '../../models/candidate/candidate-resume-experience-item.interface';
import { CandidateResumeStep } from '../../models/candidate/candidate-resume-step.type';
import { CandidateSkillItem } from '../../models/candidate/candidate-skill-item.interface';
import { UpsertCandidateResumeRequest } from '../../models/candidate/upsert-candidate-resume-request.interface';
import { CandidateDataService } from '../../services/candidate.service';
import { CANDIDATE_RESUME_STEPS } from './constants/candidate-resume-step-view.constant';
import { CandidateResumeEducationCardComponent } from './components/candidate-resume-education-card/candidate-resume-education-card.component';
import { CandidateResumeExperienceCardComponent } from './components/candidate-resume-experience-card/candidate-resume-experience-card.component';
import { formatSalaryRub } from '../../utils/salary-format.util';

@Component({
  selector: 'app-candidate-resume-page',
  imports: [
    NzLayoutModule,
    NzStepsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzCardModule,
    NzTagModule,
    NzModalModule,
    ReactiveFormsModule,
    NgTemplateOutlet,
    CandidateResumeExperienceCardComponent,
    CandidateResumeEducationCardComponent,
  ],
  templateUrl: './candidate-resume.page.html',
  styleUrl: './candidate-resume.page.scss',
})
export class CandidateResumePage implements OnInit {
  private readonly candidateDataService = inject(CandidateDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  private draftExperienceIndex = 0;
  private draftEducationIndex = 0;

  protected readonly steps = CANDIDATE_RESUME_STEPS;
  protected readonly formatSalary = formatSalaryRub;

  protected readonly isInitialLoading = signal(true);
  protected readonly isSkillsLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly currentStepIndex = signal(0);

  protected readonly skills = signal<CandidateSkillItem[]>([]);
  protected readonly selectedSkillIds = signal<string[]>([]);
  protected readonly experiences = signal<CandidateResumeExperienceItem[]>([]);
  protected readonly educations = signal<CandidateResumeEducationItem[]>([]);
  protected readonly resumeId = signal<string | null>(null);

  protected readonly isExperiencePreviewOpen = signal(false);
  protected readonly isEducationPreviewOpen = signal(false);

  protected readonly selectedSkills = computed(() => {
    const selectedIds = new Set(this.selectedSkillIds());
    return this.skills().filter((item) => selectedIds.has(item.id));
  });

  protected readonly currentStep = computed((): CandidateResumeStep => {
    return this.steps[this.currentStepIndex()]?.key ?? 'base';
  });

  protected readonly baseForm = this.formBuilder.group({
    profession: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(150)],
    }),
    location: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(120)],
    }),
    expectedSalary: this.formBuilder.control<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    about: this.formBuilder.nonNullable.control('', {
      validators: [Validators.maxLength(5000)],
    }),
  });

  protected readonly experienceForm = this.formBuilder.group({
    companyName: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(150)],
    }),
    position: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(150)],
    }),
    period: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(120)],
    }),
    description: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(3000)],
    }),
  });

  protected readonly educationForm = this.formBuilder.group({
    institutionName: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(200)],
    }),
    studyPeriod: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(120)],
    }),
    degree: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(120)],
    }),
    specialization: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(200)],
    }),
  });

  private readonly baseStepTemplate = viewChild<TemplateRef<unknown>>('baseStepTemplate');
  private readonly experienceStepTemplate =
    viewChild<TemplateRef<unknown>>('experienceStepTemplate');
  private readonly educationStepTemplate = viewChild<TemplateRef<unknown>>('educationStepTemplate');
  private readonly skillsStepTemplate = viewChild<TemplateRef<unknown>>('skillsStepTemplate');
  private readonly reviewStepTemplate = viewChild<TemplateRef<unknown>>('reviewStepTemplate');

  ngOnInit(): void {
    this.loadSkills();
    this.loadResume();
  }

  protected currentStepTemplate(): TemplateRef<unknown> | null {
    const step = this.currentStep();

    if (step === 'base') {
      return this.baseStepTemplate() ?? null;
    }

    if (step === 'experience') {
      return this.experienceStepTemplate() ?? null;
    }

    if (step === 'education') {
      return this.educationStepTemplate() ?? null;
    }

    if (step === 'skills') {
      return this.skillsStepTemplate() ?? null;
    }

    return this.reviewStepTemplate() ?? null;
  }

  protected goToPreviousStep(): void {
    const currentIndex = this.currentStepIndex();

    if (currentIndex === 0) {
      return;
    }

    this.currentStepIndex.set(currentIndex - 1);
  }

  protected goToNextStep(): void {
    const step = this.currentStep();

    if (step === 'base' && this.baseForm.invalid) {
      this.baseForm.markAllAsTouched();
      return;
    }

    const currentIndex = this.currentStepIndex();

    if (currentIndex >= this.steps.length - 1) {
      return;
    }

    this.currentStepIndex.set(currentIndex + 1);
  }

  protected addExperience(): void {
    if (this.experienceForm.invalid) {
      this.experienceForm.markAllAsTouched();
      return;
    }

    const value = this.experienceForm.getRawValue();
    const next = [...this.experiences()];

    next.push({
      id: `exp-draft-${this.draftExperienceIndex}`,
      companyName: value.companyName.trim(),
      position: value.position.trim(),
      period: value.period.trim(),
      description: value.description.trim(),
      orderIndex: next.length,
    });

    this.draftExperienceIndex += 1;
    this.experiences.set(next);
    this.experienceForm.reset({
      companyName: '',
      position: '',
      period: '',
      description: '',
    });
  }

  protected removeExperience(id: string): void {
    const filtered = this.experiences().filter((item) => item.id !== id);
    this.experiences.set(
      filtered.map((item, index) => ({
        ...item,
        orderIndex: index,
      })),
    );
  }

  protected addEducation(): void {
    if (this.educationForm.invalid) {
      this.educationForm.markAllAsTouched();
      return;
    }

    const value = this.educationForm.getRawValue();
    const next = [...this.educations()];

    next.push({
      id: `edu-draft-${this.draftEducationIndex}`,
      institutionName: value.institutionName.trim(),
      studyPeriod: value.studyPeriod.trim(),
      degree: value.degree.trim(),
      specialization: value.specialization.trim(),
      orderIndex: next.length,
    });

    this.draftEducationIndex += 1;
    this.educations.set(next);
    this.educationForm.reset({
      institutionName: '',
      studyPeriod: '',
      degree: '',
      specialization: '',
    });
  }

  protected removeEducation(id: string): void {
    const filtered = this.educations().filter((item) => item.id !== id);
    this.educations.set(
      filtered.map((item, index) => ({
        ...item,
        orderIndex: index,
      })),
    );
  }

  protected isSkillSelected(skillId: string): boolean {
    return this.selectedSkillIds().includes(skillId);
  }

  protected toggleSkill(skillId: string): void {
    const current = this.selectedSkillIds();

    if (current.includes(skillId)) {
      this.selectedSkillIds.set(current.filter((item) => item !== skillId));
      return;
    }

    this.selectedSkillIds.set([...current, skillId]);
  }

  protected removeSkill(skillId: string): void {
    this.selectedSkillIds.set(this.selectedSkillIds().filter((item) => item !== skillId));
  }

  protected openExperiencePreview(): void {
    this.isExperiencePreviewOpen.set(true);
  }

  protected closeExperiencePreview(): void {
    this.isExperiencePreviewOpen.set(false);
  }

  protected openEducationPreview(): void {
    this.isEducationPreviewOpen.set(true);
  }

  protected closeEducationPreview(): void {
    this.isEducationPreviewOpen.set(false);
  }

  protected startEditing(): void {
    this.currentStepIndex.set(0);
  }

  protected saveResume(): void {
    if (this.baseForm.invalid || this.isSaving()) {
      this.baseForm.markAllAsTouched();
      return;
    }

    const base = this.baseForm.getRawValue();
    const payload: UpsertCandidateResumeRequest = {
      profession: base.profession.trim(),
      location: base.location.trim(),
      expectedSalary: base.expectedSalary,
      about: this.toNullableString(base.about),
      skillIds: this.selectedSkillIds(),
      experiences: this.experiences().map((item, index) => ({
        companyName: item.companyName,
        position: item.position,
        period: item.period,
        description: item.description,
        orderIndex: index,
      })),
      educations: this.educations().map((item, index) => ({
        institutionName: item.institutionName,
        studyPeriod: item.studyPeriod,
        degree: item.degree,
        specialization: item.specialization,
        orderIndex: index,
      })),
    };

    this.isSaving.set(true);

    this.candidateDataService
      .upsertResume(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resume) => {
          this.applyResumeToDraft(resume);
          this.currentStepIndex.set(this.steps.length - 1);
          this.isSaving.set(false);
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
  }

  private loadSkills(): void {
    this.isSkillsLoading.set(true);

    this.candidateDataService
      .getSkills()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (skills) => {
          this.skills.set(skills);
          this.isSkillsLoading.set(false);
        },
        error: () => {
          this.isSkillsLoading.set(false);
        },
      });
  }

  private loadResume(): void {
    this.isInitialLoading.set(true);

    this.candidateDataService
      .getOwnResume()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resume) => {
          if (resume) {
            this.applyResumeToDraft(resume);
            this.currentStepIndex.set(this.steps.length - 1);
          } else {
            this.resetDraft();
            this.currentStepIndex.set(0);
          }

          this.isInitialLoading.set(false);
        },
        error: () => {
          this.isInitialLoading.set(false);
        },
      });
  }

  private applyResumeToDraft(resume: {
    id: string;
    profession: string;
    location: string;
    expectedSalary: number | null;
    about: string | null;
    resumePdfUrl: string | null;
    skills: CandidateSkillItem[];
    experiences: CandidateResumeExperienceItem[];
    educations: CandidateResumeEducationItem[];
  }): void {
    this.resumeId.set(resume.id);
    this.baseForm.reset({
      profession: resume.profession,
      location: resume.location,
      expectedSalary: resume.expectedSalary,
      about: resume.about ?? '',
    });

    const sortedExperiences = [...resume.experiences].sort((a, b) => a.orderIndex - b.orderIndex);
    const sortedEducations = [...resume.educations].sort((a, b) => a.orderIndex - b.orderIndex);

    this.experiences.set(sortedExperiences);
    this.educations.set(sortedEducations);
    this.selectedSkillIds.set(resume.skills.map((skill) => skill.id));
  }

  private resetDraft(): void {
    this.resumeId.set(null);
    this.baseForm.reset({
      profession: '',
      location: '',
      expectedSalary: null,
      about: '',
    });
    this.experienceForm.reset({
      companyName: '',
      position: '',
      period: '',
      description: '',
    });
    this.educationForm.reset({
      institutionName: '',
      studyPeriod: '',
      degree: '',
      specialization: '',
    });

    this.experiences.set([]);
    this.educations.set([]);
    this.selectedSkillIds.set([]);
  }

  private toNullableString(value: string): string | null {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
}
