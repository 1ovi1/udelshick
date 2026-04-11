import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Auth } from '../../auth/auth.service';
import { getLayoutMenu } from '../utils/layout-tabs.utils';

@Component({
  selector: 'app-layout',
  imports: [
    NzLayoutModule,
    NzIconModule,
    RouterOutlet,
    NzMenuModule,
    RouterLink,
    NzButtonModule,
    NzAvatarModule,
    NzDropDownModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected isCollapsed = false;
  protected readonly user = this.auth.user;
  protected readonly role = this.auth.role;

  protected readonly tabs = computed(() => getLayoutMenu(this.auth.role()));
  protected readonly userAvatarIcon = computed(() => {
    const role = this.role();

    if (role === 'company') {
      return 'bank';
    }

    if (role === 'admin') {
      return 'safety';
    }

    return 'user';
  });

  protected logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/auth');
  }

  protected toLayoutLink(path: string): string {
    return `/layout/${path}`;
  }
}
