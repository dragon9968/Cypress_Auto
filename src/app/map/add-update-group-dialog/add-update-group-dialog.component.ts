import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ErrorMessages } from "../../shared/enums/error-messages.enum";
import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { selectGroups } from "../../store/group/group.selectors";
import { HelpersService } from "../../core/services/helpers/helpers.service";
import { selectNodesByCollectionId } from "../../store/node/node.selectors";
import { selectDomains } from "../../store/domain/domain.selectors";
import { selectDevices } from "../../store/device/device.selectors";
import { selectPortGroups } from "../../store/portgroup/portgroup.selectors";
import { GroupService } from "../../core/services/group/group.service";
import { selectTemplates } from "../../store/template/template.selectors";
import { ROLES } from 'src/app/shared/contants/roles.contant';
import { CATEGORIES } from "../../shared/contants/categories.contant";
import { retrievedGroups } from "../../store/group/group.actions";
import { validateNameExist } from "../../shared/validations/name-exist.validation";

@Component({
  selector: 'app-add-update-group-dialog',
  templateUrl: './add-update-group-dialog.component.html',
  styleUrls: ['./add-update-group-dialog.component.scss']
})
export class AddUpdateGroupDialogComponent implements OnInit {
  groupAddForm: FormGroup;
  errorMessages = ErrorMessages;
  selectGroup$ = new Subscription();
  selectNodes$ = new Subscription();
  selectPortGroups$ = new Subscription();
  selectDomains$ = new Subscription();
  selectDevice$ = new Subscription();
  selectRoles$ = new Subscription();
  selectTemplates$ = new Subscription();
  template!: any[];
  ROLES = ROLES;
  CATEGORIES = CATEGORIES;
  groups!: any[];
  isViewMode = false;
  nodes!: any[];
  portGroups!: any[];
  domains!: any[];
  devices!: any[];
  roles!: any[];

  categoryName: string = 'custom';
  isHiddenCategoryChild: boolean = true;
  dataCategoryChild!: any[];

  constructor(
    private store: Store,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateGroupDialogComponent>,
    public helpers: HelpersService,
    private groupService: GroupService
  ) {
    this.selectNodes$ = this.store.select(selectNodesByCollectionId).subscribe(nodeData => this.nodes = nodeData);
    this.selectPortGroups$ = this.store.select(selectPortGroups).subscribe(pgData => this.portGroups = pgData);
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe(templateData => this.template = templateData);
    this.selectDomains$ = this.store.select(selectDomains).subscribe(domainData => this.domains = domainData);
    this.selectDevice$ = this.store.select(selectDevices).subscribe(deviceData => this.devices = deviceData);
    this.selectGroup$ = this.store.select(selectGroups).subscribe(groups => this.groups = groups);
    this.isViewMode = this.data.mode == 'view';
    this.groupAddForm = new FormGroup({
      nameCtr: new FormControl(
        {value: '', disabled: this.isViewMode},
        [Validators.required, validateNameExist(() => this.groups, this.data.mode, this.data.genData.id)]
      ),
      categoryCtr: new FormControl({value: '', disabled: this.isViewMode}),
      categoryIdCtr: new FormControl(''),
      descriptionCtr: new FormControl(''),
      nodesCtr: new FormControl({value: '', disabled: this.isViewMode}),
      portGroupsCtr: new FormControl({value: '', disabled: this.isViewMode}),
    })
  }

  get nameCtr() {
    return this.groupAddForm.get('nameCtr');
  };

  get categoryCtr() {
    return this.groupAddForm.get('categoryCtr');
  };

  get categoryIdCtr() {
    return this.groupAddForm.get('categoryIdCtr');
  };

  get descriptionCtr() {
    return this.groupAddForm.get('descriptionCtr');
  };

  get nodesCtr() {
    return this.groupAddForm.get('nodesCtr');
  };

