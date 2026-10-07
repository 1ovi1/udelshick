import { Component, input, output } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CandidateVacancyItem } from '../../../../models/candidate/candidate-vacancy-item.interface';
import { toCandidateExperienceLevelLabel } from '../../../../utils/candidate-experience-level.util';
import { formatSalaryRub } from '../../../../utils/salary-format.util';

@Component({
  selector: 'app-candidate-vacancy-card',
  standalone: true,
  imports: [NzCardModule, NzAvatarModule, NzTagModule, NzButtonModule],
  templateUrl: './candidate-vacancy-card.component.html',
  styleUrls: ['./candidate-vacancy-card.component.scss'],
})
export class CandidateVacancyCardComponent {
  readonly vacancy = input.required<CandidateVacancyItem>();
  readonly openApply = output<string>();
  readonly openDetails = output<CandidateVacancyItem>();

  protected get salaryLabel(): string {
    return formatSalaryRub(this.vacancy().salary);
  }

  protected get experienceLabel(): string {
    return toCandidateExperienceLevelLabel(this.vacancy().experienceLevel);
  }

  protected get companyInitial(): string {
    return this.vacancy().companyName.charAt(0).toUpperCase();
  }

  protected onOpenApply(): void {
    this.openApply.emit(this.vacancy().id);
  }

  protected onOpenDetails(): void {
    this.openDetails.emit(this.vacancy());
  }
}
