import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { RouteSegments } from 'src/app/core/enums/routes/route-segments.enum';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

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
      this.authService.updateToken(token.access_token);
      this.router.navigate([RouteSegments.ROOT]);
    });
  }
}
