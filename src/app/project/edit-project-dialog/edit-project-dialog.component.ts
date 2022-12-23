import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subscription, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { asyncValidateValueSetter } from 'src/app/shared/validations/ip-subnet.validation.ag-grid';
import { retrievedProjectName, retrievedProjects } from 'src/app/store/project/project.actions';
import { ButtonRenderersComponent } from '../renderers/button-renderers-component';
import { ProjectService } from '../services/project.service';
import { CustomTooltip } from './custom-tool-tip';

@Component({
  selector: 'app-edit-project-dialog',
  templateUrl: './edit-project-dialog.component.html',
  styleUrls: ['./edit-project-dialog.component.scss']
})
export class EditProjectDialogComponent implements OnInit {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  editProjectForm!: FormGroup;
  errorMessages = ErrorMessages;
  selectUserTasks$ = new Subscription();
  isDisableButton = false;
  rowData!: any[];
  listUser!: any[];
  listShared: any[] = [];
  isLoading = false;
  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    editable: true,
    tooltipComponent: CustomTooltip,
  };
  columnDefs: ColDef[] = [
    { headerName: '',
      editable: false,
      maxWidth: 90,
      cellRenderer: ButtonRenderersComponent,
      cellRendererParams: {
        onClick: this.onDelete.bind(this),
      }
    },
    { field: 'category',
      valueFormatter: (params) => params.value,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['public', 'private', 'management'],
      },
    },
    { field: 'network',
      valueSetter: asyncValidateValueSetter,
      tooltipComponent: CustomTooltip,
      tooltipValueGetter: (params: any) => {
        return params
      },
    },
    { field: 'reserved_ip',
      headerName: 'Reserved IP Addresses',
      autoHeight: true,
      valueGetter: function(params) {
        if (Array.isArray(params.data.reserved_ip)) {
          return params.data.reserved_ip.map((cat: any) => cat.ip).join(',');
        }
        return params.data.reserved_ip;
      },
      valueSetter: asyncValidateValueSetter,
      cellRenderer: function(params: any) {
        return params.value ? `[${params.value}]` : '[]'
      }
    }
  ];
  constructor(
    public helpers: HelpersService,
    private projectService: ProjectService,
    private userService: UserService,
    private store: Store,
    private toastr: ToastrService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EditProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.rowData = this.data.genData.networks
    this.userService.getAll().subscribe(data => {
      this.listUser = data.result;
      if (this.data) {
        this.nameCtr?.setValue(this.data.genData.name);
        this.descriptionCtr?.setValue(this.data.genData.description);
        this.minVlanCtr?.setValue(this.data.genData.vlan_min);
        this.maxVlanCtr?.setValue(this.data.genData.vlan_max);
        this.data.genData.share.forEach((el: any) => {
          this.listShared.push(el)
          if (this.listUser) {
            this.listUser = this.listUser.filter(value => value.username != el.username)
          }
        });
      }
    })
    this.editProjectForm = new FormGroup({
      nameCtr: new FormControl('', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]),
      descriptionCtr: new FormControl(''),
      minVlanCtr: new FormControl('', [Validators.min(1), Validators.max(4093),Validators.required]),
      maxVlanCtr: new FormControl('', [Validators.min(2), Validators.max(4094),Validators.required]),
      sharedCtr: new FormControl(''),
    })

  }

  get nameCtr() { return this.editProjectForm.get('nameCtr');}
  get descriptionCtr() { return this.editProjectForm.get('descriptionCtr');}
  get minVlanCtr() { return this.editProjectForm.get('minVlanCtr');}
  get maxVlanCtr() {  return this.editProjectForm.get('maxVlanCtr');}
  get sharedCtr() { return this.helpers.getAutoCompleteCtr(this.editProjectForm.get('sharedCtr'), this.listUser); }

  ngOnInit(): void {
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

  processForm(data: string) {
    let arr: any[] = [];
    if (data.length == 0) {
      arr = []
    } else if (data.length > 1) {
      const value = data.split(',');
      for (let i = 0; i < value.length; i++) {
        arr.push({
          "ip": value[i].trim(),
        })
      }
    }
    return arr
  }

  updateProject() {
    const sharedUpdate = this.listShared.map(el => el.username)
    let items: any[] = [];
    this.gridApi.forEachNode(node => items.push(node.data));
    Object.values(items).forEach(val => {
      if (!Array.isArray(val.reserved_ip)) {
        val.reserved_ip = this.processForm(val.reserved_ip)
      }
      delete val['validation']
      delete val['validation_isExists']
      if ((val.network === '') || (val.category === '')) {
        this.isDisableButton = true
      }
    })
    if (this.editProjectForm.valid && !this.isDisableButton) {
      const jsonData = {
        name: this.nameCtr?.value,
        description: this.descriptionCtr?.value,
        vlan_min: this.minVlanCtr?.value,
        vlan_max: this.maxVlanCtr?.value,
        networks: items
      }
      this.projectService.put(this.data.genData.id, jsonData).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          return throwError(() => e);
        })
        ).subscribe((_respData: any) => {
          this.projectService.get(this.data.genData.id).subscribe(projectData => {
            this.store.dispatch(retrievedProjectName({ projectName: projectData.result.name}));
            const configData = {
                pk: this.data.genData.id,
                username: sharedUpdate
              }
              this.projectService.associate(configData).subscribe(respData => {
                this.toastr.success(`Update Project successfully`)
                this.projectService.getProjectByStatus('active').subscribe((data: any) => this.store.dispatch(retrievedProjects({ data: data.result })));
              });
            this.dialogRef.close();
          });
        });
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
    }
  }

  selectShared(event: MatAutocompleteSelectedEvent) {
    this.listShared.push(event.option.value)
    Object.values(this.listShared).forEach(val => {
      this.listUser = this.listUser.filter(value => value.username != val.username)
    });
  }

  onDelete(params: any) {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?',
      submitButtonName: 'OK'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData, autoFocus: false });
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
}
