import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/core/services/auth.service';
import { RouteSegments } from 'src/app/core/enums/routes/route-segments.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginPageComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<{ count: number }>
  ) {}

  login() {
    this.authService.login().subscribe(token => {
      this.authService.updateToken(token.access_token);
      this.router.navigate([RouteSegments.ROOT]);
    });
  }
}
