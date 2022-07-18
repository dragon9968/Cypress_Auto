import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Option } from 'src/app/shared/models/option.model';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateNodeDialogComponent } from '../add-update-node-dialog/add-update-node-dialog.component';
import { HelpersService } from 'src/app/shared/services/helper/helpers.service';

@Component({
    selector: 'app-tool-panel-edit',
    templateUrl: './tool-panel-edit.component.html',
    styleUrls: ['./tool-panel-edit.component.scss']
})
export class ToolPanelEditComponent implements OnInit {
    @Input() collectionId: any;
    deviceCtr = new FormControl();
    templateCtr = new FormControl();
    imageCtr = new FormControl();
    isCustomizeNode = true;
    isCustomizePG = true;
    devices: Option[];
    templates: Option[];
    images: Option[];

    constructor(
        private dialog: MatDialog,
        public helper: HelpersService
    ) {
        this.devices = [
            { value: "v1", name: "Name 1" },
            { value: "v2", name: "Name 2" },
            { value: "v3", name: "Name 3" },
        ];
        this.templates = [
            { value: "v1", name: "Name 1" },
            { value: "v2", name: "Name 2" },
            { value: "v3", name: "Name 3" },
        ];
        this.images = [
            { value: "v1", name: "Name 1" },
            { value: "v2", name: "Name 2" },
            { value: "v3", name: "Name 3" },
        ];
    }

    ngOnInit(): void { }

    addNode() {
        if (this.isCustomizeNode) {
            const dialogData = {
                mode: 'add',
                collectionId: this.collectionId,
                device: this.deviceCtr.value,
                template: this.templateCtr.value,
            }
            this.dialog.open(AddUpdateNodeDialogComponent, {
                width: '500px',
                data: dialogData
            });
        } else {
            const dialogData = {
                mode: 'update',
            }
            this.dialog.open(AddUpdateNodeDialogComponent, {
                width: '500px',
                data: dialogData
            });
        }
    }

    addPublicPG() {
        console.log(this.isCustomizePG);
    }

    addPrivatePG() {
        console.log(this.isCustomizePG);
    }

    addImage() {
        console.log(this.imageCtr.value);
    }
}
