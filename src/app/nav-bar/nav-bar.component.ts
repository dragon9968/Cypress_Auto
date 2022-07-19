import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionLevels } from '../shared/enums/permission-levels.enum';
import { RouteSegments } from '../shared/enums/routes/route-segments.enum';
import { AuthService } from '../shared/services/auth/auth.service';

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
