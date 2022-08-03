import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CMMapService {

  constructor(private dialog: MatDialog) { }

  getSaveChangesMenu() {
    return {
      id: "save_changes",
      content: "Save Changes",
      coreAsWell: true,
      onClickFunction: (event: any) => { },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getUndoMenu() {
    return {
      id: "undo",
      content: "Undo",
      coreAsWell: true,
      onClickFunction: (event: any) => { },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getRedoMenu() {
    return {
      id: "redo",
      content: "Redo",
      coreAsWell: true,
      onClickFunction: (event: any) => { },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getDownloadMenu() {
    return {
      id: "download",
      content: "Download",
      coreAsWell: true,
      onClickFunction: (event: any) => { },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getLockAllMenu() {
    return {
      id: "lock_all",
      content: "Lock All",
      coreAsWell: true,
      onClickFunction: (event: any) => { },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getUnlockAllMenu() {
    return {
      id: "unlock_all",
      content: "Unlock All",
      coreAsWell: true,
      onClickFunction: (event: any) => { },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getSelectAllMenu() {
    return {
      id: "select_all",
      content: "Select All",
      coreAsWell: true,
      onClickFunction: (event: any) => { },
      hasTrailingDivider: false,
      disabled: false,
    }
  }
}
