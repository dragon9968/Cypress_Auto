import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PermissionLevels } from '../shared/enums/permission-levels.enum';
import { RouteSegments } from '../shared/enums/routes/route-segments.enum';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  permissionLevels = PermissionLevels;
  routeSegments = RouteSegments;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
    this.router.navigate([RouteSegments.ROOT, RouteSegments.LOGIN]);
  }
}
