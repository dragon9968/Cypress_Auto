import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { MapPrefService } from 'src/app/core/services/map-pref/map-pref.service';
import { selectIcons } from 'src/app/store/icon/icon.selectors';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { validateNameExist } from 'src/app/shared/validations/name-exist.validation';
import { retrievedMapPrefs } from 'src/app/store/map-pref/map-pref.actions';
import { selectMapPrefs } from 'src/app/store/map-pref/map-pref.selectors';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';

@Component({
  selector: 'app-add-edit-mappref-dialog',
  templateUrl: './add-edit-mappref-dialog.component.html',
  styleUrls: ['./add-edit-mappref-dialog.component.scss']
})
export class AddEditMapprefDialogComponent {
  gbColorHtml!: SafeHtml;
  gbDefaultHtml!: SafeHtml;
  edgeDefaults!: SafeHtml;
  nodeDefaults!: SafeHtml;
  textDefaults!: SafeHtml;
  errorMessages = ErrorMessages;
  isViewMode = false;
  gbColor = '#000000';
  groupBoxOpacity = 0.2;
  textGBOpacityLabel = 0;
  textPGSizeLabel: any;
  textEdgeWidthLabel: any;
  textNodeSizeLabel: any;
  textSizeLabel: any;
  textBGOpacityLabel: any;
  textGridSpacingLabel: any;
  textEdgeArrowSizeLabel: any;
  textMapImageSizeLabel: any;
  gbBorderColor = '#000000';
  pgColor = '#000000';
  edgeColor = '#000000';
  textColor = '#000000';
  TextBG = '#000000';
  mapPrefForm!: FormGroup;
  selectIcons$ = new Subscription();
  selectMapPrefs$ = new Subscription();
  selectDefaultPreferences$ = new Subscription();
  listDefaultMapPref: any[] = [];
  listMapPref!: any[];
  listIcons!: any[];
  icon_default: any[] = [];
  listGroupBoxBorder = [{ value: 'solid', name: "Solid" },
  { value: 'dotted', name: "Dotted" },
  { value: 'dashed', name: "Dashed" },
  { value: 'double', name: "Double" }];
  listTextHorizontalAlignment = [
    { value: 'left', name: "Left" },
    { value: 'center', name: "Center" },
    { value: 'right', name: "Right" }
  ];
  listTextVerticalAlignment = [
    { value: 'top', name: "Top" },
    { value: 'center', name: "Center" },
    { value: 'bottom', name: "Bottom" }
  ];
  listZoomSpeed = [0.10, 0.25, 0.50];
  listEdgeArrowDirection = [
    { value: 'both', name: "Both" },
    { value: 'inbound', name: "Inbound" },
    { value: 'outbound', name: "Outbound" }];
  ICON_PATH = ICON_PATH;
  filteredIcons!: Observable<any[]>;

