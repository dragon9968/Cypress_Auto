import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { IconService } from 'src/app/core/services/icon/icon.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { retrievedIcons } from 'src/app/store/icon/icon.actions';
import { selectIcons } from 'src/app/store/icon/icon.selectors';
import { AddEditIconDialogComponent } from './add-edit-icon-dialog/add-edit-icon-dialog.component';

@Component({
  selector: 'app-icon-gallery',
  templateUrl: './icon-gallery.component.html',
  styleUrls: ['./icon-gallery.component.scss']
})
export class IconGalleryComponent implements OnInit, OnDestroy {
  id: any;
  checked = false;
  selectedIcon: any[] = [];
  selectIcons$ = new Subscription();
  listIcons!: any[];
  ICON_PATH = ICON_PATH;
  constructor(
    private store: Store,
    private toastr: ToastrService,
    private iconService: IconService,
    private helpers: HelpersService,
    private dialog: MatDialog,
    iconRegistry: MatIconRegistry,
  ) {
    this.selectIcons$ = this.store.select(selectIcons).subscribe((icons: any) => {
      this.listIcons = icons;
    });
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json.svg'));
   }

  ngOnInit(): void {
    this.iconService.getAll().subscribe((data: any) => this.store.dispatch(retrievedIcons({data: data.result})));
  }

  ngOnDestroy(): void {
    this.selectIcons$.unsubscribe();
  }

  getId(obj: any, e: any) {
    if (e.checked) {
      this.selectedIcon.push(obj.id);
    }else {
      this.selectedIcon = this.selectedIcon.filter(i => i !== obj.id);
    }
  }

  selectAll(event: any) {
    if (event.checked) {
      this.listIcons.forEach(element => {
        this.selectedIcon.push(element.id);
      })

    }else {
      this.selectedIcon.splice(0, this.selectedIcon.length);
    }
  }

  addIcon() {
    const dialogData = {
      mode: 'add',
      genData: {
        name:  '',
        photo: '',
        ext: ''
      }
    }
    const dialogRef = this.dialog.open(AddEditIconDialogComponent, {
      autoFocus: false,
      width: '450px',
      data: dialogData
    });
  }

  updateIcon(icon: any) {
    this.id = icon.id;
    this.iconService.get(this.id).subscribe(iconData => {
      const dialogData = {
        mode: 'update',
        genData: iconData.result
      }
      const dialogRef = this.dialog.open(AddEditIconDialogComponent, {
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    });
  }


  deleteIcon(icon: any) {
    this.id = icon.id;
    if (this.id) {
      const dialogData = {
        title: 'User confirmation needed',
        message: 'You sure you want to delete this item?'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.iconService.delete(this.id).subscribe({
            next: (rest) => {
              this.iconService.getAll().subscribe((data: any) => this.store.dispatch(retrievedIcons({data: data.result})));
              this.toastr.success(`Delete successfully`);
            },
            error: (error) => {
              this.toastr.error(`Error while delete Icon`);
            }
          })
        }
      })
    }
  }

  exportJson() {
    if (this.selectedIcon.length == 0) {
      this.toastr.info('No row selected');
    }else {
      let file = new Blob();
      this.iconService.export(this.selectedIcon).subscribe(response => {
        file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
        this.helpers.downloadBlob('Icon.json', file);
        this.iconService.getAll().subscribe((data: any) => this.store.dispatch(retrievedIcons({data: data.result})));
        this.toastr.success(`Exported Icon as ${'json'.toUpperCase()} file successfully`);
      })
    }
  }

  showIcon(icon: any) {
    this.id = icon.id;
    this.iconService.get(this.id).subscribe(iconData => {
      const dialogData = {
        mode: 'view',
        genData: iconData.result
      }
      const dialogRef = this.dialog.open(AddEditIconDialogComponent, {
        autoFocus: false,
        width: '600px',
        data: dialogData
      });
    });
  }
}
