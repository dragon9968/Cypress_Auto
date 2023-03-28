import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { Store } from '@ngrx/store';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { retrievedMapEdit } from 'src/app/store/map-edit/map-edit.actions';
import { selectDevices } from 'src/app/store/device/device.selectors';
import { selectTemplates } from 'src/app/store/template/template.selectors';
import { Observable, Subscription } from 'rxjs';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { selectImages } from 'src/app/store/map-image/map-image.selectors';
import { selectMapPref } from 'src/app/store/map-style/map-style.selectors';
import { MatDialog } from "@angular/material/dialog";
import { retrievedProjectsTemplate } from "../../../store/project/project.actions";
import { ProjectService } from "../../../project/services/project.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { RouteSegments } from "../../../core/enums/route-segments.enum";
import { selectProjects, selectProjectTemplate } from "../../../store/project/project.selectors";
import { AuthService } from "../../../core/services/auth/auth.service";

@Component({
  selector: 'app-tool-panel-edit',
  templateUrl: './tool-panel-edit.component.html',
  styleUrls: ['./tool-panel-edit.component.scss']
})
export class ToolPanelEditComponent implements OnInit, OnDestroy {
  @Input() cy: any;
  @Input() config: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() activeMBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  @Input() isDisableAddNode = true;
  @Input() isDisableAddPG = false;
  @Input() isDisableAddImage = true;
  @Input() isDisableAddProjectTemplate = true;
  @Input() isDisableNewFromSelected = true;
  @Input() isDisableLinkProject = true;
  status = 'active';
  category = 'template';
  nodeAddForm!: FormGroup;
  mapImageForm!: FormGroup;
  addTemplateForm: FormGroup;
  linkProjectForm!: FormGroup;
  isCustomizePG = true;
  errorMessages = ErrorMessages;
  selectDevices$ = new Subscription();
  selectTemplates$ = new Subscription();
  selectImages$ = new Subscription();
  selectMapOption$ = new Subscription();
  selectMapPref$ = new Subscription();
  selectProjects$ = new Subscription();
  selectProjectTemplate$ = new Subscription();
  devices!: any[];
  templates!: any[];
  mapImages!: any[];
  projects: any[] = [];
  projectTemplates: any[] = [];
  filteredTemplatesByDevice!: any[];
  isGroupBoxesChecked!: boolean;
  ICON_PATH = ICON_PATH;
  selectedMapPref: any;
  filteredDevices!: Observable<any[]>;
  filteredTemplates!: Observable<any[]>;
  filteredMapImages!: Observable<any[]>;
  filteredProjectTemplates!: Observable<any[]>;
  filteredProjects!: Observable<any[]>;

  constructor(
    private store: Store,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public helpers: HelpersService,
    private authService: AuthService,
    private projectService: ProjectService
  ) {
    this.nodeAddForm = new FormGroup({
      deviceCtr: new FormControl(''),
      templateCtr: new FormControl(''),
      isCustomizeNodeCtr: new FormControl(true)
    });
    this.mapImageForm = new FormGroup({
      mapImageCtr: new FormControl(''),
    })
    this.addTemplateForm = new FormGroup({
      projectTemplateCtr: new FormControl(''),
      isLayoutOnlyCtr: new FormControl(''),
    })
    this.linkProjectForm = new FormGroup({
      linkProjectCtr: new FormControl('')
    })
    this.selectDevices$ = this.store.select(selectDevices).subscribe((devices: any) => {
      if (devices) {
        this.devices = devices;
        this.deviceCtr?.setValidators([autoCompleteValidator(this.devices)]);
        this.filteredDevices = this.helpers.filterOptions(this.deviceCtr, this.devices);
      }
    });
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe((templates: any) => {
      if (templates) {
        this.templates = templates;
        this.templateCtr?.setValidators([autoCompleteValidator(this.templates, 'display_name'), Validators.required]);
        this.filteredTemplatesByDevice = templates
        this.filteredTemplates = this.helpers.filterOptions(this.templateCtr, this.filteredTemplatesByDevice, 'display_name');
      }
    });
    this.selectImages$ = this.store.select(selectImages).subscribe((images: any) => {
      if (images) {
        this.mapImages = images;
        this.mapImageCtr?.setValidators([autoCompleteValidator(this.mapImages), Validators.required]);
        this.filteredMapImages = this.helpers.filterOptions(this.mapImageCtr, this.mapImages);
      }
    });
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
    this.selectMapPref$ = this.store.select(selectMapPref).subscribe((selectedMapPref: any) => {
      this.selectedMapPref = selectedMapPref;
    });
    this.selectProjectTemplate$ = this.store.select(selectProjectTemplate).subscribe(projectTemplates => {
      if (projectTemplates != undefined) {
        this.projectTemplates = projectTemplates;
        this.projectTemplateCtr.setValidators([autoCompleteValidator(this.projectTemplates), Validators.required]);
        this.filteredProjectTemplates = this.helpers.filterOptions(this.projectTemplateCtr, this.projectTemplates)
      }
    });
    this.selectProjects$ = this.store.select(selectProjects).subscribe(projectData => {
      if (projectData) {
        this.projectService.getShareProject(this.status, 'project').subscribe((resp: any) => {
          const shareProject = resp.result;
          let newProjectData: any[];
          const accessToken = this.authService.getAccessToken();
          const accessTokenPayload = this.helpers.decodeToken(accessToken);
          const userId = accessTokenPayload.sub;
          const collectionId = this.projectService.getCollectionId();
          newProjectData = projectData.filter(project => project.created_by_fk === userId);
          if (shareProject) {
            newProjectData = [...newProjectData, ...shareProject];
          }
          newProjectData = newProjectData.filter(project => project.id !== collectionId);
          this.projects = newProjectData;
          this.linkProjectCtr.setValidators([autoCompleteValidator(this.projects), Validators.required]);
          this.filteredProjects = this.helpers.filterOptions(this.linkProjectCtr, this.projects);
        })
      }
    })
  }

