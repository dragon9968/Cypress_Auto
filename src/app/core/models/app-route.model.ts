import { Route } from '@angular/router';
import { PermissionLevels } from 'src/app/core/enums/permission-levels.enum';

interface AppRouteData {
  permissionLevel: PermissionLevels;
}

export interface AppRoute extends Route {
  data?: AppRouteData;
  children?: AppRoute[];
}
