import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Option } from 'src/app/shared/models/option.model';
import { HelpersService } from 'src/app/shared/services/helper/helpers.service';
import { NodeService } from 'src/app/shared/services/node/node.service';

@Component({
    selector: 'app-add-update-node-dialog',
    templateUrl: './add-update-node-dialog.component.html',
    styleUrls: ['./add-update-node-dialog.component.scss']
})
export class AddUpdateNodeDialogComponent implements OnInit {
    nodeAddForm: FormGroup;
    icons: Option[];
    devices: Option[];
    templates: Option[];
    hardwares: Option[];
    roles: Option[];
    domains: Option[];
    configs: Option[];
    loginProfiles: Option[];

    constructor(
        public dialogRef: MatDialogRef<AddUpdateNodeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public helper: HelpersService,
        private nodeService: NodeService,
    ) {
        this.nodeAddForm = new FormGroup({
            name: new FormControl('', Validators.required),
            notes: new FormControl(''),
            icon: new FormControl(''),
            category: new FormControl(''),
            device: new FormControl('', Validators.required),
            template: new FormControl('', Validators.required),
            hardware: new FormControl('', Validators.required),
            folder: new FormControl('', Validators.required),
            role: new FormControl(''),
            domain: new FormControl('', Validators.required),
            hostname: new FormControl('', Validators.required),
            config: new FormControl(''),
            loginProfile: new FormControl(''),
        });

        this.icons = [
            { value: "v1", name: "Name 1" },
            { value: "v2", name: "Name 2" },
            { value: "v3", name: "Name 3" },
        ];
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
        this.hardwares = [
            { value: "v1", name: "Name 1" },
            { value: "v2", name: "Name 2" },
            { value: "v3", name: "Name 3" },
        ];
        this.roles = [
            { value: "v1", name: "Name 1" },
            { value: "v2", name: "Name 2" },
            { value: "v3", name: "Name 3" },
        ];
        this.domains = [
            { value: "v1", name: "Name 1" },
            { value: "v2", name: "Name 2" },
            { value: "v3", name: "Name 3" },
        ];
        this.configs = [
            { value: "v1", name: "Name 1" },
            { value: "v2", name: "Name 2" },
            { value: "v3", name: "Name 3" },
        ];
        this.loginProfiles = [
            { value: "v1", name: "Name 1" },
            { value: "v2", name: "Name 2" },
            { value: "v3", name: "Name 3" },
        ];
    }

    get name() { return this.nodeAddForm.get('name'); }
    get notes() { return this.nodeAddForm.get('notes'); }
    get icon() { return this.nodeAddForm.get('icon'); }
    get category() { return this.nodeAddForm.get('category'); }
    get device() { return this.nodeAddForm.get('device'); }
    get template() { return this.nodeAddForm.get('template'); }
    get hardware() { return this.nodeAddForm.get('hardware'); }
    get folder() { return this.nodeAddForm.get('folder'); }
    get role() { return this.nodeAddForm.get('role'); }
    get domain() { return this.nodeAddForm.get('domain'); }
    get hostname() { return this.nodeAddForm.get('hostname'); }
    get config() { return this.nodeAddForm.get('config'); }
    get loginProfile() { return this.nodeAddForm.get('loginProfile'); }

    ngOnInit(): void {
        if (this.data.mode == 'add') {
            this.nodeService.getGenNodeData(
                this.data.collectionId,
                this.data.device,
                this.data.template
            ).subscribe(genData => {
                this.name?.setValue(genData.name);
                this.icon?.setValue(genData.icon.name);
                this.category?.setValue(genData.category);
                this.device?.setValue(this.data.device);
                this.template?.setValue(this.data.template);
                this.folder?.setValue(genData.folder);
                this.role?.setValue(genData.role);
                this.domain?.setValue(genData.domain.name);
                this.hostname?.setValue(genData.hostname);
                this.disableItems(this.category?.value);
            })
        } else {
        }
    }

    private disableItems(category: string) {
        if (category == 'hw') {
            this.device?.disable();
            this.template?.disable();
            this.hardware?.enable();
        } else {
            this.device?.enable();
            this.template?.enable();
            this.hardware?.disable();
        }
    }

    onCategoryChange($event: any) {
        this.disableItems($event.value);
    }

    optionDisplay(option: Option) {
        return option && option.name ? option.name : '';
    }

    onCancel() {
        this.dialogRef.close();
    }

    addNode() {
        console.log('addNode');
    }

    updateNode() {
        console.log('updateNode');
    }
}
