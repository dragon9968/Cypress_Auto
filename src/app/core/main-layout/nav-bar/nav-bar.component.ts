import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { retrievedSearchText } from 'src/app/store/map-option/map-option.actions';
import { selectIsMapOpen, selectMapFeature } from 'src/app/store/map/map.selectors';
import { MapState } from 'src/app/store/map/map.state';
import { PermissionLevels } from '../../enums/permission-levels.enum';
import { RouteSegments } from '../../enums/route-segments.enum';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  @ViewChild('searchbar') searchbar!: ElementRef;
  permissionLevels = PermissionLevels;
  routeSegments = RouteSegments;
  searchText = '';
  isMapOpen = false;
  selectIsMapOpen$ = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private domSanitizer: DomSanitizer,
    iconRegistry: MatIconRegistry,
  ) {
    this.selectIsMapOpen$ = this.store.select(selectIsMapOpen).subscribe((isMapOpen: boolean) => {
      this.isMapOpen = isMapOpen;
    });
    iconRegistry.addSvgIcon('plant-tree-icon', this._setPath('/assets/icons/plant-tree-icon.svg'));
  }

  ngOnInit(): void { }

  private _setPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy(): void {
    this.selectIsMapOpen$.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate([RouteSegments.ROOT, RouteSegments.LOGIN]);
  }

  userProfile() {
    this.router.navigate([RouteSegments.ROOT, RouteSegments.USER_PROFILE]);
  }

  close() {
    this.searchText = '';
    this.store.dispatch(retrievedSearchText({ data: this.searchText }));
  }

  search() {
    this.store.dispatch(retrievedSearchText({ data: this.searchText }));
  }

  closeProject() {
    this.router.navigate([RouteSegments.ROOT]);
  }
}
