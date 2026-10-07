import { Component, input, output } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CompanyCandidateItem } from '../../../../models/company/company-candidate-item.interface';

@Component({
  selector: 'app-candidate-card',
  imports: [NzAvatarModule, NzButtonModule],
  templateUrl: './candidate-card.component.html',
  styleUrl: './candidate-card.component.scss',
})
export class CandidateCardComponent {
  readonly item = input.required<CompanyCandidateItem>();
  readonly invite = output<string>();
  readonly openResume = output<string>();

  protected get initials(): string {
    const item = this.item();
    const first = item.firstName.charAt(0);
    const last = item.lastName.charAt(0);

    return `${first}${last}`;
  }

  protected get fullName(): string {
    const item = this.item();

    return `${item.firstName} ${item.lastName}`;
  }

  protected onInvite(): void {
    this.invite.emit(this.item().candidateProfileId);
  }

  protected onOpenResume(): void {
    this.openResume.emit(this.item().candidateProfileId);
  }
}
