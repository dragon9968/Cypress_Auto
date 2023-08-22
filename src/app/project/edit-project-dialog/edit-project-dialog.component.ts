import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, ValueSetterParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, Subscription, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import {
  loadProjects,
  retrievedRecentProjects,
  updateProject
} from 'src/app/store/project/project.actions';
import { ButtonRenderersComponent } from '../renderers/button-renderers-component';
import { ProjectService } from '../services/project.service';
import { validateNameExist } from 'src/app/shared/validations/name-exist.validation';
import { selectAllProjects, selectRecentProjects } from 'src/app/store/project/project.selectors';
import { MatRadioChange } from '@angular/material/radio';
import { selectUserProfile } from 'src/app/store/user-profile/user-profile.selectors';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { RolesService } from 'src/app/core/services/roles/roles.service';
import { selectIsMapOpen } from "../../store/map/map.selectors";
import { HistoryService } from "../../core/services/history/history.service";

@Component({
  selector: 'app-edit-project-dialog',
  templateUrl: './edit-project-dialog.component.html',
  styleUrls: ['./edit-project-dialog.component.scss']
})
export class EditProjectDialogComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  editProjectForm!: FormGroup;
  errorMessages = ErrorMessages;
  selectAllProjects$ = new Subscription();
  selectRecentProjects$ = new Subscription();
  selectIsMapOpen$ = new Subscription();
  selectUser$ = new Subscription();
  currentUser: any = {};
  recentProjects: any[] = [];
  listProjects!: any[];
  listTemplates!: any[];
  isDisableButton = false;
  rowData!: any[];
  listUser!: any[];
  filteredListUser!: Observable<any[]>;
  usersData!: any[];
  listShared: any[] = [];
  status = 'active';
  isMapOpen = false;
  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    editable: true,
  };
  columnDefs: ColDef[] = [
    {
      headerName: '',
      editable: false,
      maxWidth: 90,
      cellRenderer: ButtonRenderersComponent,
      cellRendererParams: {
        onClick: this.onDelete.bind(this),
      }
    },
    {
      field: 'category',
      valueFormatter: (params) => params.value,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['public', 'private', 'management'],
      },
    },
    {
      field: 'network',
      valueSetter: this.setterValueNetwork.bind(this),
    },
    {
      field: 'reserved_ip',
      headerName: 'Reserved IP Addresses',
      autoHeight: true,
      valueGetter: function (params) {
        if (Array.isArray(params.data.reserved_ip)) {
          return params.data.reserved_ip.map((cat: any) => cat.ip).join(',');
        }
        return params.data.reserved_ip;
      },
      valueSetter: this.setterValueNetwork.bind(this),
      cellRenderer: function (params: any) {
        return params.value ? `[${params.value}]` : '[]'
      }
    }
  ];
  constructor(
    public helpers: HelpersService,
    private authService: AuthService,
    private projectService: ProjectService,
    private userService: UserService,
    private rolesService: RolesService,
    private router: Router,
    private store: Store,
    private toastr: ToastrService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EditProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private historyService: HistoryService
  ) {
    this.rowData = this.data.genData.networks
    const userId = this.authService.getUserId();
    this.userService.getAll().subscribe(data => {
      data.result.forEach((u: any) => u.full_name = u.first_name + ' ' + u.last_name);
      this.listUser = data.result.filter((value: any) => value.id != userId)
      this.filteredListUser = this.helpers.filterOptions(this.sharedCtr, this.listUser, 'full_name');
      this.usersData = data.result;
      if (this.data) {
        this.nameCtr?.setValue(this.data.genData.name);
        this.descriptionCtr?.setValue(this.data.genData.description);
        this.minVlanCtr?.setValue(this.data.genData.vlan_min);
        this.maxVlanCtr?.setValue(this.data.genData.vlan_max);
        this.categoryCtr?.setValue(this.data.genData.category);
        this.data.genData.share.forEach((el: any) => {
          this.listShared.push(el)
          if (this.listUser) {
            this.listUser = this.listUser.filter(value => value.username != el.username)
            this.filteredListUser = this.helpers.filterOptions(this.sharedCtr, this.listUser, 'full_name');
          }
        });
      }
    })
    this.selectAllProjects$ = this.store.select(selectAllProjects).subscribe(projects => {
      this.listProjects = projects;
    });

    this.editProjectForm = new FormGroup({
      nameCtr: new FormControl('', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      validateNameExist(() => this.listProjects, this.data.mode, this.data.genData.id)]),
      descriptionCtr: new FormControl(''),
      minVlanCtr: new FormControl('', [Validators.min(1), Validators.max(4093), Validators.required]),
      maxVlanCtr: new FormControl('', [Validators.min(2), Validators.max(4094), Validators.required]),
      sharedCtr: new FormControl(''),
      categoryCtr: new FormControl(''),
    })
    this.selectRecentProjects$ = this.store.select(selectRecentProjects).subscribe(recentProjects => {
      if (recentProjects) {
        this.recentProjects = recentProjects;
      }
    })
    this.selectUser$ = this.store.select(selectUserProfile).subscribe((user: any) => {
      this.currentUser = {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
    this.selectIsMapOpen$ = this.store.select(selectIsMapOpen).subscribe((isMapOpen: boolean) => {
      this.isMapOpen = isMapOpen;
    });
  }

  ngOnDestroy(): void {
    this.selectAllProjects$.unsubscribe();
    this.selectRecentProjects$.unsubscribe();
    this.selectUser$.unsubscribe();
    this.selectIsMapOpen$.unsubscribe();
  }

  get nameCtr() { return this.editProjectForm.get('nameCtr'); }
  get descriptionCtr() { return this.editProjectForm.get('descriptionCtr'); }
  get minVlanCtr() { return this.editProjectForm.get('minVlanCtr'); }
  get maxVlanCtr() { return this.editProjectForm.get('maxVlanCtr'); }
  get sharedCtr() { return this.helpers.getAutoCompleteCtr(this.editProjectForm.get('sharedCtr'), this.listUser); }
  get categoryCtr() { return this.editProjectForm.get('categoryCtr'); }

  ngOnInit(): void {
    let isCanWriteProject = false;
    let isCanReadSettings = false;
    const permissions = this.rolesService.getUserPermissions();
    if (permissions) {
      for (let p of permissions) {
        if (p === "can_write on Project") {
          isCanWriteProject = true
        }
        if (p === "can_read on Settings") {
          isCanReadSettings = true
        }
      }
    }
    if (!isCanWriteProject || !isCanReadSettings) {
      console.log('You are not authorized to view this page !')
      this.toastr.warning('Not authorized!', 'Warning');
      this.router.navigate([RouteSegments.ROOT]);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  numericOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;
  }

  cancelProject() {
    this.dialogRef.close();
  }

  updateProject() {
    const sharedUpdate = this.listShared.map(el => el.username);
    const configData = {
      pk: this.data.genData.id,
      username: sharedUpdate
    }
    let items: any[] = [];
    this.gridApi.forEachNode(node => items.push(node.data));
    Object.values(items).forEach(val => {
      if (!Array.isArray(val.reserved_ip)) {
        val.reserved_ip = this.helpers.processIpForm(val.reserved_ip)
      }
      this.isDisableButton = ((val.network === '') || (val.category === ''))
    })
    if (this.editProjectForm.valid && !this.isDisableButton) {
      const jsonDataValue = {
        name: this.nameCtr?.value,
        description: this.descriptionCtr?.value,
        vlan_min: this.minVlanCtr?.value,
        vlan_max: this.maxVlanCtr?.value,
        category: this.categoryCtr?.value,
        networks: items
      }
      const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
      this.store.dispatch(updateProject({ id: this.data.genData.id, data: jsonData, configData }));

      // Update Recent Projects Storage if the project in recent projects and project is updated
      const recentProject = this.recentProjects.find(project => project.id === this.data.genData.id);
      if (recentProject && recentProject.name !== jsonData.name || recentProject?.description !== jsonData.description) {
        const newRecentProjects = [...this.recentProjects];
        const index = newRecentProjects.findIndex(project => project.id === this.data.genData.id);
        const newRecentProject = {
          id: this.data.genData.id,
          name: jsonData.name,
          description: jsonData.description
        }
        newRecentProjects.splice(index, 1, newRecentProject);
        this.store.dispatch(retrievedRecentProjects({ recentProjects: newRecentProjects }));
      }
      this.dialogRef.close();
    }
    else {
      this.toastr.warning('Category and network fields are required.')
    }
  }

  remove(option: any): void {
    const index = this.listShared.indexOf(option);
    if (index >= 0) {
      this.listShared.splice(index, 1);
      this.listUser.unshift(option)
      this.filteredListUser = this.helpers.filterOptions(this.sharedCtr, this.listUser, 'full_name');
    }
  }

  selectShared(event: MatAutocompleteSelectedEvent) {
    this.listShared.push(event.option.value)
    Object.values(this.listShared).forEach(val => {
      this.listUser = this.listUser.filter(value => value.username != val.username)
      this.filteredListUser = this.helpers.filterOptions(this.sharedCtr, this.listUser, 'full_name');
    });
  }

  onDelete(params: any) {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?',
      submitButtonName: 'OK'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData, autoFocus: false });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rowData.splice(params.rowData.index, 1);
        this.gridApi.applyTransaction({ remove: [params.rowData] });
        this.toastr.success("Deleted Networks successfully")
      }
    });
    return this.rowData;
  }

  addNetwork() {
    const jsonData = {
      category: '',
      network: '',
      reserved_ip: []
    }
    this.gridApi.applyTransaction({ add: [jsonData] });
  }

  setterValueNetwork(params: ValueSetterParams) {
    return this.helpers.setterValue(params)
  }

  changeCategory($event: MatRadioChange) {
    if ($event.value == 'template') {
      this.listUser = [];
      this.listShared = [];
      this.sharedCtr.disable();
    } else {
      this.sharedCtr.enable();
      this.listUser = this.usersData;
      if (this.data.genData.share.length > 0) {
        this.data.genData.share.forEach((el: any) => {
          this.listShared.push(el);
          this.listUser = this.listUser.filter(value => value.username != el.username)
        });
      }
    }
    this.filteredListUser = this.helpers.filterOptions(this.sharedCtr, this.listUser, 'full_name');
  }
}
