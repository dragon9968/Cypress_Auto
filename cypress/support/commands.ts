// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(username: string, password: string): typeof login;
  }
}

function login(username: string, password: string): void {
  cy.url().should('include', 'login')
  cy.getByFormControlName('username').type(username)
  cy.getByFormControlName('password').type(password)
  cy.getByDataCy('login-form').submit().log(`Login as username ${username} successfully`)
  cy.url().should('not.include', 'login')
}
//
// NOTE: You can use it like so:
Cypress.Commands.add('login', login);
//

declare namespace Cypress {
  interface Chainable<Subject = any> {
    addNewRandomProject(project: any): typeof addNewRandomProject;
    addNewBlankProject(project: any): typeof addNewBlankProject;
    Random_Name(project: any): typeof Random_Name;

  }
}

function addNewRandomProject(project: any): void {
  cy.getByFormControlName('name').type(project.name)
  cy.getByFormControlName('description').type(project.description)
  cy.getByFormControlName('category').children(`mat-radio-button[value="${project.category}"]`).click()
  cy.getByFormControlName('target').click().then(() => {
    cy.get('mat-option').contains(`${project.target}`).click()
  })
  cy.getByFormControlName('option').children(`mat-radio-button[value="${project.option1}"]`).click()
  cy.getByFormControlName('enclave_number').clear().type(project.enclave_number)
  cy.getByFormControlName('enclave_clients').clear().type(project.enclave_clients)
  cy.getByFormControlName('enclave_servers').clear().type(project.enclave_servers)
  cy.getByFormControlName('enclave_users').clear().type(project.enclave_users)
  cy.getByFormControlName('vlan_min').clear().type(project.vlan_min)
  cy.getByFormControlName('vlan_max').clear().type(project.vlan_max)
  cy.get('mat-error').should('not.exist')
  cy.getByDataCy('projectForm').submit().log(`Create project ${project.name} successfully`)
  cy.scrollTo('top')
  cy.url().should('include', 'projects')
}


function addNewBlankProject(project: any): void {

  cy.getByFormControlName('name').type(project.name + Random_Name())
  cy.getByFormControlName('description').type(project.description)
  cy.getByFormControlName('category').children(`mat-radio-button[value="${project.category}"]`).click()
  cy.getByFormControlName('target').click().then(() => {
    cy.get('mat-option').contains(`${project.target}`).click()
  })
  cy.getByFormControlName('option').children(`mat-radio-button[value="${project.option2}"]`).click()
  cy.get('mat-error').should('not.exist')
  cy.getByDataCy('projectForm').submit().log(`Create project ${project.name} successfully`)
  cy.scrollTo('top')
  cy.url().should('include', 'projects')
  cy.wait(6000)



}

