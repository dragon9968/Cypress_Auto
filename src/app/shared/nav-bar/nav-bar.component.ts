import { Component, OnInit } from '@angular/core';
import { PermissionLevels } from 'src/app/core/enums/permission-levels.enum';
import { RouteSegments } from 'src/app/core/enums/routes/route-segments.enum';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  permissionLevels = PermissionLevels;
  routeSegments = RouteSegments;

  constructor() {}

  ngOnInit(): void {}
}
