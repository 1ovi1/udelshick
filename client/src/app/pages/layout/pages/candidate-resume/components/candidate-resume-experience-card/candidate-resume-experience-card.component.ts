import { Component, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CandidateResumeExperienceItem } from '../../../../models/candidate/candidate-resume-experience-item.interface';

@Component({
  selector: 'app-candidate-resume-experience-card',
  imports: [NzCardModule, NzButtonModule],
  templateUrl: './candidate-resume-experience-card.component.html',
  styleUrl: './candidate-resume-experience-card.component.scss',
})
export class CandidateResumeExperienceCardComponent {
  readonly item = input.required<CandidateResumeExperienceItem>();
  readonly showRemove = input(false);
  readonly remove = output<string>();

  protected removeItem(): void {
    this.remove.emit(this.item().id);
  }
}