function Random_Name() {
  var text = "";
  var possible = "0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
// Add a new configuration template
declare namespace Cypress {
  interface Chainable<Subject = any> {
    addNewConfigTemplate(configTemplate: any): typeof addNewConfigTemplate;
  }
}

function addNewConfigTemplate(configTemplate: any): void {
  cy.log(`START: Add new ${configTemplate.name} config`)
  cy.getByMatToolTip('Add New Config Template').click()
  cy.getByFormControlName('name').type(configTemplate.name)
  cy.getByFormControlName('description').type(configTemplate.description)
  cy.get('mat-error').should('not.exist')
  cy.wait(3000)
  cy.getByDataCy('configTemplateForm').submit()
  cy.log(`END: Added new ${configTemplate.name} config`)
}
Cypress.Commands.add('addNewConfigTemplate', addNewConfigTemplate);
//
// NOTE: You can use it like so:
Cypress.Commands.add('addNewRandomProject', addNewRandomProject);
Cypress.Commands.add('addNewBlankProject', addNewBlankProject);


// Edit configuration template
declare namespace Cypress {
  interface Chainable<Subject = any> {
    editConfigTemplate(configTemplate: any, newValue: any): typeof editConfigTemplate;
  }
}

function editConfigTemplate(configTemplate: any, newValue: any): void {
  cy.log(`START: Edit ${configTemplate.name} Config`)
  cy.wait(3000)

  cy.getByFormControlName('name').as('name').invoke('val').then(nameValue => {
    if (nameValue !== configTemplate.name) {
      cy.get('@name').clear().type(configTemplate.name)
    }
  })
  cy.getByFormControlName('description').as('description').invoke('val').then(nameValue => {
    if (nameValue !== configTemplate.description) {
      cy.get('@description').clear().type(configTemplate.description)
    }
  })

  cy.wait(2000)
  cy.get('.ace_content').first().then((aceContentEle: any) => {
    let aceContent = JSON.parse(aceContentEle[0].textContent)
    Object.entries(newValue).forEach(([key, value]) => {
      aceContent[key] = value
    })
    cy.wait(2000)
    cy.get('.ace_text-input').focus().clear({force: true})
    cy.wait(2000)
    cy.get('.ace_text-input').type(JSON.stringify(aceContent, null, 2), { force: true })
  })
  cy.get('mat-error').should('not.exist')
  cy.getByDataCy('configTemplateForm').as('configTemplateForm').submit()
  cy.wait(2000)
  cy.get('.toast-warning').should('not.exist')
  cy.log(`END: Edited ${configTemplate.name} Config`)
  cy.wait(2000)
  cy.get('mat-dialog-container').should('not.exist')
}
Cypress.Commands.add('editConfigTemplate', editConfigTemplate);
// Update App Preferences
declare namespace Cypress {
  interface Chainable<Subject = any> {
    updateAppPreferences(appPreferences: any, privateNetwork: any, privateNetworkIps: any): typeof updateAppPreferences;
  }
}

function updateAppPreferences(appPreferences: any,  privateNetwork: any, privateNetworkIps: any): void {
  cy.log(`START: Update App Preferences`)
  cy.get('[data-cy=select-mappref]').click();
  cy.getOptionByContent('Default').click();
  cy.getByFormControlName('publicNetworkCtr').as('publicNetworkCtr').invoke('val').then(value => {
    if (value !== appPreferences.public_network && appPreferences.public_network) {
      cy.get('@publicNetworkCtr').clear().type(appPreferences.public_network)
      cy.wait(2000)
    }
  })
  cy.getByFormControlName('privateNetworkCtr').as('privateNetworkCtr').invoke('val').then(value => {
    if (value !== privateNetwork && privateNetwork) {
      cy.get('@privateNetworkCtr').clear().type(privateNetwork)
      cy.wait(2000)
    }
  })
  cy.getByFormControlName('privateNetworkIPsCtr').as('privateNetworkIPsCtr').invoke('val').then(value => {
    if (value !== privateNetworkIps && privateNetworkIps) {
      cy.get('@privateNetworkIPsCtr').clear().type(privateNetworkIps)
      cy.wait(2000)
    }
  })
  cy.getByFormControlName('managementNetworkCtr').as('managementNetworkCtr').invoke('val').then(value => {
    cy.get('@managementNetworkCtr').clear().type(appPreferences.management_network)
    cy.wait(2000)
  })
  cy.getByFormControlName('dhcpServerCtr').as('dhcpServerCtr').invoke('val').then(value => {
    cy.get('@dhcpServerCtr').clear().type(appPreferences.dhcp_server)
    cy.wait(2000)
  })
  cy.log(`END: Update App Preferences`)
}

Cypress.Commands.add('updateAppPreferences', updateAppPreferences);

// Select All row on AG-Grid
declare namespace Cypress {
  interface Chainable<Subject = any> {
    selectAllRow(): typeof selectAllRow;
  }
}



function selectAllRow(): void {
  cy.get('.ag-header-cell .ag-header-select-all input[type="checkbox"]').first().check({ force: true })
}
Cypress.Commands.add('selectAllRow', selectAllRow);

// UnSelect All row on AG-Grid
declare namespace Cypress {
  interface Chainable<Subject = any> {
    unSelectAllRow(): typeof unSelectAllRow;
  }
}

function unSelectAllRow(): void {
  cy.get('.ag-header-cell .ag-header-select-all input[type="checkbox"]').first().uncheck({ force: true })
}
Cypress.Commands.add('unSelectAllRow', unSelectAllRow);

// Select row on AG-Grid by name
declare namespace Cypress {
  interface Chainable<Subject = any> {
    selectRowByName(name: string): typeof selectRowByName;
  }
}

function selectRowByName(name: string): void {
  cy.get('.ag-row').contains(name).first().click({ force: true }).type(" ");
}
Cypress.Commands.add('selectRowByName', selectRowByName);

declare namespace Cypress {
  interface Chainable<Subject = any> {
    addUpdateMapPreferences(mapPreferences: any): typeof addUpdateMapPreferences;
  }
}

function calcArrowsSlider(targetValue: any, currentValue: any) {
  const arrows = targetValue > currentValue ? '{rightarrow}'.repeat((targetValue - currentValue) / 1) : targetValue < currentValue ? '{leftArrow}'.repeat((currentValue - targetValue) / 1) : `${currentValue}`;
  return arrows
}

function addUpdateMapPreferences (mapPreferences: any) {
  cy.log(`START: Add/Update new ${mapPreferences.name}`)
  cy.getByFormControlName('name').as('name').invoke('val').then(val => {
    cy.get('@name').clear().type(mapPreferences.name)
  })
  cy.get('#gbColor').click()
  cy.getColorPickerByClass('.gb-color').clear().type(mapPreferences.group_box_color).type(`{enter}`)
  cy.getByFormControlName('gbOpacity').as('gbOpacity').then(value =>{
    cy.get('@gbOpacity').type(calcArrowsSlider(mapPreferences.group_box_opacity * 100, 50))
  })
  cy.get('[data-cy=gbBorder]').click();
  cy.getOptionByContent(mapPreferences.group_box_border.charAt(0).toUpperCase() + mapPreferences.group_box_border.slice(1)).click();

  cy.get('#groupBoxBorderColor').click()
  cy.getColorPickerByClass('.gb-border-color').clear().type(mapPreferences.group_box_border_color).type(`{enter}`)

  cy.get('#portGroupColor').click()
  cy.getColorPickerByClass('.pg-color').clear().type(mapPreferences.port_group_color).type(`{enter}`)

  cy.getByFormControlName('pgSizeCtr').as('pgSizeCtr').then(value =>{
    cy.get('@pgSizeCtr').type(calcArrowsSlider(mapPreferences.port_group_size, 50))
  })
  
  cy.get('#edgeColor').click()
  cy.getColorPickerByClass('.edge-color').clear().type(mapPreferences.edge_color).type(`{enter}`)
  cy.getByFormControlName('edgeWidthCtr').as('edgeWidthCtr').then(value =>{
    cy.get('@edgeWidthCtr').type(calcArrowsSlider(mapPreferences.edge_width, 50))
  })
  cy.getByFormControlName('nodeSizeCtr').as('nodeSizeCtr').then(value =>{
    cy.get('@nodeSizeCtr').type(calcArrowsSlider(mapPreferences.node_size, 50))
  })
  cy.getByFormControlName('textSizeCtr').as('textSizeCtr').then(value =>{
    cy.get('@textSizeCtr').type(calcArrowsSlider(mapPreferences.text_size, 50))
  })

  cy.get('#textColor').click()
  cy.getColorPickerByClass('.text-color').clear().type(mapPreferences.text_color).type(`{enter}`)

  cy.getByFormControlName('textHorizontalAlignmentCtr').click();
  cy.getOptionByContent(mapPreferences.text_halign.charAt(0).toUpperCase() + mapPreferences.text_halign.slice(1)).click();

  cy.getByFormControlName('textVerticalAlignmentCtr').click();
  cy.getOptionByContent(mapPreferences.text_valign.charAt(0).toUpperCase() + mapPreferences.text_valign.slice(1)).click();

  cy.get('#TextBG').click()
  cy.getColorPickerByClass('.text-bg').clear().type(mapPreferences.text_bg_color).type(`{enter}`)

  cy.getByFormControlName('textBgOpacityCtr').as('textBgOpacityCtr').then(value =>{
    cy.get('@textBgOpacityCtr').type(calcArrowsSlider(mapPreferences.text_bg_opacity * 100, 50))
  })

  if (mapPreferences.grid_enabled) {
    cy.getByDataCy('mapPrefForm').get('.cy-map-grid > mat-checkbox span input[type="checkbox"]').check({ force: true }).should('be.checked')
  } else {
    cy.getByDataCy('mapPrefForm').get('.cy-map-grid > mat-checkbox span input[type="checkbox"]').uncheck({ force: true })
  }

  cy.getByFormControlName('gridSpacingCtr').as('gridSpacingCtr').then(value =>{
    cy.get('@gridSpacingCtr').type(calcArrowsSlider(mapPreferences.grid_spacing, 149))
  })

  if (mapPreferences.grid_snap) {
    cy.getByDataCy('mapPrefForm').get('.cy-snap-grid > mat-checkbox span input[type="checkbox"]').check({ force: true }).should('be.checked')
  } else {
    cy.getByDataCy('mapPrefForm').get('.cy-snap-grid > mat-checkbox span input[type="checkbox"]').uncheck({ force: true })
  }
  
  cy.getByFormControlName('zoomSpeedCtr').click();
  cy.getOptionByContent(mapPreferences.zoom_speed).click();

  cy.get('#mappref-default-icon').clear({force: true}).type(mapPreferences.default_icon)
  cy.getOptionByContent(mapPreferences.default_icon).click();

  cy.getByFormControlName('edgeArrowDirectionCtr').click();
  cy.getOptionByContent(mapPreferences.edge_arrow_direction.charAt(0).toUpperCase() + mapPreferences.edge_arrow_direction.slice(1)).click();

  cy.getByFormControlName('edgeArrowSizeCtr').as('edgeArrowSizeCtr').then(value =>{
    cy.get('@edgeArrowSizeCtr').type(calcArrowsSlider(mapPreferences.edge_arrow_size, 25))
  })
  
  cy.getByFormControlName('mapImageSizeCtr').as('mapImageSizeCtr').then(value =>{
    cy.get('@mapImageSizeCtr').type(calcArrowsSlider(mapPreferences.scale_image, 100))
  })

  cy.get('mat-error').should('not.exist')
  cy.wait(2000)
  cy.getByDataCy('mapPrefForm').submit()
  cy.log(`END: Add/Update new ${mapPreferences.name}`)
}
Cypress.Commands.add('addUpdateMapPreferences', addUpdateMapPreferences);


declare namespace Cypress {
  interface Chainable<Subject = any> {
    addOspfConfigTemplate(configTemplate: any, networksInvalid: any): typeof addOspfConfigTemplate;
  }
}


function addOspfConfigTemplate(configTemplate: any, networksInvalid: any): void {
  cy.log(`START: Add ${configTemplate.name} Config`)
  if (networksInvalid) {
    // START: Validation Networks
    cy.getByFormControlName('networksCtr').as('networksCtr').invoke('val').then(nameValue => {
      if (nameValue !== networksInvalid) {
        cy.get('@networksCtr').clear().type(networksInvalid)
      }
    })
    const ospfBGPMetricTypeValid = configTemplate.ospf[0].redistibution.bgb.metric_type
    cy.getByFormControlName('bgpMetricTypeCtr').as('bgpMetricTypeCtr').invoke('val').then(nameValue => {
      if (nameValue !== ospfBGPMetricTypeValid) {
        cy.get('@bgpMetricTypeCtr').clear().type(ospfBGPMetricTypeValid)
      }
    })
    cy.get('mat-error').should('exist')
    cy.getByDataCy('btn-add-ospf').should("be.disabled")
    cy.wait(3000)
    // END
  } else {
    const networks = (configTemplate.ospf[0].networks).join()
    cy.getByFormControlName('networksCtr').as('networksCtr').invoke('val').then(nameValue => {
      if (nameValue !== networks) {
        cy.get('@networksCtr').clear().type(networks)
      }
    })
    const bgp = configTemplate.ospf[0].redistibution.bgb.state
    if (bgp) {
      cy.get('.cy-ospf-bgpState span input[type="checkbox"]').check({ force: true }).should('be.checked')
    } else {
      cy.get('.cy-ospf-bgpState span input[type="checkbox"]').uncheck({ force: true })
    }

    const ospfBGPMetricType = configTemplate.ospf[0].redistibution.bgb.metric_type
    cy.getByFormControlName('bgpMetricTypeCtr').as('bgpMetricTypeCtr').invoke('val').then(nameValue => {
      if (nameValue !== ospfBGPMetricType) {
        cy.get('@bgpMetricTypeCtr').clear().type(ospfBGPMetricType)
      }
    })

    const ospfConnectedState = configTemplate.ospf[0].redistibution.connected.state
    if (ospfConnectedState) {
      cy.get('.cy-ospf-connectedState span input[type="checkbox"]').check({ force: true }).should('be.checked')
    } else {
      cy.get('.cy-ospf-connectedState span input[type="checkbox"]').uncheck({ force: true })
    }

    const ospfConnectedMetricType = configTemplate.ospf[0].redistibution.connected.metric_type
    cy.getByFormControlName('connectedMetricTypeCtr').as('connectedMetricTypeCtr').invoke('val').then(nameValue => {
      if (nameValue !== ospfConnectedMetricType) {
        cy.get('@connectedMetricTypeCtr').clear().type(ospfConnectedMetricType)
      }
    })

    const ospfStaticState = configTemplate.ospf[0].redistibution.static.state
    if (ospfStaticState) {
      cy.get('.cy-ospf-staticState span input[type="checkbox"]').check({ force: true }).should('be.checked')
    } else {
      cy.get('.cy-ospf-staticState span input[type="checkbox"]').uncheck({ force: true })
    }

    const ospfStaticMetricType = configTemplate.ospf[0].redistibution.static.metric_type
    cy.getByFormControlName('staticMetricTypeCtr').as('staticMetricTypeCtr').invoke('val').then(nameValue => {
      if (nameValue !== ospfStaticMetricType) {
        cy.get('@staticMetricTypeCtr').clear().type(ospfStaticMetricType)
      }
    })

    cy.get('mat-error').should('not.exist')
    cy.getByDataCy('ospfForm').as('ospfForm').submit()
    cy.get('mat-error').should('not.exist')
    cy.getByDataCy('configTemplateForm').as('configTemplateForm').submit()
    cy.wait(3000)
  }
}

Cypress.Commands.add('addOspfConfigTemplate', addOspfConfigTemplate);








// Showing edit form by name
declare namespace Cypress {
  interface Chainable<Subject = any> {
    showFormEditByName(name: string): typeof showFormEditByName;
  }
}

function showFormEditByName(name: string): void {
  cy.wait(2000)
  cy.get('.ag-row').contains(name).first().dblclick({ force: true })
  cy.get('mat-dialog-container').should('exist')
  cy.getByDataCy('btn-change-mode').click()
}
Cypress.Commands.add('showFormEditByName', showFormEditByName);

// Showing add form by name
declare namespace Cypress {
  interface Chainable<Subject = any> {
    showFormAddByMatTooltip(name: string): typeof showFormAddByMatTooltip;
  }
}

function showFormAddByMatTooltip(name: string): void {
  cy.wait(2000)
  cy.getByMatToolTip(name).first().click()
  cy.get('mat-dialog-container').should('exist')
}
Cypress.Commands.add('showFormAddByMatTooltip', showFormAddByMatTooltip);

// Add a new login profile
declare namespace Cypress {
  interface Chainable<Subject = any> {
    addUpdateNewLoginProfile(loginProfile: any, mode: string): typeof addUpdateNewLoginProfile;
  }
}

function addUpdateNewLoginProfile(loginProfile: any, mode: string): void {
  cy.log(`START: Add/Update new ${loginProfile.name}`)
  cy.getByFormControlName('name').as('name').invoke('val').then(nameValue => {
    if (nameValue !== loginProfile.name) {
      cy.get('@name').clear().type(loginProfile.name)
    }
  })
  cy.getByFormControlName('description').as('description').invoke('val').then(descriptionValue => {
    if (loginProfile.description && descriptionValue !== loginProfile.description) {
      cy.get('@description').clear().type(loginProfile.description)
    }
  })
  cy.getByFormControlName('username').as('username').invoke('val').then(usernameValue => {
    if (usernameValue !== loginProfile.username) {
      cy.get('@username').clear().type(loginProfile.username)
    }
  })
  if (mode == 'add') {
    cy.getByFormControlName('password').as('password').invoke('val').then(passwordValue => {
      if (passwordValue !== loginProfile.password) {
        cy.get('@password').clear().type(loginProfile.password)
      }
    })
  } else {
    cy.getByFormControlName('updatePassword').as('updatePassword').invoke('val').then(updatePasswordValue => {
      if (updatePasswordValue !== loginProfile.updatePassword) {
        cy.get('@updatePassword').clear().type(loginProfile.updatePassword)
      }
    })
  }
  cy.get('mat-error').should('not.exist')
  cy.wait(3000)
  cy.getByDataCy('loginProfileEditForm').submit()
  cy.log(`END: Add/Update ${loginProfile.name}`)
}
Cypress.Commands.add('addUpdateNewLoginProfile', addUpdateNewLoginProfile);

// Delete record by name
declare namespace Cypress {
  interface Chainable<Subject = any> {
    deleteRecordByName(name: string, matToolTipName: string, isRowSelected: boolean): typeof deleteRecordByName;
  }
}

function deleteRecordByName(name: string, matToolTipName: string, isRowSelected: boolean): void {
  cy.log(`START: Delete ${name}`)
  cy.wait(2000)
  if (!isRowSelected) {
    cy.selectRowByName(name)
  }
  cy.getByMatToolTip(matToolTipName).click()
  cy.get('mat-dialog-container').should('exist')
  cy.wait(2000)
  cy.getButtonByTypeAndContent('submit', 'OK').click()
  cy.wait(2000)
  cy.get('mat-dialog-container').should('not.exist')
  cy.log(`END: Delete ${name} successfully`)
}
Cypress.Commands.add('deleteRecordByName', deleteRecordByName);


// Add new Connection Profile
declare namespace Cypress {
  interface Chainable<Subject = any> {
    addEditConnectionProfile(connectionProfile: any, mode: string): typeof addEditConnectionProfile;
  }
}

function addEditConnectionProfile(connectionProfile: any, mode: string): void {
  cy.log(`START: Add new Connection Profile ${connectionProfile.name}`)
  cy.getByFormControlName('name').as('name').invoke('val').then(value => {
    if (value !== connectionProfile.name) {
      cy.get('@name').clear().type(connectionProfile.name)
    }
  })
  if (connectionProfile.category) {
    cy.get('[data-cy=select-category]').click();
    cy.get(`mat-option[value="${connectionProfile.category}"]`).click()
  }
  cy.getByFormControlName('server').as('server').invoke('val').then(value => {
    if (value !== connectionProfile.server && connectionProfile.server) {
      cy.get('@server').clear().type(connectionProfile.server)
    }
  })
  cy.getByFormControlName('dataCenter').as('dataCenter').invoke('val').then(value => {
    if (value !== connectionProfile.datacenter && connectionProfile.datacenter) {
       cy.get('@dataCenter').clear().type(connectionProfile.datacenter)
    }
  })
  cy.getByFormControlName('cluster').as('cluster').invoke('val').then(value => {
    if (value !== connectionProfile.cluster && connectionProfile.cluster) {
      cy.get('@cluster').clear().type(connectionProfile.cluster)
    }
  })
  cy.getByFormControlName('dataStore').as('dataStore').invoke('val').then(value => {
    if (value !== connectionProfile.datastore && connectionProfile.datastore) {
      cy.get('@dataStore').clear().type(connectionProfile.datastore)
    }
  })
  if (connectionProfile.datastore_cluster == 'True') {
    cy.get('.checkbox-field').getByDataCy('connectionForm').get('[type="checkbox"]').check({ force: true }).should('be.checked')
  } else {
    cy.get('.checkbox-field').getByDataCy('connectionForm').get('[type="checkbox"]').uncheck({ force: true })
  }

  cy.getByFormControlName('switch').as('switch').invoke('val').then(value => {
    if (value !== connectionProfile.switch && connectionProfile.switch) {
      cy.get('@switch').clear().type(connectionProfile.switch)
    }
  })
  if (connectionProfile.switch_type) {
    cy.get('[data-cy=select-switch-type]').click();
    cy.get(`mat-option[value="${connectionProfile.switch_type}"]`).click()
      cy.getByFormControlName('managementNetwork').as('managementNetwork').invoke('val').then(value => {
      if (value !== connectionProfile.management_network && connectionProfile.management_network) {
        cy.get('@managementNetwork').clear().type(connectionProfile.management_network)
      }
    }) 
  }
  cy.getByFormControlName('username').as('username').invoke('val').then(value => {
    if (value !== connectionProfile.username && connectionProfile.username) {
      cy.get('@username').clear().type(connectionProfile.username)
    }
  })
  if (mode == 'add') {
    cy.getByFormControlName('password').as('password').invoke('val').then(value => {
      if (value !== connectionProfile.password) {
        cy.get('@password').clear().type(connectionProfile.password)
      }
    })
  } else {
    cy.getByFormControlName('updatePassword').as('updatePassword').invoke('val').then(value => {
      if (value !== connectionProfile.password) {
        cy.get('@updatePassword').clear().type(connectionProfile.password)
      }
    })
  }
  cy.get('mat-error').should('not.exist')
  cy.wait(2000)
  cy.getByDataCy('connectionForm').submit()
  cy.log(`END: Add/Update ${connectionProfile.name}`)

}

Cypress.Commands.add('addEditConnectionProfile', addEditConnectionProfile);



Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})