  get deviceCtr() { return this.helpers.getAutoCompleteCtr(this.nodeAddForm.get('deviceCtr'), this.devices); }
  get templateCtr() { return this.helpers.getAutoCompleteCtr(this.nodeAddForm.get('templateCtr'), this.templates); }
  get mapImageCtr() { return this.helpers.getAutoCompleteCtr(this.mapImageForm.get('mapImageCtr'), this.mapImages); }
  get isCustomizeNodeCtr() { return this.nodeAddForm.get('isCustomizeNodeCtr'); }
  get projectTemplateCtr() {
    return this.helpers.getAutoCompleteCtr(this.addTemplateForm.get('projectTemplateCtr'), this.projectTemplates);
  }
  get isLayoutOnlyCtr() { return this.addTemplateForm.get('isLayoutOnlyCtr'); }
  get linkProjectCtr() { return this.helpers.getAutoCompleteCtr(this.linkProjectForm.get('linkProjectCtr'), this.projects) };

  ngOnInit(): void {
    this.templateCtr?.disable();
    this.projectService.getProjectByStatusAndCategory('active', 'template').subscribe(
      data => this.store.dispatch(retrievedProjectsTemplate({template: data.result}))
    );
  }

  ngOnDestroy(): void {
    this.selectDevices$.unsubscribe();
    this.selectProjects$.unsubscribe();
    this.selectTemplates$.unsubscribe();
    this.selectMapOption$.unsubscribe();
    this.selectMapPref$.unsubscribe();
    this.selectProjectTemplate$.unsubscribe();
    this.selectImages$.unsubscribe();
  }

  disableTemplate(deviceId: string) {
    this.filteredTemplatesByDevice = this.templates.filter(template => template.device.id == deviceId);
    this.filteredTemplates = this.helpers.filterOptions(this.templateCtr, this.filteredTemplatesByDevice, 'display_name');
    this.templateCtr?.setValue('');
    this.isDisableAddNode = true;
    if (this.filteredTemplatesByDevice.length > 0) {
      this.templateCtr?.enable();
    } else {
      this.templateCtr?.disable();
    }
  }

  changeDevice() {
    this.disableTemplate(this.deviceCtr?.value.id);
  }

  selectDevice($event: MatAutocompleteSelectedEvent) {
    this.disableTemplate($event.option.value.id);
  }

  changeTemplate() {
    this.isDisableAddNode = false;
  }

  selectTemplate($event: MatAutocompleteSelectedEvent) {
    this.isDisableAddNode = false;
  }

  addNode() {
    this.isDisableAddNode = true;
    this.store.dispatch(retrievedMapEdit({
      data: {
        isAddNode: true,
        deviceId: this.deviceCtr?.value.id,
        templateId: this.templateCtr?.value.id,
        isCustomizeNode: this.isCustomizeNodeCtr?.value
      }
    }));
  }