  constructor(
    private store: Store,
    public helpers: HelpersService,
    private toastr: ToastrService,
    private mapPrefService: MapPrefService,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<AddEditMapprefDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.mapPrefForm = new FormGroup({
      name: new FormControl(
        { value: '', disabled: false },
        [Validators.required, validateNameExist(() => this.listMapPref, this.data.mode, this.data.genData.id)]),
      gbOpacity: new FormControl({ value: '', disabled: this.isViewMode }),
      gbBorder: new FormControl({ value: '', disabled: this.isViewMode }),
      pgSizeCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      edgeWidthCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      nodeSizeCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      textSizeCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      textHorizontalAlignmentCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      textVerticalAlignmentCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      textBgOpacityCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      mapGridCtr: new FormControl({ value: false, disabled: this.isViewMode }),
      snapToGridCtr: new FormControl({ value: false, disabled: this.isViewMode }),
      gridSpacingCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      zoomSpeedCtr: new FormControl({ value: 0.1, disabled: false }),
      defaultIconCtr: new FormControl({ value: '', disabled: false }),
      edgeArrowDirectionCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      edgeArrowSizeCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      mapImageSizeCtr: new FormControl({ value: '', disabled: this.isViewMode }),
    });
    this.selectMapPrefs$ = this.store.select(selectMapPrefs).subscribe((data: any) => {
      this.listMapPref = data;
      this.listDefaultMapPref = data.filter((el: any) => el.name === 'Default');
      if (this.data.mode === 'add') {
        this.gbColor = this.listDefaultMapPref[0].group_box_color;
        this.gbBorderColor = this.listDefaultMapPref[0].group_box_border_color;
        this.pgColor = this.listDefaultMapPref[0].port_group_color;
        this.edgeColor = this.listDefaultMapPref[0].edge_color;
        this.textColor = this.listDefaultMapPref[0].text_color;
        this.TextBG = this.listDefaultMapPref[0].text_bg_color;
        this.gbOpacity?.setValue(this.listDefaultMapPref[0].group_box_opacity);
        this.gbBorder?.setValue(this.listDefaultMapPref[0].group_box_border);
        this.pgSizeCtr?.setValue(this.listDefaultMapPref[0].port_group_size);
        this.edgeWidthCtr?.setValue(this.listDefaultMapPref[0].edge_width);
        this.nodeSizeCtr?.setValue(this.listDefaultMapPref[0].node_size);
        this.textSizeCtr?.setValue(this.listDefaultMapPref[0].text_size);
        this.textHorizontalAlignmentCtr?.setValue(this.listDefaultMapPref[0].text_halign);
        this.textVerticalAlignmentCtr?.setValue(this.listDefaultMapPref[0].text_valign);
        this.textBgOpacityCtr?.setValue(this.listDefaultMapPref[0].text_bg_opacity);
        this.defaultIconCtr?.setValue(this.data.genIcon[0]);
        this.edgeArrowDirectionCtr?.setValue(this.listDefaultMapPref[0].edge_arrow_direction);
        this.edgeArrowSizeCtr?.setValue(this.listDefaultMapPref[0].edge_arrow_size);
        this.mapGridCtr?.setValue(this.listDefaultMapPref[0].grid_enabled);
        this.snapToGridCtr?.setValue(this.listDefaultMapPref[0].grid_snap);
        this.gridSpacingCtr?.setValue(this.listDefaultMapPref[0].grid_spacing);
        this.mapImageSizeCtr?.setValue(this.listDefaultMapPref[0].scale_image);
        this._setPropertiesCommon(this.listDefaultMapPref[0]);
      }
    });
    this.selectIcons$ = this.store.select(selectIcons).subscribe((data: any) => {
      this.listIcons = data;
      this.defaultIconCtr.setValidators([autoCompleteValidator(this.listIcons)]);
      this.filteredIcons = this.helpers.filterOptions(this.defaultIconCtr, this.listIcons);
    });
    this.isViewMode = this.data.mode == 'view';
    if ((this.data.mode === 'update')) {
      this.setValueMap();
    }
    else if (data.mode == 'view') {
      this.name?.setValue(this.data.genData.name);
      this.gbColorHtml = this.sanitizer.bypassSecurityTrustHtml(this.data.genData.group_box_defaults);
      this.gbDefaultHtml = this.sanitizer.bypassSecurityTrustHtml(this.data.genData.port_group_defaults);
      this.edgeDefaults = this.sanitizer.bypassSecurityTrustHtml(this.data.genData.edge_defaults);
      this.nodeDefaults = this.sanitizer.bypassSecurityTrustHtml(this.data.genData.node_defaults);
      this.textDefaults = this.sanitizer.bypassSecurityTrustHtml(this.data.genData.text_defaults);
      this.zoomSpeedCtr?.setValue(this.data.genData.zoom_speed);
      this.defaultIconCtr?.setValue(this.data.genData.default_icon);
    }
  }

