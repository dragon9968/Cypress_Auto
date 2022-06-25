import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PermissionLevels } from 'src/app/enums/permission-levels.enum';
import { RouteSegments } from 'src/app/enums/routes/route-segments.enum';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  permissionLevels = PermissionLevels;
  routeSegments = RouteSegments;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}
}