  addPublicPG() {
    this.store.dispatch(retrievedMapEdit({
      data: {
        isAddPublicPG: true,
        isAddPrivatePG: false,
        isCustomizePG: this.isCustomizePG
      }
    }));
  }

  addPrivatePG() {
    this.store.dispatch(retrievedMapEdit({
      data: {
        isAddPublicPG: false,
        isAddPrivatePG: true,
        isCustomizePG: this.isCustomizePG
      }
    }));
  }

  selectMapImage() {
    this.isDisableAddImage = false;
  }

  addImage() {
      const mapImage = this.mapImages.filter(image => image.id === this.mapImageCtr.value.id)[0];
      const background = new Image();
      background.src = ICON_PATH + mapImage.photo;
      let width: any;
      let height: any;
      background.onload = () => {
        width = background.width;
        height = background.height;
        this.isDisableAddImage = true;
        this.store.dispatch(retrievedMapEdit({
          data: {
            isAddMapImage: true,
            imageWidth: width,
            imageHeight: height,
            imageUrl: background.src,
            mapImage: mapImage,
          }
        }));
      };
      // background.addEventListener("load", this.loadMapImage.bind(this, background));
  }

  selectProjectTemplate() {
    this.isDisableAddProjectTemplate = false;
  }

  addTemplate() {
    this.isDisableAddProjectTemplate = true;
    this.store.dispatch(retrievedMapEdit({
      data: {
        isAddTemplateProject: true,
        isLayoutOnly: this.isLayoutOnlyCtr?.value != '',
        projectTemplateId: this.projectTemplateCtr?.value?.id
      }
    }));
  }

  selectProject() {
    this.isDisableLinkProject = false;
  }

  addProjectNode() {
    const linkProjectId = this.linkProjectCtr?.value?.id;
    if (linkProjectId > 0) {
      this.isDisableLinkProject = true;
      this.store.dispatch(retrievedMapEdit({
        data: {
          isAddProjectNode: true,
          linkProjectId: linkProjectId
        }
      }));
    } else {
      this.toastr.warning('Please select a project to link!', 'Warning')
    }
  }

  // loadMapImage(bg: any) {
  //   if (this.config.gb_exists) {
  //     if (!(this.cy.getElementById('default.test'))) {
  //       const gb = {
  //         data: Object.assign({
  //           id: 'default.test',
  //           domain_id: this.config.default_domain_id,
  //           label: "group_box"
  //         }, {
  //           "group_color": this.helpers.fullColorHex(this.selectedMapPref.group_box_color),
  //           "group_opacity": this.selectedMapPref.group_box_opacity,
  //           "border-width": "4",
  //           "text-valign": "top",
  //           "zIndex": 997
  //         }),
  //         position: {
  //           x: 0,
  //           y: 0
  //         },
  //         group: "nodes",
  //         removed: false,
  //         selected: false,
  //       };
  //       this.cy.add(gb);
  //     }
  //   }
  //   this.cy.add({
  //     group: "nodes",
  //     data: {
  //       "label": "map_background",
  //       "elem_category": "bg_image",
  //       "new": true,
  //       "updated": false,
  //       "deleted": false,
  //       "src": bg.src,
  //       "zIndex": 998,
  //       "width": bg.width,
  //       "height": bg.height,
  //       "locked": false
  //     },
  //     position: { x: 0, y: 0 }
  //   })[0];
  // }

  addNewProjectFromSelected() {
    const nodeIds = this.activeNodes.map(node => node.data('node_id'));
    const portGroupIds = this.activePGs.map(pg => pg.data('pg_id'));
    if (nodeIds.length > 0 || portGroupIds.length > 0) {
      const nodeDomainIds = nodeIds.length > 0 ? this.activeNodes.map(node => node.data('domain_id')) : [];
      const portGroupDomainIds = portGroupIds.length > 0 ? this.activePGs.map(pg => pg.data('domain_id')) : [];
      const domainIds = [...new Set([...nodeDomainIds, ...portGroupDomainIds])];
      const jsonData = {
        option: 'clone',
        node_ids: nodeIds,
        port_group_ids: portGroupIds,
        domain_ids: domainIds
      };
      this.router.navigate([RouteSegments.ADD_PROJECT], { state: jsonData });
    } else {
      this.toastr.warning('Please select node(s), port group(s) to clone into new a project', 'Warning');
    }
  }
}
