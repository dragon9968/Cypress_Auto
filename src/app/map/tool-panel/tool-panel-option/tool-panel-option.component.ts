import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedMapOption } from 'src/app/store/map-option/map-option.actions';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';

@Component({
  selector: 'app-tool-panel-option',
  templateUrl: './tool-panel-option.component.html',
  styleUrls: ['./tool-panel-option.component.scss']
})
export class ToolPanelOptionComponent implements OnChanges, OnDestroy {
  @Input() cy: any;
  @Input() config: any;
  isEdgeDirectionChecked = false;
  isGroupBoxesChecked = false;
  isMapGridChecked = false;
  isSnapToGridChecked = false;
  isMapOverviewChecked = false;
  gridSpacingSize = '100';
  groupCategoryCtr = new FormControl();
  groupCategories = [
    { id: 'domain', name: 'Domain' },
    { id: 'device', name: 'Device' },
    { id: 'template', name: 'Template' },
    { id: 'role', name: 'Role' },
    { id: 'custom', name: 'Custom' },
  ];
  nav: any;
  selectMapOption$ = new Subscription();
  groupBoxes: any;
  groupCategoryId!: string;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    public helpers: HelpersService
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
        this.groupCategoryId = mapOption.groupCategoryId;
      }
    });
  }

  ngOnChanges(valueChange: any) {
    if (valueChange.cy.currentValue && valueChange.config.currentValue) {
      this.isEdgeDirectionChecked = this.config.default_preferences.edge_direction_checkbox;
      this.isGroupBoxesChecked = this.config.default_preferences.groupbox_checkbox;
      if (!this.groupCategoryId) {
        const groupCategory = this.groupCategories.filter(category => category.id == this.config.default_preferences.group_category)[0];
        this.groupCategoryCtr.setValue(groupCategory ? groupCategory : this.groupCategories[0]);
        this.groupCategoryId = this.groupCategories[0].id;
      }
      this.isSnapToGridChecked = this.config.grid_settings.snap_to_grid;
      this.gridSpacingSize = this.config.grid_settings.spacing ? this.config.grid_settings.spacing.replace('px', '') : this.gridSpacingSize;
      if (this.config.grid_settings.enabled) {
        this.config.grid_on_options.gridSpacing = this.gridSpacingSize;
        this.config.grid_on_options.gridStackOrder = -1;
        this.config.grid_on_options.snapToGridOnRelease = this.config.grid_settings.snap_to_grid;
        this.isMapGridChecked = true;
      } else {
        this.isMapGridChecked = false;
      }
      this.isMapOverviewChecked = this.config.default_preferences.display_map_overview_checkbox;
      this.store.dispatch(retrievedMapOption({
        data: {
          isEdgeDirectionChecked: this.isEdgeDirectionChecked,
          isGroupBoxesChecked: this.isGroupBoxesChecked,
          isMapGridChecked: this.isMapGridChecked,
          isSnapToGridChecked: this.isSnapToGridChecked,
          isMapOverviewChecked: this.isMapOverviewChecked,
          gridSpacingSize: this.gridSpacingSize,
          groupCategoryId: this.groupCategoryId
        }
      }));
      this.toggleEdgeDirection();
      this.toggleGroupBoxes();
      this.toggleMapGrid();
      this.toggleSnapToGrid();
      this.toggleMapOverview();
    }
  }

  ngOnDestroy(): void {
    this.selectMapOption$.unsubscribe();
  }

  private _updateNodeStatus() {
    this.cy.nodes().forEach((ele: any) => {
      const data = ele.data();
      if (data.elem_category != 'group') {
        if (data.elem_category != 'bg_image') {
          data.new = false;
          data.updated = true;
          data.deleted = false;
        }
      }
    });
  }

  toggleEdgeDirection() {
    if (!this.isEdgeDirectionChecked) {
      for (let i = 0; i < this.cy.edges().length; i++) {
        const edge = this.cy.edges()[i];
        const current_dir = edge.data('direction');
        edge.data('prev_direction', current_dir);
        edge.data('direction', 'none');
      }
    } else {
      for (let i = 0; i < this.cy.edges().length; i++) {
        const edge = this.cy.edges()[i];
        let prev_dir = edge.data('prev_direction');
        if (prev_dir == 'none') {
          prev_dir = 'both';
        }
        edge.data('direction', prev_dir);
      }
    }
    this.store.dispatch(retrievedMapOption({
      data: {
        isEdgeDirectionChecked: this.isEdgeDirectionChecked,
        isGroupBoxesChecked: this.isGroupBoxesChecked,
        isMapGridChecked: this.isMapGridChecked,
        isSnapToGridChecked: this.isSnapToGridChecked,
        isMapOverviewChecked: this.isMapOverviewChecked,
        gridSpacingSize: this.gridSpacingSize,
        groupCategoryId: this.groupCategoryCtr?.value?.id
      }
    }));
  }

  toggleGroupBoxes() {
    if (this.isGroupBoxesChecked) {
      this.helpers.addGroupBoxes(this.cy);
    } else {
      this.helpers.removeGroupBoxes(this.cy);
    }
    this.store.dispatch(retrievedMapOption({
      data: {
        isEdgeDirectionChecked: this.isEdgeDirectionChecked,
        isGroupBoxesChecked: this.isGroupBoxesChecked,
        isMapGridChecked: this.isMapGridChecked,
        isSnapToGridChecked: this.isSnapToGridChecked,
        isMapOverviewChecked: this.isMapOverviewChecked,
        gridSpacingSize: this.gridSpacingSize,
        groupCategoryId: this.groupCategoryCtr?.value?.id
      }
    }));
  }

  selectGroupCategory() {
    this.store.dispatch(retrievedMapOption({
      data: {
        isEdgeDirectionChecked: this.isEdgeDirectionChecked,
        isGroupBoxesChecked: this.isGroupBoxesChecked,
        isMapGridChecked: this.isMapGridChecked,
        isSnapToGridChecked: this.isSnapToGridChecked,
        isMapOverviewChecked: this.isMapOverviewChecked,
        gridSpacingSize: this.gridSpacingSize,
        groupCategoryId: this.groupCategoryCtr?.value?.id
      }
    }));
    this.helpers.reloadGroupBoxes(this.cy);
  }

  toggleMapGrid() {
    if (this.isMapGridChecked) {
      if (this.config.grid_settings.snap_to_grid) {
        this.isSnapToGridChecked = true;
      } else {
        this.isSnapToGridChecked = false;
      }
      this.cy.gridGuide(this.config.grid_on_options);
    } else {
      this.cy.gridGuide(this.config.grid_off_options);
    }
    this.store.dispatch(retrievedMapOption({
      data: {
        isEdgeDirectionChecked: this.isEdgeDirectionChecked,
        isGroupBoxesChecked: this.isGroupBoxesChecked,
        isMapGridChecked: this.isMapGridChecked,
        isSnapToGridChecked: this.isSnapToGridChecked,
        isMapOverviewChecked: this.isMapOverviewChecked,
        gridSpacingSize: this.gridSpacingSize,
        groupCategoryId: this.groupCategoryCtr?.value?.id
      }
    }));
  }

  toggleSnapToGrid() {
    this.config.grid_on_options.snapToGridOnRelease = this.isSnapToGridChecked;
    this.config.grid_on_options.gridSpacing = this.gridSpacingSize;
    if (this.isMapGridChecked) {
      this.cy.gridGuide(this.config.grid_on_options);
    }
    if (this.isSnapToGridChecked) {
      this._updateNodeStatus();
    }
    this.store.dispatch(retrievedMapOption({
      data: {
        isEdgeDirectionChecked: this.isEdgeDirectionChecked,
        isGroupBoxesChecked: this.isGroupBoxesChecked,
        isMapGridChecked: this.isMapGridChecked,
        isSnapToGridChecked: this.isSnapToGridChecked,
        isMapOverviewChecked: this.isMapOverviewChecked,
        gridSpacingSize: this.gridSpacingSize,
        groupCategoryId: this.groupCategoryCtr?.value?.id
      }
    }));
  }

  changeGridSpacingSize() {
    this.config.grid_on_options.snapToGridOnRelease = this.isSnapToGridChecked;
    this.config.grid_on_options.gridSpacing = this.gridSpacingSize;
    this.cy.gridGuide(this.config.grid_on_options);
    if (this.isSnapToGridChecked) {
      this._updateNodeStatus();
    }
    this.store.dispatch(retrievedMapOption({
      data: {
        isEdgeDirectionChecked: this.isEdgeDirectionChecked,
        isGroupBoxesChecked: this.isGroupBoxesChecked,
        isMapGridChecked: this.isMapGridChecked,
        isSnapToGridChecked: this.isSnapToGridChecked,
        isMapOverviewChecked: this.isMapOverviewChecked,
        gridSpacingSize: this.gridSpacingSize,
        groupCategoryId: this.groupCategoryCtr?.value?.id
      }
    }));
  }

  toggleMapOverview() {
    if (this.isMapOverviewChecked) {
      this.nav = this.cy.navigator(this.config.nav_defaults);
    } else if (this.nav) {
      this.nav.destroy();
      this.nav = undefined;
    }
    this.store.dispatch(retrievedMapOption({
      data: {
        isEdgeDirectionChecked: this.isEdgeDirectionChecked,
        isGroupBoxesChecked: this.isGroupBoxesChecked,
        isMapGridChecked: this.isMapGridChecked,
        isSnapToGridChecked: this.isSnapToGridChecked,
        isMapOverviewChecked: this.isMapOverviewChecked,
        gridSpacingSize: this.gridSpacingSize,
        groupCategoryId: this.groupCategoryCtr?.value?.id
      }
    }));
  }

  reinitializeMap() {
    const dialogData = {
      title: 'Network Map',
      message: 'Do you want to remove all custom stylings and/or map background?'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '600px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // remove Group Boxes if present
        if (this.isGroupBoxesChecked) {
          this.helpers.removeGroupBoxes(this.cy);
          this.isGroupBoxesChecked = false;
        }
        this.cy.nodes().filter('[label="map_background"]').remove()

        // reset default sizes
        const defaultPreferences = this.config.default_preferences
        this.cy.elements().forEach((ele: any) => {
          if (ele.group() == "edges") {
            ele.data("line-color", defaultPreferences.edge.color);
            ele.style("width", defaultPreferences.edge.size);
          } else {
            // text
            ele.data("text_size", defaultPreferences.text.size);
            ele.data("text_color", this.helpers.hexToRGB(defaultPreferences.text.color));
            var d = ele.data()
            if (!d.new) {
              d.updated = true;
            }
            if (d.elem_category == "port_group") {
              ele.data("color", defaultPreferences.port_group.color);
              ele.data("height", defaultPreferences.port_group.size);
              ele.data("width", defaultPreferences.port_group.size);
            } // icon
            else {
              ele.data("width", defaultPreferences.node.width);
              ele.data("height", defaultPreferences.node.height);
            }
          }
        });

        const options = {
          name: "cose",
          avoidOverlap: true,
          avoidOverlapPadding: 10,
          nodeDimensionsIncludeLabels: true,
          fit: true,
          animate: true,
          zIndex: 999,
        };

        const layout = this.cy.layout(options);
        layout.run();
        this.isGroupBoxesChecked = false;
        if (this.config.display_map_grid) {
          this.isMapGridChecked = true;
          this.cy.gridGuide(this.config.grid_on_options);
        }
        else {
          this.isMapGridChecked = false;
          this.cy.gridGuide(this.config.grid_off_options);
        }
      }
      this.store.dispatch(retrievedMapOption({
        data: {
          isEdgeDirectionChecked: this.isEdgeDirectionChecked,
          isGroupBoxesChecked: this.isGroupBoxesChecked,
          isMapGridChecked: this.isMapGridChecked,
          isSnapToGridChecked: this.isSnapToGridChecked,
          isMapOverviewChecked: this.isMapOverviewChecked,
          gridSpacingSize: this.gridSpacingSize,
          groupCategoryId: this.groupCategoryCtr?.value?.id
        }
      }));
    });
  }
}
