import { Component, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VersionService } from './version/version.service';
import { NgxPermissionsService, NgxRolesService } from "ngx-permissions";
import { RolesService } from "./core/services/roles/roles.service";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  environment = environment;
  version$: Observable<string> | undefined;

  constructor(
    private toastr: ToastrService,
    private rolesService: RolesService,
    private versionService: VersionService,
    private ngxRolesService: NgxRolesService,
    private permissionsService: NgxPermissionsService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.version$ = this.versionService.version$;
    if (this.authService.isLoggedIn()) {
      const roles = this.rolesService.getUserRoles();
      if (roles) {
        roles.map((role: any) => {
          this.ngxRolesService.addRole(role.name, role.permissions)
        })
      } else {
        this.toastr.error('Get roles for the user failed!', 'Error');
      }
      const permissions = this.rolesService.getUserPermissions();
      if (permissions) {
        this.permissionsService.loadPermissions(permissions);
      } else {
        this.toastr.error('get Permissions for the user failed!', 'Error');
      }
    }
  }
}
