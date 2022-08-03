import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CMViewDetailsService {

  constructor(private dialog: MatDialog) { }

  getMenu() {
    return {
      id: "view_details",
      content: "View",
      selector: "node[label!='group_box'], edge",
      onClickFunction: (event: any) => { },
      hasTrailingDivider: false,
      disabled: false,
    }
  }
}
