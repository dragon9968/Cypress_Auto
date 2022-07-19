import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouteSegments } from 'src/app/shared/enums/routes/route-segments.enum';
import { AuthService } from '../shared/services/auth/auth.service';

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
        private router: Router) {
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
            .subscribe(token => {
                this.authService.updateAccessToken(token.access_token);
                this.authService.updateRefreshToken(token.refresh_token);
                this.router.navigate([RouteSegments.ROOT]);
            });
    }
}