  get portGroupsCtr() {
    return this.groupAddForm.get('portGroupsCtr');
  };


  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
    this.descriptionCtr?.setValue(this.data.genData.description);
    if (this.data.mode == 'update') {
      this.nodesCtr?.setValue(this.data.genData.nodes?.map((ele: any) => ele.id));
      this.portGroupsCtr?.setValue(this.data.genData.port_groups?.map((ele: any) => ele.id));
      this.categoryCtr?.setValue(this.helpers.getOptionByName(this.CATEGORIES, this.data.genData.category));
    } else {
      this.categoryCtr?.setValue(this.CATEGORIES[0]);
      this.nodesCtr?.setValue('[' + this.data.genData.nodes?.map((nodeData: any) => nodeData.name).join(', ') + ']');
      this.portGroupsCtr?.setValue('[' + this.data.genData.port_groups?.map((pgData: any) => pgData.name).join(', ') + ']');
    }
    this.groupAddForm.controls['categoryCtr'].valueChanges.subscribe(value => {
      switch (value.name) {
        case 'domain':
          this.dataCategoryChild = this.domains;
          this.categoryIdCtr?.setValue(this.domains[0]);
          this.categoryName = 'By Domain';
          break;
        case 'device':
          this.dataCategoryChild = this.devices;
          this.categoryIdCtr?.setValue(this.devices[0]);
          this.categoryName = 'By Device';
          break;
        case 'role':
          this.dataCategoryChild = this.ROLES;
          this.categoryIdCtr?.setValue(this.ROLES[0]);
          this.categoryName = 'By Role';
          break;
        case 'template':
          this.dataCategoryChild = this.template;
          this.categoryIdCtr?.setValue(this.template[0]);
          this.categoryName = 'By Template/Model';
          break;
        default:
          this.isHiddenCategoryChild = true;
          this.dataCategoryChild = [];
      }
    })
  }

  addGroup() {
    const jsonData = {
      name: this.nameCtr?.value,
      category: this.categoryCtr?.value.name,
      description: this.descriptionCtr?.value,
      collection_id: this.data.genData.collection_id,
      domain_id: +this.categoryIdCtr?.value
    }
    this.groupService.add(jsonData).subscribe(response => {
      this.toastr.success('Added Row');
      this.groupService.getGroupByCollectionId(this.data.genData.collection_id).subscribe(
        groupData => this.store.dispatch(retrievedGroups({data: groupData.result}))
      )
      this.dialogRef.close();
    })
  }

  updateGroup() {
    const jsonData = {
      name: this.nameCtr?.value,
      category: this.categoryCtr?.value.name,
      description: this.descriptionCtr?.value,
      collection_id: this.data.genData.collection_id,
      domain_id: +this.categoryIdCtr?.value,
      nodes: this.nodes.filter(ele => this.nodesCtr?.value.includes(ele.id)),
      port_groups: this.portGroups.filter(ele => this.portGroupsCtr?.value.includes(ele.id)),
      logical_map: {},
      physical_map: {},
    }
    this.groupService.put(this.data.genData.id, jsonData).subscribe(response => {
      this.toastr.success(`Updated for the ${response.result} successfully`);
      this.groupService.getGroupByCollectionId(this.data.genData.collection_id).subscribe(
        groupData => this.store.dispatch(retrievedGroups({data: groupData.result}))
      )
      this.dialogRef.close();
    })
  }

  onCancel() {
    this.dialogRef.close();
  }

  changeCategory(event: any) {
    this.categoryName = event.source.name;
    this.isHiddenCategoryChild = this.categoryName === 'custom';
    if (this.categoryName === 'domain') {
      this.dataCategoryChild = this.domains;
    } else if (this.categoryName === 'device') {
      this.dataCategoryChild = this.devices;
    }
  }

  updateNodeGroup(node: any) {
    if (this.groups.length > 0) {
      this.groups.map(ele => {
        if (ele.category === 'domain') {
          if (ele.domain_id === node.domain_id) {
            const isExistNode = ele.nodes.some((data: any) => data.id === node.id);
            if (!isExistNode) {
              ele.nodes.append(node);
            } else if (isExistNode) {
              ele.nodes.remove(node);
            }
          }
        }
      })
    }
  }
}
