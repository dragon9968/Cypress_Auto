import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteSegments } from 'src/app/shared/enums/routes/route-segments.enum';
import { AuthService } from '../auth/services/auth.service';

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
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  get f() {
    return this.loginForm.controls; 
  }

  login() {
    this.authService.login(this.f['username'].value, this.f['password'].value)
    .subscribe(token => {
      this.authService.updateAccessToken(token.access_token);
      this.authService.updateRefreshToken(token.refresh_token);
      this.router.navigate([RouteSegments.ROOT]);
    });
  }
}
