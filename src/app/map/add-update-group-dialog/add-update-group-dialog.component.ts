import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ErrorMessages } from "../../shared/enums/error-messages.enum";
import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable, Subscription } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { selectGroups } from "../../store/group/group.selectors";
import { HelpersService } from "../../core/services/helpers/helpers.service";
import { selectNodesByCollectionId } from "../../store/node/node.selectors";
import { selectDomains } from "../../store/domain/domain.selectors";
import { selectDevices } from "../../store/device/device.selectors";
import { selectPortGroups } from "../../store/portgroup/portgroup.selectors";
import { GroupService } from "../../core/services/group/group.service";
import { selectTemplates } from "../../store/template/template.selectors";
import { retrievedGroups } from "../../store/group/group.actions";
import { validateNameExist } from "../../shared/validations/name-exist.validation";
import { CATEGORIES } from 'src/app/shared/contants/categories.constant';
import { ROLES } from 'src/app/shared/contants/roles.constant';
import { retrievedMap } from 'src/app/store/map/map.actions';
import { MapService } from 'src/app/core/services/map/map.service';
import { selectMapImages } from 'src/app/store/map-image/map-image.selectors';

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
  selectMapImages$ = new Subscription();
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
  mapImages!: any[];
  categoryName: string = 'custom';
  isHiddenCategoryChild: boolean = true;
  categoryChilds!: any[];
  filteredCategories!: Observable<any[]>;
  filteredCategoryChild!: Observable<any[]>;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateGroupDialogComponent>,
    public helpers: HelpersService,
    private groupService: GroupService,
    private mapService: MapService,
  ) {
    this.selectNodes$ = this.store.select(selectNodesByCollectionId).subscribe(nodeData => this.nodes = nodeData);
    this.selectPortGroups$ = this.store.select(selectPortGroups).subscribe(pgData => this.portGroups = pgData);
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe(templateData => this.template = templateData);
    this.selectDomains$ = this.store.select(selectDomains).subscribe(domainData => this.domains = domainData);
    this.selectDevice$ = this.store.select(selectDevices).subscribe(deviceData => this.devices = deviceData);
    this.selectGroup$ = this.store.select(selectGroups).subscribe(groups => this.groups = groups);
    this.selectMapImages$ = this.store.select(selectMapImages).subscribe(mapImage => this.mapImages = mapImage);
    this.isViewMode = this.data.mode == 'view';
    this.groupAddForm = new FormGroup({
      nameCtr: new FormControl(
        { value: '', disabled: this.isViewMode },
        [Validators.required, validateNameExist(() => this.groups, this.data.mode, this.data.genData.id)]
      ),
      categoryCtr: new FormControl(''),
      categoryIdCtr: new FormControl(''),
      descriptionCtr: new FormControl(''),
      nodesCtr: new FormControl(''),
      portGroupsCtr: new FormControl(''),
      mapImagesCtr: new FormControl(''),
    });
    this.filteredCategories = this.helpers.filterOptions(this.categoryCtr, this.CATEGORIES);
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

  get mapImagesCtr() {
    return this.groupAddForm.get('mapImagesCtr');
  };


  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
    this.descriptionCtr?.setValue(this.data.genData.description);
    if (this.data.mode == 'add') {
      this.categoryCtr?.setValue(this.CATEGORIES[0]);
      this.nodesCtr?.setValue(this.data.genData.nodes?.map((ele: any) => ele.id));
      this.portGroupsCtr?.setValue(this.data.genData.port_groups?.map((ele: any) => ele.id));
      this.mapImagesCtr?.setValue(this.data.genData.map_images?.map((ele: any) => ele.id));
    } else {
      this.nodesCtr?.setValue(this.data.genData.nodes?.map((ele: any) => ele.id));
      this.portGroupsCtr?.setValue(this.data.genData.port_groups?.map((ele: any) => ele.id));
      this.helpers.setAutoCompleteValue(this.categoryCtr, this.CATEGORIES, this.data.genData.category);
      this.mapImagesCtr?.setValue(this.data.genData.map_images?.map((ele: any) => ele.id));
    }
    this.groupAddForm.controls['categoryCtr'].valueChanges.subscribe(value => {
      switch (value.name) {
        case 'domain':
          this.categoryChilds = this.domains;
          this.categoryIdCtr?.setValue(this.domains[0]);
          this.categoryName = 'By Domain';
          break;
        case 'device':
          this.categoryChilds = this.devices;
          this.categoryIdCtr?.setValue(this.devices[0]);
          this.categoryName = 'By Device';
          break;
        case 'role':
          this.categoryChilds = this.ROLES;
          this.categoryIdCtr?.setValue(this.ROLES[0]);
          this.categoryName = 'By Role';
          break;
        case 'template':
          this.categoryChilds = this.template;
          this.categoryIdCtr?.setValue(this.template[0]);
          this.categoryName = 'By Template/Model';
          break;
        default:
          this.isHiddenCategoryChild = true;
          this.categoryChilds = [];
      }
      this.filteredCategoryChild = this.helpers.filterOptions(this.categoryIdCtr, this.categoryChilds);
    })
  }

  addGroup() {
    const jsonDataValue = {
      name: this.nameCtr?.value,
      category: this.categoryCtr?.value.id,
      description: this.descriptionCtr?.value,
      collection_id: this.data.collection_id,
      domain_id: this.categoryCtr?.value.id == 'domain' ? this.categoryIdCtr?.value.id : undefined
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.groupService.add(jsonData).subscribe(response => {
      this.toastr.success('Added Row');
      this.groupService.getGroupByCollectionId(this.data.collection_id).subscribe(
        groupData => this.store.dispatch(retrievedGroups({ data: groupData.result }))
      )
      this.mapService.getMapData(this.data.map_category, this.data.collection_id).subscribe((data: any) => this.store.dispatch(retrievedMap({ data })));
      this.dialogRef.close();
    })
  }

  updateGroup() {
    const jsonDataValue = {
      name: this.nameCtr?.value,
      category: this.categoryCtr?.value.id,
      description: this.descriptionCtr?.value,
      collection_id: this.data.collection_id,
      nodes: this.nodes.filter(ele => this.nodesCtr?.value.includes(ele.id)),
      port_groups: this.portGroups.filter(ele => this.portGroupsCtr?.value.includes(ele.id)),
      map_images: this.mapImages.filter(ele => this.mapImagesCtr?.value.includes(ele.id)),
      logical_map: {},
      physical_map: {},
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.groupService.put(this.data.genData.id, jsonData).subscribe(response => {
      this.toastr.success(`Updated for the ${response.result} successfully`);
      this.groupService.getGroupByCollectionId(this.data.collection_id).subscribe(
        groupData => this.store.dispatch(retrievedGroups({ data: groupData.result }))
      )
      this.mapService.getMapData(this.data.map_category, this.data.collection_id).subscribe((data: any) => this.store.dispatch(retrievedMap({ data })));
      this.dialogRef.close(true);
    })
  }

  onCancel() {
    this.dialogRef.close();
  }

  changeCategory(event: any) {
    this.categoryName = event.source.name;
    this.isHiddenCategoryChild = this.categoryName === 'custom';
    if (this.categoryName === 'domain') {
      this.categoryChilds = this.domains;
    } else if (this.categoryName === 'device') {
      this.categoryChilds = this.devices;
    }
    this.filteredCategoryChild = this.helpers.filterOptions(this.categoryIdCtr, this.categoryChilds);
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
    this.nameCtr?.enable();
    this.nodesCtr?.setValue(this.data.genData.nodes?.map((ele: any) => ele.id));
    this.portGroupsCtr?.setValue(this.data.genData.port_groups?.map((ele: any) => ele.id));
    this.helpers.setAutoCompleteValue(this.categoryCtr, this.CATEGORIES, this.data.genData.category);
  }
}
