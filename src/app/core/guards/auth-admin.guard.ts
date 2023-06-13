import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { ToastrService } from "ngx-toastr";
import { RouteSegments } from "../enums/route-segments.enum";

@Injectable({
  providedIn: 'root',
})
export class AuthGuardAdmin implements CanActivateChild {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
  ) { }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (this.authService.isAdminRole()) {
      return of(true);
    }
    if (this.authService.isLoggedIn()) {
      this.toastr.error('Your role is not an admin role!', 'Error');
      this.router.navigate([RouteSegments.ROOT, RouteSegments.ROOT]);
      return of(false);
    }
    this.toastr.warning('Your role is not an admin role!', 'Warning');
    this.router.navigate([RouteSegments.ROOT, RouteSegments.LOGIN]);
    return of(false);
  }
}