declare namespace Cypress {
  interface Chainable<Subject = any> {

/**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('username')
     */
getByDataCy(value: string): Chainable<JQuery<HTMLElement>>;

/**
 * Custom command to select DOM element form control name attribute.
 * @example cy.getByFormControlName('username')
 */
getByFormControlName(controlName: string): Chainable<JQuery<HTMLElement>>

/**
 * Custom command to select DOM element form control name attribute.
 * @example cy.getByMatToolTip('Add')
 */
getByMatToolTip(matTooltip: string): Chainable<JQuery<HTMLElement>>

/**
 * Custom command to select DOM element form control name attribute.
 * @example cy.getButtonByTypeAndContent('submit', 'OK')
 */
getButtonByTypeAndContent(buttonType: string, content: string): Chainable<JQuery<HTMLElement>>

/**
 * Custom command to select DOM element form control name attribute.
 * @example cy.getOptionByContent('content')
 */
getOptionByContent(content: string): Chainable<JQuery<HTMLElement>>

    Random_Name (text: string):Chainable<JQuery<HTMLElement>>


    getColorPickerByClass(value: string): Chainable<JQuery<HTMLElement>>


  }
}


Cypress.Commands.add(
  'getByDataCy',
  (id: string) => {
    cy.get(`[data-cy="${id}"]`)
  }
);

Cypress.Commands.add(
  'getByFormControlName',
  (controlName: string) => {
    cy.get(`[formControlName="${controlName}"]`)
  }
);


Cypress.Commands.add(
  'getByMatToolTip',
  (matTooltip: string) => {
    cy.get(`[matTooltip="${matTooltip}"]`)
  }
  );

  Cypress.Commands.add(
    'getButtonByTypeAndContent',
    (buttonType: string, content: string) => {
      cy.get(`button[type="${buttonType}"]`).contains(content)
    }
  );
  
  Cypress.Commands.add(
    'getOptionByContent',
    (content: string) => {
      cy.get('mat-option').contains(content)
    }
  );

  Cypress.Commands.add(
    'getColorPickerByClass',
    (value: string) => {
      cy.get(`${value} color-picker > div.color-picker.open > div.hex-text.ng-star-inserted > div.box > input`)
    }
  );
  