  get name() { return this.mapPrefForm.get('name'); }
  get gbColorCtr() { return this.mapPrefForm.get('gbColorCtr'); }
  get gbOpacity() { return this.mapPrefForm.get('gbOpacity'); }
  get gbBorder() { return this.mapPrefForm.get('gbBorder'); }
  get pgSizeCtr() { return this.mapPrefForm.get('pgSizeCtr'); }
  get edgeWidthCtr() { return this.mapPrefForm.get('edgeWidthCtr'); }
  get nodeSizeCtr() { return this.mapPrefForm.get('nodeSizeCtr'); }
  get textSizeCtr() { return this.mapPrefForm.get('textSizeCtr'); }
  get textHorizontalAlignmentCtr() { return this.mapPrefForm.get('textHorizontalAlignmentCtr'); }
  get textVerticalAlignmentCtr() { return this.mapPrefForm.get('textVerticalAlignmentCtr'); }
  get textBgOpacityCtr() { return this.mapPrefForm.get('textBgOpacityCtr'); }
  get zoomSpeedCtr() { return this.mapPrefForm.get('zoomSpeedCtr'); }
  get defaultIconCtr() { return this.helpers.getAutoCompleteCtr(this.mapPrefForm.get('defaultIconCtr'), this.listIcons); }
  get edgeArrowDirectionCtr() { return this.mapPrefForm.get('edgeArrowDirectionCtr') }
  get edgeArrowSizeCtr() { return this.mapPrefForm.get('edgeArrowSizeCtr') }
  get mapGridCtr() { return this.mapPrefForm.get('mapGridCtr') }
  get snapToGridCtr() { return this.mapPrefForm.get('snapToGridCtr') }
  get gridSpacingCtr() { return this.mapPrefForm.get('gridSpacingCtr') }
  get mapImageSizeCtr() { return this.mapPrefForm.get('mapImageSizeCtr') }

  onCancel() {
    this.dialogRef.close();
  }

  private _setPropertiesCommon(data: any) {
    this.textGBOpacityLabel = data.group_box_opacity ? Math.round(data.group_box_opacity * 100) : 0;
    this.textPGSizeLabel = data.port_group_size;
    this.textEdgeWidthLabel = data.edge_width;
    this.textNodeSizeLabel = data.node_size;
    this.textSizeLabel = data.text_size;
    this.textBGOpacityLabel = data.text_bg_opacity ? Math.round(data.text_bg_opacity * 100) : 0;
    this.textEdgeArrowSizeLabel = data.edge_arrow_size;
    this.textGridSpacingLabel = data.grid_spacing;
    this.textMapImageSizeLabel = data.scale_image;
  }

