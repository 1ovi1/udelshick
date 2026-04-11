import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, NzButtonModule],
  templateUrl: './not-found.page.html',
  styleUrl: './not-found.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
