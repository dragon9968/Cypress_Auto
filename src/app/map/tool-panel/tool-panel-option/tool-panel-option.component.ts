import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { retrievedMapOption } from 'src/app/store/map-option/map-option.actions';
import { selectDefaultPreferences, selectGroupBoxes } from 'src/app/store/map/map.selectors';

@Component({
  selector: 'app-tool-panel-option',
  templateUrl: './tool-panel-option.component.html',
  styleUrls: ['./tool-panel-option.component.scss']
})
export class ToolPanelOptionComponent implements OnInit {
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
  selectDefaultPreferences$ = new Subscription();
  nav: any;
  selectGroupBoxes$ = new Subscription();
  groupBoxes: any;
  last_width = 0;
  last_height = 0;
  zoom_limit = false;

  constructor(
    private store: Store,
    public helpers: HelpersService
  ) {
    this.selectDefaultPreferences$ = this.store.select(selectDefaultPreferences)
      .subscribe((defaultPreferences: any) => {
        if (defaultPreferences) {
          this.isEdgeDirectionChecked = defaultPreferences.edge_direction_checkbox;
          this.isGroupBoxesChecked = defaultPreferences.groupbox_checkbox;
          const groupCategory = this.groupCategories.filter(category => category.id == defaultPreferences.group_category)[0];
          this.groupCategoryCtr.setValue(groupCategory);
          const gridSettings = defaultPreferences.grid_settings;
          this.isMapGridChecked = gridSettings.enabled;
          this.isSnapToGridChecked = gridSettings.snap_to_grid;
          this.gridSpacingSize = gridSettings.spacing ? gridSettings.spacing.replace('px', '') : this.gridSpacingSize;
          this.isMapOverviewChecked = defaultPreferences.display_map_overview_checkbox;
          this.store.dispatch(retrievedMapOption({ data: { isGroupBoxesChecked: this.isGroupBoxesChecked, groupCategoryId: groupCategory.id }}));
        }
      });
    this.selectGroupBoxes$ = this.store.select(selectGroupBoxes).subscribe((groupBoxes: any) => this.groupBoxes = groupBoxes);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.selectDefaultPreferences$.unsubscribe();
  }

  ngOnChanges(valueChange: any) {
    if (valueChange.cy.currentValue) {
      this.toggleEdgeDirection();
      this.toggleGroupBoxes();
      this.toggleMapGrid();
      this.toggleSnapToGrid();
      this.toggleMapOverview();
    }
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
        const current_dir = edge.data('direction')
        edge.data('prev_direction', current_dir)
        edge.data('direction', 'none')
        edge.data('new', false)
        edge.data('updated', true)
        edge.data('deleted', false)
      }
    } else {
      for (let i = 0; i < this.cy.edges().length; i++) {
        const edge = this.cy.edges()[i];
        let prev_dir = edge.data('prev_direction')
        if (prev_dir == 'none') {
          prev_dir = 'both'
        }
        edge.data('direction', prev_dir)
        edge.data('new', false)
        edge.data('updated', true)
        edge.data('deleted', false)
      }
    }
  }
  toggleGroupBoxes() {
    if (this.isGroupBoxesChecked) {
      this.helpers.addGroupBoxes(this.cy, this.groupBoxes, this.groupCategoryCtr.value.id);
    } else {
      this.helpers.removeGroupBoxes(this.cy);
    }
  }

  selectGroupCategory() {
    this.helpers.reloadGroupBoxes(this.cy, this.groupBoxes, this.groupCategoryCtr.value.id, this.isGroupBoxesChecked);
    this.store.dispatch(retrievedMapOption({ data: { isGroupBoxesChecked: this.isGroupBoxesChecked, groupCategoryId: this.groupCategoryCtr.value.id }}));
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
  }

  toggleSnapToGrid() {
    this.config.grid_on_options.snapToGridOnRelease = this.isSnapToGridChecked;
    this.config.grid_on_options.gridSpacing = this.gridSpacingSize;
    this.cy.gridGuide(this.config.grid_on_options);
    if (this.isSnapToGridChecked) {
      this._updateNodeStatus();
    }
  }

  changeGridSpacingSize() {
    this.config.grid_on_options.snapToGridOnRelease = this.isSnapToGridChecked;
    this.config.grid_on_options.gridSpacing = this.gridSpacingSize;
    this.cy.gridGuide(this.config.grid_on_options);
    if (this.isSnapToGridChecked) {
      this._updateNodeStatus();
    }
  }

  toggleMapOverview() {
    if (this.isMapOverviewChecked) {
      this.nav = this.cy.navigator(this.config.nav_defaults);
    } else if (this.nav) {
      this.nav.destroy();
    }
  }

  reinitializeMap() {
    console.log('reinitializeMap');
  }

}