  addMapPref() {
    const jsonDataValue = {
      name: this.name?.value,
      group_box_color: this.gbColor,
      group_box_opacity: this.gbOpacity?.value,
      group_box_border: this.gbBorder?.value,
      group_box_border_color: this.gbBorderColor,
      port_group_color: this.pgColor,
      port_group_size: this.pgSizeCtr?.value,
      edge_color: this.edgeColor,
      edge_width: this.edgeWidthCtr?.value,
      node_size: this.nodeSizeCtr?.value,
      text_size: this.textSizeCtr?.value,
      text_color: this.textColor,
      text_halign: this.textHorizontalAlignmentCtr?.value,
      text_valign: this.textVerticalAlignmentCtr?.value,
      text_bg_color: this.TextBG,
      text_bg_opacity: this.textBgOpacityCtr?.value,
      grid_enabled: this.mapGridCtr?.value,
      grid_spacing: this.gridSpacingCtr?.value,
      grid_snap: this.snapToGridCtr?.value,
      zoom_speed: this.zoomSpeedCtr?.value,
      default_icon: this.defaultIconCtr?.value.name,
      edge_arrow_direction: this.edgeArrowDirectionCtr?.value,
      edge_arrow_size: this.edgeArrowSizeCtr?.value,
      scale_image: this.mapImageSizeCtr?.value
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.mapPrefService.add(jsonData).subscribe({
      next: (rest) => {
        this.toastr.success(`Added Preferences ${rest.result.name} successfully`)
        this.dialogRef.close();
        this.mapPrefService.getAll().subscribe((data: any) => this.store.dispatch(retrievedMapPrefs({ data: data.result })));
      },
      error: (err) => {
        this.toastr.error("Add Preferences error")
      }
    })
  }

  updateMapPref() {
    const jsonDataValue = {
      name: this.name?.value,
      group_box_color: this.gbColor,
      group_box_opacity: this.gbOpacity?.value,
      group_box_border: this.gbBorder?.value,
      group_box_border_color: this.gbBorderColor,
      port_group_color: this.pgColor,
      port_group_size: this.pgSizeCtr?.value,
      edge_color: this.edgeColor,
      edge_width: this.edgeWidthCtr?.value,
      node_size: this.nodeSizeCtr?.value,
      text_size: this.textSizeCtr?.value,
      text_color: this.textColor,
      text_halign: this.textHorizontalAlignmentCtr?.value,
      text_valign: this.textVerticalAlignmentCtr?.value,
      text_bg_color: this.TextBG,
      text_bg_opacity: this.textBgOpacityCtr?.value,
      grid_enabled: this.mapGridCtr?.value,
      grid_spacing: this.gridSpacingCtr?.value,
      grid_snap: this.snapToGridCtr?.value,
      zoom_speed: this.zoomSpeedCtr?.value,
      default_icon: this.defaultIconCtr?.value.name,
      edge_arrow_direction: this.edgeArrowDirectionCtr?.value,
      edge_arrow_size: this.edgeArrowSizeCtr?.value,
      scale_image: this.mapImageSizeCtr?.value
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.mapPrefService.put(this.data.genData.id, jsonData).subscribe({
      next: (rest) => {
        this.toastr.success(`Updated Preferences ${rest.result.name} successfully`);
        this.dialogRef.close();
        this.mapPrefService.getAll().subscribe((data: any) => this.store.dispatch(retrievedMapPrefs({ data: data.result })));
      },
      error: (err) => {
        this.toastr.success(`Error while update Preferences`);
        this.dialogRef.close();
      }
    })
  }

  setGbColor(event: any) {
    this.gbColor = event;
  }

  setGroupBoxOpacity(size: any) {
    this.textGBOpacityLabel = size.value ? Math.round(size.value * 100) : 0;
  }

  setPgSize(size: any) {
    this.textPGSizeLabel = size.value;
  }

  setEdgeWidth(size: any) {
    this.textEdgeWidthLabel = size.value;
  }

  setNodeSize(size: any) {
    this.textNodeSizeLabel = size.value;
  }

  setTextSize(size: any) {
    this.textSizeLabel = size.value;
  }

  setTextBGOpacity(size: any) {
    this.textBGOpacityLabel = size.value ? Math.round(size.value * 100) : 0;
  }

  setGridSpacing(size: any) {
    this.textGridSpacingLabel = size.value;
  }

  setEdgeArrowSize(size: any) {
    this.textEdgeArrowSizeLabel = size.value;
  }

  setMapImageSize(size: any) {
    this.textMapImageSizeLabel = size.value;
  }

  setGbBorderColor(event: any) {
    this.gbBorderColor = event;
  }

  setPgColor(event: any) {
    this.pgColor = event;
  }

  setEdgeColor(event: any) {
    this.edgeColor = event;
  }

  setTextColor(event: any) {
    this.textColor = event;
  }

  setTextBG(event: any) {
    this.TextBG = event;
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
    this.setValueMap();
  }

  setValueMap () {
    const icon = this.listIcons.filter(i => i.name === this.data.genData.default_icon)
    this.name?.setValue(this.data.genData.name);
    this.gbColor = this.data.genData.group_box_color;
    this.gbOpacity?.setValue(this.data.genData.group_box_opacity);
    this.gbBorder?.setValue(this.data.genData.group_box_border);
    this.gbBorderColor = this.data.genData.group_box_border_color;
    this.pgColor = this.data.genData.port_group_color;
    this.pgSizeCtr?.setValue(this.data.genData.port_group_size);
    this.edgeColor = this.data.genData.edge_color;
    this.edgeWidthCtr?.setValue(this.data.genData.edge_width);
    this.nodeSizeCtr?.setValue(this.data.genData.node_size);
    this.textSizeCtr?.setValue(this.data.genData.text_size);
    this.textColor = this.data.genData.text_color;
    this.textHorizontalAlignmentCtr?.setValue(this.data.genData.text_halign);
    this.textVerticalAlignmentCtr?.setValue(this.data.genData.text_valign);
    this.TextBG = this.data.genData.text_bg_color;
    this.textBgOpacityCtr?.setValue(this.data.genData.text_bg_opacity);
    this.zoomSpeedCtr?.setValue(this.data.genData.zoom_speed);
    if (icon.length > 0) {
      this.defaultIconCtr?.setValue(icon[0]);
    }
    this.edgeArrowDirectionCtr?.setValue(this.data.genData.edge_arrow_direction);
    this.edgeArrowSizeCtr?.setValue(this.data.genData.edge_arrow_size);
    this.mapGridCtr?.setValue(this.data.genData.grid_enabled);
    this.snapToGridCtr?.setValue(this.data.genData.grid_snap);
    this.gridSpacingCtr?.setValue(this.data.genData.grid_spacing);
    this.mapImageSizeCtr?.setValue(this.data.genData.scale_image);
    this._setPropertiesCommon(this.data.genData);
  }
}
