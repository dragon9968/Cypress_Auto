import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { selectDefaultPreferences } from '../store/map.selectors';
import { Option } from 'src/app/shared/models/option.model';

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
    gridSpacingSize = "100";
    groupCategoryCtr = new FormControl();
    filteredGroupCategory: Observable<Option[]>;
    groupCategories: Option[] = [
        { value: "domain", name: "Domain" },
        { value: "device", name: "Device" },
        { value: "template", name: "Template" },
        { value: "role", name: "Role" },
        { value: "custom", name: "Custom" },
    ];
    selectDefaultPreferences$ = new Subscription();
    nav: any;

    constructor(
        private helper: HelpersService,
        private store: Store
    ) {
        this.filteredGroupCategory = this.helper.filter(this.groupCategoryCtr, this.groupCategories);
        this.selectDefaultPreferences$ = this.store.select(selectDefaultPreferences)
            .subscribe((defaultPreferences: any) => {
                if (defaultPreferences) {
                    this.isEdgeDirectionChecked = defaultPreferences.edge_direction_checkbox;
                    this.isGroupBoxesChecked = defaultPreferences.groupbox_checkbox;
                    const groupCategory = this.groupCategories.filter(category => category.value == defaultPreferences.group_category)[0];
                    this.groupCategoryCtr.setValue(groupCategory);
                    const grid_settings = defaultPreferences.grid_settings;
                    this.isMapGridChecked = grid_settings.enabled;
                    this.isSnapToGridChecked = grid_settings.snap_to_grid;
                    this.gridSpacingSize = grid_settings.spacing ? grid_settings.spacing.replace('px', '') : this.gridSpacingSize;
                    this.isMapOverviewChecked = defaultPreferences.display_map_overview_checkbox;
                }
            });
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.selectDefaultPreferences$.unsubscribe();
    }

    optionDisplay(option: Option) {
        return option && option.name ? option.name : '';
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
                    if (prev_dir == "none") {
                        prev_dir = "both"
                    }
                    edge.data('direction', prev_dir)
                    edge.data('new', false)
                    edge.data('updated', true)
                    edge.data('deleted', false)
                }
            }
    }
    toggleGroupBoxes() {

    }

    toggleMapGrid() {

    }

    toggleSnapToGrid() {

    }

    toggleMapOverview() {
        if (this.isMapOverviewChecked) {
            this.nav = this.cy.navigator(this.config.nav_defaults);
        } else if (this.nav) {
            this.nav.destroy();
        }
    }

    reinitializeMap() {
        console.log("reinitializeMap");
    }

}
