import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CMEditService {

  constructor(private dialog: MatDialog) { }

  getMenu() {
    return {
      id: "edit",
      content: "Edit",
      selector: "node[label!='group_box'], node[label='map_background'], edge",
      onClickFunction: (event: any) => {},
      hasTrailingDivider: false,
      disabled: false,
    }
  }
}
