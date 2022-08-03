import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CMDeleteService {

  constructor(private dialog: MatDialog) { }

  getMenu() {
    return {
      id: "delete",
      content: "Delete",
      selector: "node[label!='group_box'], edge",
      onClickFunction: (event: any) => {},
      hasTrailingDivider: true,
      disabled: false,
    }
  }
}
