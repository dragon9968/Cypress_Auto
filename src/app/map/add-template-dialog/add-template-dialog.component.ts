import { Store } from "@ngrx/store";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable, Subscription, throwError } from "rxjs";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MapService } from "../../core/services/map/map.service";
import { NodeService } from "../../core/services/node/node.service";
import { DomainService } from "../../core/services/domain/domain.service";
import { HelpersService } from "../../core/services/helpers/helpers.service";
import { ProjectService } from "../../project/services/project.service";
import { InterfaceService } from "../../core/services/interface/interface.service";
import { PortGroupService } from "../../core/services/portgroup/portgroup.service";
import { InfoPanelService } from "../../core/services/info-panel/info-panel.service";
import { ErrorMessages } from "../../shared/enums/error-messages.enum";
import { retrievedNodes } from "../../store/node/node.actions";
import { retrievedDomains } from "../../store/domain/domain.actions";
import { retrievedPortGroups } from "../../store/portgroup/portgroup.actions";
import { selectProjectTemplate } from "../../store/project/project.selectors";
import { autoCompleteValidator } from "../../shared/validations/auto-complete.validation";
import { ValidateProjectDialogComponent } from "../../project/validate-project-dialog/validate-project-dialog.component";

@Component({
  selector: 'app-add-template-dialog',
  templateUrl: './add-template-dialog.component.html',
  styleUrls: ['./add-template-dialog.component.scss']
})
export class AddTemplateDialogComponent implements OnInit, OnDestroy {
  addTemplateForm: FormGroup;
  errorMessages = ErrorMessages;
  status = 'active';
  category = 'template';
  projectTemplates: any[] = [];
  selectProjectTemplate$ = new Subscription();
  filteredProjectTemplates!: Observable<any[]>;

  constructor(
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddTemplateDialogComponent>,
    private mapService: MapService,
    private nodeService: NodeService,
    public helpersService: HelpersService,
    private domainService: DomainService,
    private projectService: ProjectService,
    private interfaceService: InterfaceService,
    private portGroupService: PortGroupService,
    private infoPanelService: InfoPanelService
  ) {
    this.addTemplateForm = new FormGroup({
      projectTemplateCtr: new FormControl(''),
      isLayoutOnlyCtr: new FormControl(''),
    })
    this.selectProjectTemplate$ = this.store.select(selectProjectTemplate).subscribe(projectTemplates => {
      this.projectTemplates = projectTemplates;
      this.projectTemplateCtr.setValidators([Validators.required, autoCompleteValidator(this.projectTemplates)]);
      this.filteredProjectTemplates = this.helpersService.filterOptions(this.projectTemplateCtr, this.projectTemplates)
    });
  }

  get projectTemplateCtr() {
    return this.helpersService.getAutoCompleteCtr(this.addTemplateForm.get('projectTemplateCtr'), this.projectTemplates);
  }

  get isLayoutOnlyCtr() { return this.addTemplateForm.get('isLayoutOnlyCtr'); }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.selectProjectTemplate$.unsubscribe();
  }

  addTemplateIntoCurrentProject() {
    const collectionId = this.projectService.getCollectionId();
    const jsonData = {
      collection_id: collectionId,
      template_id: this.projectTemplateCtr?.value?.id,
      layout_only: this.isLayoutOnlyCtr?.value != '',
      category: 'logical'
    }
    this.mapService.addTemplateIntoMap(jsonData).pipe(
      catchError(error => {
        this.toastr.error('Add items from template into project failed!', 'Error');
        return throwError(() => error);
      })
    ).subscribe(response => {
      const templateItems = response.result.map_items;
      this.domainService.getDomainByCollectionId(collectionId).subscribe(domainRes => {
        this.store.dispatch(retrievedDomains({ data: domainRes.result }));
        this.infoPanelService.initInterfaceManagementStorage(collectionId);
        this.infoPanelService.initPortGroupManagementStorage(collectionId);

        this.nodeService.getNodesByCollectionId(collectionId).subscribe(nodeRes => {
          this.store.dispatch(retrievedNodes({ data: nodeRes.result }));

          this.portGroupService.getByCollectionId(collectionId).subscribe(pgRes => {
            this.store.dispatch(retrievedPortGroups({ data: pgRes.result }));
            const nodesNotManagement = templateItems.nodes.filter((node: any) => node.data.category !== 'management');
            const isNodesHasPosition = nodesNotManagement.every((node: any) =>
              (node.position && node.data.category != 'management') && node.position?.x !== 0 && node.position?.y !== 0
            )
            if (this.isLayoutOnlyCtr?.value && isNodesHasPosition) {
              this.helpersService.addCYNodeAndEdge(this.data.cy, templateItems.nodes, templateItems.interfaces);
            } else {
              this.data.cy.elements().lock();
              this.helpersService.addCYNodeAndEdge(this.data.cy, templateItems.nodes, templateItems.interfaces);
              this.data.cy.layout({
                name: "cose",
                avoidOverlap: true,
                nodeDimensionsIncludeLabels: true,
                spacingFactor: 5,
                fit: true,
                animate: false,
                padding: 150
              }).run();
              this.data.cy.elements().unlock();
            }
            this.helpersService.reloadGroupBoxes(this.data.cy);
            this.dialogRef.close();
            this.toastr.success('Added items from template into project successfully', 'Success');
            this.validateProject(collectionId);
          })
        })
      })
    })
  }


  validateProject(collectionId: any) {
    const jsonData = {
      pk: collectionId
    }
    this.projectService.validateProject(jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        this.dialog.open(ValidateProjectDialogComponent, {
          autoFocus: false,
          width: 'auto',
          data: e.error.result
        });
        return throwError(() => e);
      })
    ).subscribe(response => {
      this.toastr.success(response.message);
    });
  }
}
