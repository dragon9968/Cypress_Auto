import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { PORT } from 'src/app/shared/contants/port.constant';
import { retrievedConfigTemplates } from 'src/app/store/config-template/config-template.actions';
import { HelpersService } from "../../../core/services/helpers/helpers.service";

@Component({
  selector: 'app-add-firewall-rule-dialog',
  templateUrl: './add-firewall-rule-dialog.component.html',
  styleUrls: ['./add-firewall-rule-dialog.component.scss']
})
export class AddFirewallRuleDialogComponent implements OnInit {
  firewallRuleForm!: FormGroup;
  PORT = PORT;
  constructor(
    private configTemplateService: ConfigTemplateService,
    private toastr: ToastrService,
    private store: Store,
    public dialogRef: MatDialogRef<AddFirewallRuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helpersService: HelpersService
  ) {
    this.firewallRuleForm = new FormGroup({
      category: new FormControl({value: 'rule', disabled: false}),
      name: new FormControl({value: '', disabled: false}),
      state: new FormControl({value: 'present', disabled: false}),
      action: new FormControl('pass'),
      interface: new FormControl({value: '', disabled: false}),
      protocol: new FormControl({value: 'any', disabled: false}),
      source: new FormControl({value: 'any', disabled: false}),
      sourcePort: new FormControl({value: 'any', disabled: false}),
      sourceCustomPort: new FormControl({value: 'any', disabled: true}),
      destination: new FormControl({value: 'any', disabled: false}),
      destinationPort: new FormControl({value: 'any', disabled: false}),
      destCustomPort: new FormControl({value: '', disabled: true}),
      target: new FormControl({value: '', disabled: true}),
      targetPort: new FormControl({value: 'any', disabled: true}),
      targetCustomPort: new FormControl({value: '', disabled: true}),
    });
   }
  get category() {return this.firewallRuleForm.get('category');}
  get name() {return this.firewallRuleForm.get('name');}
  get state() {return this.firewallRuleForm.get('state');}
  get action() {return this.firewallRuleForm.get('action');}
  get interface() {return this.firewallRuleForm.get('interface');}
  get protocol() {return this.firewallRuleForm.get('protocol');}
  get source() {return this.firewallRuleForm.get('source');}
  get sourcePort() {return this.firewallRuleForm.get('sourcePort');}
  get sourceCustomPort() {return this.firewallRuleForm.get('sourceCustomPort');}
  get destination() {return this.firewallRuleForm.get('destination');}
  get destinationPort() {return this.firewallRuleForm.get('destinationPort');}
  get destCustomPort() {return this.firewallRuleForm.get('destCustomPort');}
  get target() {return this.firewallRuleForm.get('target');}
  get targetPort() {return this.firewallRuleForm.get('targetPort');}
  get targetCustomPort() {return this.firewallRuleForm.get('targetCustomPort');}

  ngOnInit(): void {

  }

  private disableItems(category: string) {
    if (category === 'port_forward') {
      this.action?.disable();
      this.protocol?.disable();
      this.sourcePort?.disable();
      this.target?.enable();
      this.targetPort?.enable();
    }else {
      this.action?.enable();
      this.protocol?.enable();
      this.sourcePort?.enable();
      this.target?.disable();
      this.targetPort?.disable();
      this.targetCustomPort?.disable();
    }
  }

  onCategoryChange(event: any) {
    this.disableItems(event)
  }

  onChangeSourcePort(event: any) {
    if (event === "other") {
      this.sourceCustomPort?.enable();
    }else {
      this.sourceCustomPort?.disable();
    }
  }

  onChangeDestinationPort(event: any) {
    if (event === "other") {
      this.destCustomPort?.enable();
    }else {
      this.destCustomPort?.disable();
    }
  }

  onChangeTargetPort(event: any) {
    if (event === "other") {
      this.targetCustomPort?.enable();
    }else {
      this.targetCustomPort?.disable();
    }
  }

  addFirewallRule() {
    const jsonDataValue = {
      config_type: "firewall",
      config_id: this.data.genData.id,
      category: this.category?.value,
      name: this.name?.value,
      state: this.state?.value,
      action: this.action?.value,
      interface: this.interface?.value,
      protocol: this.protocol?.value,
      source: this.source?.value,
      source_port: this.sourcePort?.value,
      source_port_custom: this.sourceCustomPort?.value,
      destination: this.destination?.value,
      dest_port: this.destinationPort?.value,
      dest_port_custom: this.destCustomPort?.value,
      target: this.target?.value,
      target_port: this.targetPort?.value,
      target_port_custom: this.targetCustomPort?.value,
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.configTemplateService.addConfiguration(jsonData).subscribe({
      next: (rest) =>{
        this.toastr.success(`Added Firewall successfully`);
        this.dialogRef.close();
        this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
      },
      error:(err) => {
        this.toastr.error(`Error while add Firewall`);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
