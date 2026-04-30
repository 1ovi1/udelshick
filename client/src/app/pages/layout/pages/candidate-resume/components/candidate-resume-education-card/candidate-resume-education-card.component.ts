import { Component, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CandidateResumeEducationItem } from '../../../../models/candidate/candidate-resume-education-item.interface';

@Component({
  selector: 'app-candidate-resume-education-card',
  imports: [NzCardModule, NzButtonModule],
  templateUrl: './candidate-resume-education-card.component.html',
  styleUrl: './candidate-resume-education-card.component.scss',
})
export class CandidateResumeEducationCardComponent {
  readonly item = input.required<CandidateResumeEducationItem>();
  readonly showRemove = input(false);
  readonly remove = output<string>();

  protected removeItem(): void {
    this.remove.emit(this.item().id);
  }
}
