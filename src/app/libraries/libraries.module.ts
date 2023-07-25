import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LibrariesRoutingModule } from './libraries-routing.module';
import { ConfigTemplatesComponent } from './config-templates/config-templates.component';
import { NetworkTemplatesComponent } from './network-templates/network-templates.component';
import { AddEditConfigTemplateComponent } from './config-templates/add-edit-config-template/add-edit-config-template.component';
import { IconGalleryComponent } from './image/icon-gallery/icon-gallery.component';
import { AddEditIconDialogComponent } from './image/icon-gallery/add-edit-icon-dialog/add-edit-icon-dialog.component';
import { LookupFeaturesComponent } from './lookup/lookup-features/lookup-features.component';
import { LookupNamesComponent } from './lookup/lookup-names/lookup-names.component';
import { ImagesComponent } from './image/images/images.component';
import { AddEditImagesDialogComponent } from './image/images/add-edit-images-dialog/add-edit-images-dialog.component';
import { AddEditLookupFeaturesDialogComponent } from './lookup/lookup-features/add-edit-lookup-features-dialog/add-edit-lookup-features-dialog.component';
import { ImportLookupFeaturesDialogComponent } from './lookup/lookup-features/import-lookup-features-dialog/import-lookup-features-dialog.component';
import { UpdateFeatureDialogComponent } from './lookup/lookup-features/update-feature-dialog/update-feature-dialog.component';
import { AddEditLookupNamesDialogComponent } from './lookup/lookup-names/add-edit-lookup-names-dialog/add-edit-lookup-names-dialog.component';
import { ImportLookupNamesDialogComponent } from './lookup/lookup-names/import-lookup-names-dialog/import-lookup-names-dialog.component';


@NgModule({
  declarations: [
    ConfigTemplatesComponent,
    NetworkTemplatesComponent,
    AddEditConfigTemplateComponent,
    IconGalleryComponent,
    AddEditIconDialogComponent,
    LookupFeaturesComponent,
    LookupNamesComponent,
    ImagesComponent,
    AddEditImagesDialogComponent,
    AddEditLookupFeaturesDialogComponent,
    ImportLookupFeaturesDialogComponent,
    UpdateFeatureDialogComponent,
    AddEditLookupNamesDialogComponent,
    ImportLookupNamesDialogComponent
  ],
  imports: [
    SharedModule,
    LibrariesRoutingModule
  ]
})
export class LibrariesModule { }
