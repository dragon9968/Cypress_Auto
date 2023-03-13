import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ImageService } from 'src/app/core/services/image/image.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { retrievedIcons } from 'src/app/store/icon/icon.actions';
import { selectIcons } from 'src/app/store/icon/icon.selectors';
import { AddEditIconDialogComponent } from './add-edit-icon-dialog/add-edit-icon-dialog.component';
import { PageEvent } from "@angular/material/paginator";
import { catchError } from "rxjs/operators";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  pageIndex = 0;
  pageSize = 25;
  totalSize = 0;
  cols: any;
  gridByBreakpoint = {
    xl: 5,
    lg: 4,
    md: 3,
    sm: 3,
    xs: 1
  }
  activePageDataChunk: any[] = [];
  constructor(
    private store: Store,
    private toastr: ToastrService,
    private imageService: ImageService,
    private helpers: HelpersService,
    private dialog: MatDialog,
    iconRegistry: MatIconRegistry,
    private breakpointObserver: BreakpointObserver
  ) {
    this.selectIcons$ = this.store.select(selectIcons).subscribe((icons: any) => {
      if (icons) {
        this.listIcons = icons;
        this.totalSize = this.listIcons.length;
        this.activePageDataChunk = this.listIcons.slice(0, this.pageSize);
        this.selectedIcon = [];
      }
    });
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json.svg'));
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.cols = this.gridByBreakpoint.xs;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.cols = this.gridByBreakpoint.sm;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = this.gridByBreakpoint.md;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.cols = this.gridByBreakpoint.lg;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.cols = this.gridByBreakpoint.xl;
        }
      }
    })
    
   }

  ngOnInit(): void {
    this.imageService.getByCategory('icon').subscribe((data: any) => this.store.dispatch(retrievedIcons({data: data.result})));
  }

  ngOnDestroy(): void {
    this.selectIcons$.unsubscribe();
  }

  getId(obj: any, e: any) {
    if (e.checked) {
      this.selectedIcon.push(obj.id);
    } else {
      this.selectedIcon = this.selectedIcon.filter(i => i !== obj.id);
    }
  }

  selectAll(event: any) {
    if (event.checked) {
      this.listIcons.forEach(element => {
        this.selectedIcon.push(element.id);
      })
    } else {
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
    this.dialog.open(AddEditIconDialogComponent, {
      autoFocus: false,
      width: '450px',
      data: dialogData
    });
  }

  updateIcon() {
    if (this.selectedIcon.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.selectedIcon.length === 1) {
      this.imageService.get(this.selectedIcon[0]).subscribe(iconData => {
        const dialogData = {
          mode: 'update',
          genData: iconData.result
        }
        this.dialog.open(AddEditIconDialogComponent, {
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      });
    } else {
      this.toastr.info('Bulk edits do not apply to icon.<br> Please select only one icon',
        'Info', { enableHtml: true });
    }
  }


  deleteIcon() {
    if (this.selectedIcon.length === 0) {
      this.toastr.info('No row selected');
    } else {
        const suffix = this.selectedIcon.length === 1 ? 'this item' : 'these items';
        const dialogData = {
          title: 'User confirmation needed',
          message: `Are you sure you want to delete ${suffix}?`,
          submitButtonName: 'OK'
        }
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            forkJoin(this.selectedIcon.map(id => {
              return this.imageService.delete(id).pipe(
                catchError((response: any) => {
                  if (response.status == 400) {
                    this.toastr.error(response.error.message.split(':')[1], 'Error');
                  } else {
                    this.toastr.error('Delete icon failed', 'Error');
                  }
                  return throwError(() => response.error);
                })
              );
               })).subscribe(() =>{
                this.imageService.getByCategory('icon').subscribe((data: any) => this.store.dispatch(retrievedIcons({data: data.result})));
                this.toastr.success('Deleted icon(s) successfully', 'Success');
                this.selectedIcon = [];
              })
            }
        })
    }
  }

  exportJson() {
    if (this.selectedIcon.length == 0) {
      this.toastr.info('No row selected');
    } else {
      let file = new Blob();
      this.imageService.export(this.selectedIcon).subscribe(response => {
        file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
        this.helpers.downloadBlob('Icon.json', file);
        this.toastr.success(`Exported Icon as ${'json'.toUpperCase()} file successfully`);
      })
    }
  }

  showIcon(icon: any) {
    this.id = icon.id;
    this.imageService.get(this.id).subscribe(iconData => {
      const dialogData = {
        mode: 'view',
        genData: iconData.result
      }
      this.dialog.open(AddEditIconDialogComponent, {
        autoFocus: false,
        width: '600px',
        data: dialogData
      });
    });
  }

  onPageChanged(event: PageEvent) {
    const firstCut = event.pageIndex * event.pageSize;
    const secondCut = firstCut + event.pageSize;
    this.activePageDataChunk = this.listIcons.slice(firstCut, secondCut);
  }
}
