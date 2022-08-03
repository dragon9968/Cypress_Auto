import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CMLockUnlockMenuService {

  constructor(private dialog: MatDialog) { }

  getLockMenu() {
    return {
      id: "lock_node",
      content: "Lock",
      selector: "node",
      onClickFunction: (event: any) => { },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getUnlockMenu() {
    return {
      id: "unlock_node",
      content: "Unlock",
      selector: "node",
      onClickFunction: (event: any) => { },
      hasTrailingDivider: true,
      disabled: false,
    }
  }
}
