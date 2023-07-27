import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ErrorMessages } from "../../shared/enums/error-messages.enum";
import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable, Subscription } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { selectGroups } from "../../store/group/group.selectors";
import { HelpersService } from "../../core/services/helpers/helpers.service";
import { selectLogicalNodes, selectNodesByProjectId } from "../../store/node/node.selectors";
import { selectDomains } from "../../store/domain/domain.selectors";
import { selectDevices } from "../../store/device/device.selectors";
import { selectMapPortGroups, selectPortGroups } from "../../store/portgroup/portgroup.selectors";
import { GroupService } from "../../core/services/group/group.service";
import { selectTemplates } from "../../store/template/template.selectors";
import { retrievedGroups, updateGroup } from "../../store/group/group.actions";
import { validateNameExist } from "../../shared/validations/name-exist.validation";
import { CATEGORIES } from 'src/app/shared/contants/categories.constant';
import { ROLES } from 'src/app/shared/contants/roles.constant';
import { retrievedMap } from 'src/app/store/map/map.actions';
import { MapService } from 'src/app/core/services/map/map.service';
import { selectMapImages } from 'src/app/store/map-image/map-image.selectors';
import { selectNotification } from 'src/app/store/app/app.selectors';

@Component({
  selector: 'app-add-update-group-dialog',
  templateUrl: './add-update-group-dialog.component.html',
  styleUrls: ['./add-update-group-dialog.component.scss']
})
export class AddUpdateGroupDialogComponent implements OnInit, OnDestroy {
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
  selectNotification$ = new Subscription();
  templates!: any[];
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
    this.selectNotification$ = this.store.select(selectNotification).subscribe((notification: any) => {
      if (notification?.type == 'success') {
        this.dialogRef.close();
      } 
    });
    this.selectNodes$ = this.store.select(selectLogicalNodes).subscribe(nodes => this.nodes = nodes);
    this.selectPortGroups$ = this.store.select(selectMapPortGroups).subscribe(portGroups => this.portGroups = portGroups);
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe(templates => this.templates = templates);
    this.selectDomains$ = this.store.select(selectDomains).subscribe(domains => this.domains = domains);
    this.selectDevice$ = this.store.select(selectDevices).subscribe(devices => this.devices = devices);
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
    } else {
      this.helpers.setAutoCompleteValue(this.categoryCtr, this.CATEGORIES, this.data.genData.category);
    }
    this.setNodesPgsMapImagesData()
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
          this.categoryChilds = this.templates;
          this.categoryIdCtr?.setValue(this.templates[0]);
          this.categoryName = 'By Template/Model';
          break;
        default:
          this.isHiddenCategoryChild = true;
          this.categoryChilds = [];
      }
      this.filteredCategoryChild = this.helpers.filterOptions(this.categoryIdCtr, this.categoryChilds);
    })
  }

  ngOnDestroy(): void {
    this.selectNotification$.unsubscribe();
    this.selectNodes$.unsubscribe();
    this.selectPortGroups$.unsubscribe();
    this.selectTemplates$.unsubscribe();
    this.selectDomains$.unsubscribe();
    this.selectDevice$.unsubscribe();
    this.selectGroup$.unsubscribe();
    this.selectMapImages$.unsubscribe();
  }

  addGroup() {
    const jsonDataValue = {
      name: this.nameCtr?.value,
      category: this.categoryCtr?.value.id,
      description: this.descriptionCtr?.value,
      project_id: this.data.project_id,
      domain_id: this.categoryCtr?.value.id == 'domain' ? this.categoryIdCtr?.value.id : undefined,
      nodes: this.data.genData.nodes.map((node: any) => node.id),
      port_groups: this.data.genData.port_groups.map((pg: any) => pg.id),
      map_images: this.getMapImageIds(this.data.genData.map_images),
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.groupService.add(jsonData).subscribe(response => {
      this.toastr.success('Added Row');
      this.groupService.getGroupByProjectId(this.data.project_id).subscribe(
        groupData => this.store.dispatch(retrievedGroups({ data: groupData.result }))
      )
      this.mapService.getMapData(this.data.map_category, this.data.project_id).subscribe((data: any) => this.store.dispatch(retrievedMap({ data })));
      this.dialogRef.close();
    })
  }

  updateGroup() {
    const nodes = this.nodes.filter(ele => this.nodesCtr?.value.includes(ele.id))
    const portGroups = this.portGroups.filter(ele => this.portGroupsCtr?.value.includes(ele.id))
    const mapImagesEle = this.mapImages.filter(ele => this.mapImagesCtr?.value.includes(ele.id))
    const nodeIds = nodes.map((node: any) => node.id);
    const pgIds = portGroups.map((pg: any) => pg.id);
    const mapImageIds = this.getMapImageIds(mapImagesEle);
    const jsonDataValue = {
      name: this.nameCtr?.value,
      category: this.categoryCtr?.value.id,
      description: this.descriptionCtr?.value,
      project_id: this.data.project_id,
      nodes: nodeIds,
      port_groups: pgIds,
      map_images: mapImageIds,
      logical_map: {},
      physical_map: {},
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.store.dispatch(updateGroup({
      id: this.data.genData.id,
      data: jsonData,
    }));
  }

  onCancel() {
    this.dialogRef.close({isCanceled: true});
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
    this.setNodesPgsMapImagesData()
    this.helpers.setAutoCompleteValue(this.categoryCtr, this.CATEGORIES, this.data.genData.category);
  }

  setNodesPgsMapImagesData() {
    this.nodesCtr?.setValue(this.data.genData.nodes?.map((ele: any) => ele.id));
    this.portGroupsCtr?.setValue(this.data.genData.port_groups?.map((ele: any) => ele.id));
    this.mapImagesCtr?.setValue(this.data.genData.map_images?.map((ele: any) => ele.id));
  }

  getMapImageIds(mapImagesEle: any) {
    return mapImagesEle?.map((mapImageEle: any) => mapImageEle.data ? mapImageEle.data('map_image_id') : mapImageEle.id)
  }
}
