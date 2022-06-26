import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteSegments } from 'src/app/enums/routes/route-segments.enum';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  name: string | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logout() {
    this.authService.removeToken();
    this.router.navigate([RouteSegments.ROOT, RouteSegments.LOGIN]);
  }
}
