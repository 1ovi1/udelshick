import { authCards } from './../../../components/auth/models/auth-card.const';
import { Component, inject, model } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { AUTH_ROLE_META, AuthRouteRole } from '../models/auth-role.const';

@Component({
  selector: 'app-auth',
  imports: [NzRadioModule, NzIconModule, FormsModule, NzButtonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  private readonly router = inject(Router);

  protected readonly cards = authCards;
  protected readonly AuthMode = AuthMode;
  protected readonly mode = model<AuthMode>(AuthMode.User);

  protected goToLogin(): void {
    const selectedRole = this.resolveSelectedRole();
    void this.router.navigateByUrl(AUTH_ROLE_META[selectedRole].loginPath);
  }

  protected goToRegister(): void {
    const selectedRole = this.resolveSelectedRole();
    const target =
      AUTH_ROLE_META[selectedRole].registerPath ?? AUTH_ROLE_META[selectedRole].loginPath;

    void this.router.navigateByUrl(target);
  }

  private resolveSelectedRole(): AuthRouteRole {
    return this.mode() === AuthMode.Company ? 'company' : 'user';
  }
}

export enum AuthMode {
  User = 0,
  Company = 1,
}
