import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ApiPaths } from 'src/app/enums/api/api-paths.enums';
import { RouteSegments } from 'src/app/enums/routes/route-segments.enum';

@Component({
  selector: 'app-main-layout-page',
  templateUrl: './main-layout-page.component.html',
  styleUrls: ['./main-layout-page.component.scss'],
})
export class MainLayoutPageComponent implements OnInit {
  name: string | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logout() {
    this.authService.logout().subscribe(() => {
      this.authService.removeToken();
      this.router.navigate([RouteSegments.ROOT, RouteSegments.LOGIN]);
    });
  }
}
