import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouteSegments } from '../core/enums/route-segments.enum';
import { AuthService } from '../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { ProjectService } from "../project/services/project.service";
import { LocalStorageService } from "../core/storage/local-storage/local-storage.service";
import { LocalStorageKeys } from "../core/storage/local-storage/local-storage-keys.enum";
import { RolesService } from "../core/services/roles/roles.service";
import { Store } from "@ngrx/store";
import { NgxPermissionsService, NgxRolesService } from "ngx-permissions";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    error: string | undefined;

    constructor(
        private store: Store,
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router,
        private rolesService: RolesService,
        private projectService: ProjectService,
        private localStorageService: LocalStorageService,
        private permissionsService: NgxPermissionsService,
        private ngxRolesService: NgxRolesService
    ) {
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            option: new FormControl(''),
        });
    }

    ngOnInit() { }

    get username() { return this.loginForm.get('username'); }
    get password() { return this.loginForm.get('password'); }
    get option() { return this.loginForm.get('option'); }

    login() {
        const option = this.option?.value ? "ldap" : "db";
        this.authService.login(this.username?.value, this.password?.value, option)
            .pipe(catchError((e: any) => {
                this.error = "Wrong username or password";
                return throwError(() => e);
            }))
            .subscribe(token => {
                if (this.projectService.getProjectId()) {
                  this.localStorageService.removeItem(LocalStorageKeys.PROJECT_ID);
                }
                if (this.authService.getUserId()) {
                    this.localStorageService.removeItem(LocalStorageKeys.USER_ID);
                }
                this.authService.updateAccessToken(token.access_token);
                this.authService.updateRefreshToken(token.refresh_token);
                this.rolesService.getRolesUser().subscribe(response => {
                  let permissions:any[] = []
                  response.roles.map((role: any) => {
                    this.ngxRolesService.addRole(role.name, role.permissions)
                    permissions.push(...role.permissions)
                  })
                  const permissionsUnique:any[] = [...new Set(permissions)];
                  this.rolesService.updateUserPermissions(JSON.stringify(permissionsUnique));
                })
                this.router.navigate([RouteSegments.ROOT]);
            });
    }
}
