import { firstValueFrom } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { User } from '../types/interfaces';
import { UtilsService } from '../services/utils.service';
import { Role } from '../enums/role.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly utilsService = inject(UtilsService);

  private user: User | null | undefined = null;

  async canActivate(route: ActivatedRouteSnapshot) {
    this.user =
      this.authService.user ??
      (await firstValueFrom(this.authService.getProfile()));

    const requiredRoles = route.data['roles'] as Role;

    if (this.user && requiredRoles.includes(this.user.role)) {
      return true;
    }

    await this.utilsService.navigate('/');
    return false;
  }
}
