import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
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
  isPGNameLabelChecked = false;
  isPGSubnetLabelChecked = false;
  isPGVLANLabelChecked = false;
  isEdgeNameLabelChecked = false;
  isEdgeIPLabelChecked = false;
  isEdgeVLANModeLabelChecked = false;
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
  groupCategoryId = this.groupCategories[0].id;
  filteredGroupCategories!: Observable<any[]>;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    public helpers: HelpersService
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption && mapOption.groupCategoryId) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
        this.groupCategoryId = mapOption.groupCategoryId;
        this.groupCategoryCtr.setValue(this.groupCategories.filter(g => g.id == this.groupCategoryId)[0]);
      }
    });
    this.filteredGroupCategories = this.helpers.filterOptions(this.groupCategoryCtr, this.groupCategories);
  }

  ngOnChanges(valueChange: any) {
    if (valueChange.cy?.currentValue && valueChange.config.currentValue) {
      this.isEdgeDirectionChecked = this.config.default_preferences.edge_direction_checkbox != undefined
        ? this.config.default_preferences.edge_direction_checkbox : this.isEdgeDirectionChecked;
      this.isGroupBoxesChecked = this.config.default_preferences.groupbox_checkbox
        ? this.config.default_preferences.groupbox_checkbox : false;
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
      this.isPGNameLabelChecked = this.config.default_preferences.pg_name_label_checkbox != undefined
        ? this.config.default_preferences.pg_name_label_checkbox: false;
      this.isPGSubnetLabelChecked = this.config.default_preferences.pg_subnet_label_checkbox != undefined
        ? this.config.default_preferences.pg_subnet_label_checkbox : false;
      this.isPGVLANLabelChecked = this.config.default_preferences.pg_vlan_label_checkbox != undefined
        ? this.config.default_preferences.pg_vlan_label_checkbox : false;

      this.isEdgeNameLabelChecked = this.config.default_preferences.edge_name_label_checkbox != undefined
        ? this.config.default_preferences.edge_name_label_checkbox : false;
      this.isEdgeIPLabelChecked = this.config.default_preferences.edge_ip_label_checkbox != undefined
        ? this.config.default_preferences.edge_ip_label_checkbox : false;
      this.isEdgeVLANModeLabelChecked = this.config.default_preferences.edge_vlan_mode_label_checkbox != undefined
        ? this.config.default_preferences.edge_vlan_mode_label_checkbox : false;

      this.store.dispatch(retrievedMapOption({
        data: {
          isEdgeDirectionChecked: this.isEdgeDirectionChecked,
          isGroupBoxesChecked: this.isGroupBoxesChecked,
          isMapGridChecked: this.isMapGridChecked,
          isSnapToGridChecked: this.isSnapToGridChecked,
          isMapOverviewChecked: this.isMapOverviewChecked,
          gridSpacingSize: this.gridSpacingSize,
          groupCategoryId: this.groupCategoryId,
          isPGNameLabelChecked: this.isPGNameLabelChecked,
          isPGSubnetLabelChecked: this.isPGSubnetLabelChecked,
          isPGVLANLabelChecked: this.isPGVLANLabelChecked,
          isEdgeNameLabelChecked: this.isEdgeNameLabelChecked,
          isEdgeIPLabelChecked: this.isEdgeIPLabelChecked,
          isEdgeVLANModeLabelChecked: this.isEdgeVLANModeLabelChecked,
        }
      }));
      this.toggleEdgeDirection();
      this.toggleGroupBoxes();
      this.toggleMapGrid();
      this.toggleSnapToGrid();
      this.toggleMapOverview();
      this.togglePGLabel();
      this.toggleEdgeLabel();
    }
  }

  ngOnDestroy(): void {
    this.selectMapOption$.unsubscribe();
    if (this.nav) {
      this.nav.destroy();
      this.nav = undefined;
    }
  }

  toggleEdgeDirection() {
    this.helpers.changeEdgeDirectionOnMap(this.cy, this.isEdgeDirectionChecked)
    this._dispatchMapOptionBasedOnCurrentValue();
  }

  toggleGroupBoxes() {
    if (this.isGroupBoxesChecked) {
      this.helpers.addGroupBoxes();
    } else {
      this.helpers.removeGroupBoxes();
    }
    this._dispatchMapOptionBasedOnCurrentValue();
  }

  selectGroupCategory() {
    this._dispatchMapOptionBasedOnCurrentValue();
    this.helpers.reloadGroupBoxes();
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
    this._dispatchMapOptionBasedOnCurrentValue();
  }

  toggleSnapToGrid() {
    this.config.grid_on_options.snapToGridOnRelease = this.isSnapToGridChecked;
    this.config.grid_on_options.gridSpacing = this.gridSpacingSize;
    if (this.isMapGridChecked) {
      this.cy.gridGuide(this.config.grid_on_options);
    }
    this._dispatchMapOptionBasedOnCurrentValue();
  }

  changeGridSpacingSize() {
    this.config.grid_on_options.snapToGridOnRelease = this.isSnapToGridChecked;
    this.config.grid_on_options.gridSpacing = this.gridSpacingSize;
    this.cy.gridGuide(this.config.grid_on_options);
    this._dispatchMapOptionBasedOnCurrentValue();
  }

  toggleMapOverview() {
    if (this.isMapOverviewChecked) {
      if (this.nav) {
        this.nav.destroy();
        this.nav = undefined;
      }
      this.nav = this.cy.navigator(this.config.nav_defaults);
    } else if (this.nav) {
      this.nav.destroy();
      this.nav = undefined;
    }
    this._dispatchMapOptionBasedOnCurrentValue();
  }

  togglePGLabel() {
    this.helpers.changePGLabel(this.isPGNameLabelChecked, this.isPGSubnetLabelChecked, this.isPGVLANLabelChecked);
    this._dispatchMapOptionBasedOnCurrentValue();
  }

  toggleEdgeLabel() {
    this.helpers.changeEdgeLabel(this.isEdgeNameLabelChecked, this.isEdgeIPLabelChecked, this.isEdgeVLANModeLabelChecked);
    this._dispatchMapOptionBasedOnCurrentValue();
  }

  reinitializeMap() {
    const dialogData = {
      title: 'Network Map',
      message: 'Do you want to remove all custom styling and/or map background?'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '600px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // remove Group Boxes if present
        if (this.isGroupBoxesChecked) {
          this.helpers.removeGroupBoxes();
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
            const d = ele.data()
            d.updated = true;
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
      this._dispatchMapOptionBasedOnCurrentValue();
    });
  }

  private _dispatchMapOptionBasedOnCurrentValue() {
    this.store.dispatch(retrievedMapOption({
      data: {
        isEdgeDirectionChecked: this.isEdgeDirectionChecked,
        isGroupBoxesChecked: this.isGroupBoxesChecked,
        isMapGridChecked: this.isMapGridChecked,
        isSnapToGridChecked: this.isSnapToGridChecked,
        isMapOverviewChecked: this.isMapOverviewChecked,
        gridSpacingSize: this.gridSpacingSize,
        groupCategoryId: this.isGroupBoxesChecked ? this.groupCategoryCtr?.value?.id : this.groupCategoryId,
        isPGNameLabelChecked: this.isPGNameLabelChecked,
        isPGSubnetLabelChecked: this.isPGSubnetLabelChecked,
        isPGVLANLabelChecked: this.isPGVLANLabelChecked,
        isEdgeNameLabelChecked: this.isEdgeNameLabelChecked,
        isEdgeIPLabelChecked: this.isEdgeIPLabelChecked,
        isEdgeVLANModeLabelChecked: this.isEdgeVLANModeLabelChecked
      }
    }));
  }
}
