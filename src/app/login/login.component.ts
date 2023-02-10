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

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    error: string | undefined;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router,
        private projectService: ProjectService,
        private localStorageService: LocalStorageService
    ) {
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

    ngOnInit() { }

    get username() { return this.loginForm.get('username'); }
    get password() { return this.loginForm.get('password'); }

    login() {
        this.authService.login(this.username?.value, this.password?.value)
            .pipe(catchError((e: any) => {
                this.error = "Wrong username or password";
                return throwError(() => e);
            }))
            .subscribe(token => {
                if (this.projectService.getCollectionId()) {
                  this.localStorageService.removeItem(LocalStorageKeys.COLLECTION_ID);
                }
                this.authService.updateAccessToken(token.access_token);
                this.authService.updateRefreshToken(token.refresh_token);
                this.router.navigate([RouteSegments.ROOT]);
            });
    }
}
