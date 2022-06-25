import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { RouteSegments } from 'src/app/enums/routes/route-segments.enum';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.authService.login().subscribe(token => {
      this.authService.updateToken(token.access_token);
      this.router.navigate([RouteSegments.ROOT]);
    });
  }
}
