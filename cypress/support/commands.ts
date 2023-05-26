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
    addNewProject(project: any, isUsingDefaultNetwork: boolean): typeof addNewProject;
  }
}

function addNewProject(project: any, isUsingDefaultNetwork = true): void {
  cy.log('Add new project')
  cy.getByFormControlName('name').type(project.name).blur()
  cy.get('mat-error').should('not.exist')
  cy.getByFormControlName('description').type(project.description).blur()
  cy.getByFormControlName('category').children(`mat-radio-button[value="${project.category}"]`).click()
  cy.getByFormControlName('target').click().then(() => {
    cy.get('mat-option').contains(`${project.target}`).click()
  })
  cy.getByFormControlName('option').children(`mat-radio-button[value="${project.option}"]`).click()
  cy.getByFormControlName('enclave_number').clear().type(project.enclave_number).blur()
  cy.getByFormControlName('enclave_clients').clear().type(project.enclave_clients).blur()
  cy.getByFormControlName('enclave_servers').clear().type(project.enclave_servers).blur()
  cy.getByFormControlName('enclave_users').clear().type(project.enclave_users).blur()
  cy.getByFormControlName('vlan_min').clear().type(project.vlan_min).blur()
  cy.get('mat-error').should('not.exist')
  cy.getByFormControlName('vlan_max').clear().type(project.vlan_max).blur()
  cy.get('mat-error').should('not.exist')
  if (!isUsingDefaultNetwork) {
    cy.log('Delete all networks')
    cy.getByDataCy('btn-delete-network').each(($row) => {
      cy.wrap($row).click()
      cy.wait(1000)
      cy.get('mat-dialog-container').should('exist')
      cy.getButtonByTypeAndContent('submit', 'OK').click()
      cy.wait(1000)
    })
    cy.log('Re-add all networks')
    project.networks.map((network: any) => {
      cy.getByDataCy('btn-add-network').click()
      cy.get('.cy-category').last().dblclick().click().children().then(() => {
        cy.wait(1000)
        cy.get('span').contains(network.category).click()
      })
      cy.get('.cy-network').last().dblclick().type(network.network)
      cy.blurAllInputFocused()
      cy.get('.toast-warning').should('not.exist')
      if (network.reserved_ip) {
        cy.get('.cy-reserved-ip-address').last().dblclick().type(network.reserved_ip)
        cy.blurAllInputFocused()
        cy.get('.toast-warning').should('not.exist')
      }
      cy.wait(1000)
    })
  }
  cy.getByDataCy('projectForm').submit().log(`Create project ${project.name} successfully`)
  cy.scrollTo('top')
  cy.get('.toast-error').should('not.exist')
  cy.url().should('include', 'projects')
}
Cypress.Commands.add('addNewProject', addNewProject);

// Open project by name
declare namespace Cypress {
  interface Chainable<Subject = any> {
    openProjectByName(projectName: string): typeof openProjectByName;
  }
}

function openProjectByName(projectName: string): void {
  cy.visit('/projects')
  cy.wait(2000)
  cy.get('#search-project').type(projectName)
  cy.get('ag-grid-angular').contains(projectName).dblclick()
  cy.url().should('include', 'map')
  cy.wait(4000)
}
Cypress.Commands.add('openProjectByName', openProjectByName);


// Import project
declare namespace Cypress {
  interface Chainable<Subject = any> {
    importProject(filePath: string): typeof importProject;
  }
}

function importProject(filePath: string): void {
  cy.log(`Import project from ${filePath}`)
  cy.getByDataCy('btn-nav-project').should('exist').click()
  cy.wait(1000)
  cy.getByDataCy('btn-export-import-project').should('exist').click()
  cy.wait(1000)
  cy.getByDataCy('btn-import-project').should('exist').click()
  cy.get('input[type=file]').selectFile(`${filePath}`)
  cy.wait(1000)
  cy.getByDataCy('importForm').submit()
}
Cypress.Commands.add('importProject', importProject);

// Export project by name
declare namespace Cypress {
  interface Chainable<Subject = any> {
    exportProject(projectName: string, isProjectOpened: boolean): typeof exportProject;
  }
}

function exportProject(projectName: string, isProjectOpened: boolean): void {
  cy.log('Export project')
  if (!isProjectOpened) {
    cy.openProjectByName(projectName)
  }
  cy.getByDataCy('btn-nav-project').should('exist').click()
  cy.wait(1000)
  cy.getByDataCy('btn-export-import-project').should('exist').click()
  cy.wait(1000)
  cy.getByDataCy('btn-export-project').should('exist').click()
  cy.wait(1000)
  cy.getByDataCy('exportForm').submit()
}
Cypress.Commands.add('exportProject', exportProject);

// Clone Project to Template
declare namespace Cypress {
  interface Chainable<Subject = any> {
    cloneProjectToTemplate(projectName: string, isProjectOpened: boolean): typeof cloneProjectToTemplate;
  }
}

function cloneProjectToTemplate(projectName: string, isProjectOpened: boolean): void {
  cy.log('Clone Project to Template')
  if (!isProjectOpened) {
    cy.openProjectByName(projectName)
  }
  cy.getByDataCy('btn-nav-project').should('exist').click()
  cy.getByDataCy('btn-new-clone-project').should('exist').click()
  cy.getByDataCy('btn-clone-project').should('exist').click()
  cy.getByFormControlName('categoryCtr').children('mat-radio-button[value="template"]').click()
  cy.wait(1000)
  cy.getButtonByTypeAndContent('submit', 'Clone').click()
}
Cypress.Commands.add('cloneProjectToTemplate', cloneProjectToTemplate);

// Blur all input has been focused
declare namespace Cypress {
  interface Chainable<Subject = any> {
    blurAllInputFocused(): typeof blurAllInputFocused;
  }
}

function blurAllInputFocused(): void {
  cy.log('Blur all input has been focused')
  cy.focused().then(($el) => {
    cy.wrap($el).type(`{enter}`)
  })
}
Cypress.Commands.add('blurAllInputFocused', blurAllInputFocused);

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

declare namespace Cypress {
  interface Chainable<Subject = any> {
    addBGPConfigTemplate(configTemplate: any, networksInvalid: any, metric: any): typeof addBGPConfigTemplate;
  }
}
function addBGPConfigTemplate(configTemplate: any, networksInvalid: any, metric: any): void {
  cy.log(`START: Add ${configTemplate.name} Config`)
  if (networksInvalid) {
    // START: Validation Networks
    cy.getByFormControlName('ipCtr').as('ipCtr').invoke('val').then(nameValue => {
      if (nameValue !== networksInvalid) {
        cy.get('@ipCtr').clear().type(networksInvalid)
      }
    })
    const BGPAsnCtr = configTemplate.bgp[0].asn
    cy.getByFormControlName('asnCtr').as('asnCtr').invoke('val').then(nameValue => {
      if (nameValue !== BGPAsnCtr) {
        cy.get('@asnCtr').clear().type(BGPAsnCtr)
      }
    })

    cy.getByFormControlName('neighborIpCtr').as('neighborIpCtr').invoke('val').then(nameValue => {
      if (nameValue !== networksInvalid) {
        cy.get('@neighborIpCtr').clear().type(networksInvalid)
      }
    })

    const BGPNeighborAsnCtrTest = configTemplate.bgp[0].neighbor_asn
    cy.getByFormControlName('neighborAsnCtr').as('neighborAsnCtr').invoke('val').then(nameValue => {
      if (nameValue !== BGPNeighborAsnCtrTest) {
        cy.get('@neighborAsnCtr').clear().type(BGPNeighborAsnCtrTest)
      }
    })

    cy.get('mat-error').should('exist')
    cy.getByDataCy('btn-add-bgp').should("be.disabled")
    cy.wait(3000)
    // END
  } else if (metric) {
    const bgpConnectedMetricInvalid = metric.metric
    cy.getByFormControlName('bgpConnectedMetricCtr').as('bgpConnectedMetricCtr').invoke('val').then(nameValue => {
      if (nameValue !== bgpConnectedMetricInvalid) {
        cy.get('@bgpConnectedMetricCtr').clear().type(bgpConnectedMetricInvalid)
      }
    })
    
    const bgpOSPFStateValid = configTemplate.bgp[0].redistribute.ospf.state
    if (bgpOSPFStateValid) {
      cy.get('.cy-bgp-ospfState span input[type="checkbox"]').check({ force: true }).should('be.checked')
    } else {
      cy.get('.cy-bgp-ospfState span input[type="checkbox"]').uncheck({ force: true })
    }

    cy.get('mat-error').should('exist')
    cy.getByDataCy('btn-add-bgp').should("be.disabled")
    cy.wait(3000)

  } else {
    const ip = configTemplate.bgp[0].ip_address
    cy.getByFormControlName('ipCtr').as('ipCtr').invoke('val').then(nameValue => {
      if (nameValue !== ip) {
        cy.get('@ipCtr').clear().type(ip)
      }
    })

    const BGPAsnCtr = configTemplate.bgp[0].asn
    cy.getByFormControlName('asnCtr').as('asnCtr').invoke('val').then(nameValue => {
      if (nameValue !== BGPAsnCtr) {
        cy.get('@asnCtr').clear().type(BGPAsnCtr)
      }
    })

    cy.getByFormControlName('neighborIpCtr').as('neighborIpCtr').invoke('val').then(nameValue => {
      if (nameValue !== configTemplate.bgp[0].neighbor_ip) {
        cy.get('@neighborIpCtr').clear().type(configTemplate.bgp[0].neighbor_ip)
      }
    })

    const BGPNeighborAsnCtr = configTemplate.bgp[0].neighbor_asn
    cy.getByFormControlName('neighborAsnCtr').as('neighborAsnCtr').invoke('val').then(nameValue => {
      if (nameValue !== BGPNeighborAsnCtr) {
        cy.get('@neighborAsnCtr').clear().type(BGPNeighborAsnCtr)
      }
    })

    const bgpConnectedState = configTemplate.bgp[0].redistribute.connected.state
    if (bgpConnectedState) {
      cy.get('.cy-bgp-connectedState span input[type="checkbox"]').check({ force: true }).should('be.checked')
    } else {
      cy.get('.cy-bgp-connectedState span input[type="checkbox"]').uncheck({ force: true })
    }

    const bgpConnectedMetric = configTemplate.bgp[0].redistribute.connected.metric
    cy.getByFormControlName('bgpConnectedMetricCtr').as('bgpConnectedMetricCtr').invoke('val').then(nameValue => {
      if (nameValue !== bgpConnectedMetric) {
        cy.get('@bgpConnectedMetricCtr').clear().type(bgpConnectedMetric)
      }
    })

    const bgpOSPFState = configTemplate.bgp[0].redistribute.ospf.state
    if (bgpOSPFState) {
      cy.get('.cy-bgp-ospfState span input[type="checkbox"]').check({ force: true }).should('be.checked')
    } else {
      cy.get('.cy-bgp-ospfState span input[type="checkbox"]').uncheck({ force: true })
    }

    const bgpOSPFMetric = configTemplate.bgp[0].redistribute.ospf.metric
    cy.getByFormControlName('bgpOspfMetricCtr').as('bgpOspfMetricCtr').invoke('val').then(nameValue => {
      if (nameValue !== bgpOSPFMetric) {
        cy.get('@bgpOspfMetricCtr').clear().type(bgpOSPFMetric)
      }
    })

    cy.get('mat-error').should('not.exist')
    cy.getByDataCy('bgpForm').as('bgpForm').submit()
    cy.get('mat-error').should('not.exist')
    cy.getByDataCy('configTemplateForm').as('configTemplateForm').submit()
    cy.wait(3000)
  }
}
Cypress.Commands.add('addBGPConfigTemplate', addBGPConfigTemplate);


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
    const ospfBGPMetricTypeValid = configTemplate.ospf[0].redistibution.bgp.metric_type
    cy.getByFormControlName('bgpMetricTypeCtr').click();
    cy.getOptionByContent(ospfBGPMetricTypeValid).click();
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
    const bgp = configTemplate.ospf[0].redistibution.bgp.state
    if (bgp) {
      cy.get('.cy-ospf-bgpState span input[type="checkbox"]').check({ force: true }).should('be.checked')
    } else {
      cy.get('.cy-ospf-bgpState span input[type="checkbox"]').uncheck({ force: true })
    }

    const ospfBGPMetricType = configTemplate.ospf[0].redistibution.bgp.metric_type
    cy.getByFormControlName('bgpMetricTypeCtr').click();
    cy.getOptionByContent(ospfBGPMetricType).click();

    const ospfConnectedState = configTemplate.ospf[0].redistibution.connected.state
    if (ospfConnectedState) {
      cy.get('.cy-ospf-connectedState span input[type="checkbox"]').check({ force: true }).should('be.checked')
    } else {
      cy.get('.cy-ospf-connectedState span input[type="checkbox"]').uncheck({ force: true })
    }

    const ospfConnectedMetricType = configTemplate.ospf[0].redistibution.connected.metric_type
    cy.getByFormControlName('connectedMetricTypeCtr').click();
    cy.getOptionByContent(ospfConnectedMetricType).click();

    const ospfStaticState = configTemplate.ospf[0].redistibution.static.state
    if (ospfStaticState) {
      cy.get('.cy-ospf-staticState span input[type="checkbox"]').check({ force: true }).should('be.checked')
    } else {
      cy.get('.cy-ospf-staticState span input[type="checkbox"]').uncheck({ force: true })
    }

    const ospfStaticMetricType = configTemplate.ospf[0].redistibution.static.metric_type
    cy.getByFormControlName('staticMetricTypeCtr').click();
    cy.getOptionByContent(ospfStaticMetricType).click();

    cy.get('mat-error').should('not.exist')
    cy.getByDataCy('ospfForm').as('ospfForm').submit()
    cy.get('mat-error').should('not.exist')
    cy.getByDataCy('configTemplateForm').as('configTemplateForm').submit()
    cy.wait(3000)
  }
}

Cypress.Commands.add('addOspfConfigTemplate', addOspfConfigTemplate);

declare namespace Cypress {
  interface Chainable<Subject = any> {
    editOspfAndBgpConfigTemplate(configTemplate: any, newValue: any, defaultConfig: any, validation: boolean): typeof editOspfAndBgpConfigTemplate;
  }
}

function editOspfAndBgpConfigTemplate(configTemplate: any, newValue: any, defaultConfig: any, validation: boolean): void {
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
  Object.entries(newValue).forEach(([key, value]) => {
    defaultConfig[key] = value
  })
  cy.wait(2000)
  cy.get('.ace_text-input').focus().clear({force: true})
  cy.wait(2000)
  cy.get('.ace_text-input').type(JSON.stringify(defaultConfig, null, 2), { force: true })
  cy.get('mat-error').should('not.exist')
  cy.getByDataCy('configTemplateForm').as('configTemplateForm').submit()
  cy.wait(2000)
  if (validation) {
    cy.get('.toast-warning').should('exist')
    cy.log(`END: Edited ${configTemplate.name} Config`)
    cy.wait(2000)
    cy.get('mat-dialog-container').should('exist')
  } else {
    cy.get('.toast-warning').should('not.exist')
    cy.log(`END: Edited ${configTemplate.name} Config`)
    cy.wait(2000)
    cy.get('mat-dialog-container').should('not.exist')
  }
}
Cypress.Commands.add('editOspfAndBgpConfigTemplate', editOspfAndBgpConfigTemplate);



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
    cy.getByDataCy('connectionForm').get('mat-checkbox span input[type="checkbox"]').check({ force: true }).should('be.checked')
  } else {
    cy.getByDataCy('connectionForm').get('mat-checkbox span input[type="checkbox"]').uncheck({ force: true })
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
    }
  })
  cy.getByFormControlName('privateNetworkCtr').as('privateNetworkCtr').invoke('val').then(value => {
    if (value !== privateNetwork && privateNetwork) {
      cy.get('@privateNetworkCtr').clear().type(privateNetwork)
    }
  })
  cy.getByFormControlName('privateNetworkIPsCtr').as('privateNetworkIPsCtr').invoke('val').then(value => {
    if (value !== privateNetworkIps && privateNetworkIps) {
      cy.get('@privateNetworkIPsCtr').clear().type(privateNetworkIps)
    }
  })
  cy.getByFormControlName('managementNetworkCtr').as('managementNetworkCtr').invoke('val').then(value => {
    cy.get('@managementNetworkCtr').clear().type(appPreferences.management_network)
  })
  cy.getByFormControlName('dhcpServerCtr').as('dhcpServerCtr').invoke('val').then(value => {
    cy.get('@dhcpServerCtr').clear().type(appPreferences.dhcp_server)
  })
  cy.log(`END: Update App Preferences`)
}

Cypress.Commands.add('updateAppPreferences', updateAppPreferences);

declare namespace Cypress {
  interface Chainable<Subject = any> {
    addUpdateMapPreferences(mapPreferences: any): typeof addUpdateMapPreferences;
  }
}

function calcArrowsSlider(targetValue: any, currentValue: any) {
  const arrows = targetValue > currentValue ? '{rightarrow}'.repeat((targetValue - currentValue)) : targetValue < currentValue ? '{leftArrow}'.repeat((currentValue - targetValue)) : `${currentValue}`;
  return arrows
}

function addUpdateMapPreferences (mapPreferences: any) {
  cy.log(`START: Add/Update new ${mapPreferences.name}`)
  cy.getByFormControlName('name').as('name').invoke('val').then(val => {
    cy.get('@name').clear().type(mapPreferences.name)
  })
  cy.get('#gbColor').click()
  cy.getColorPickerByClass('.gb-color').clear().type(mapPreferences.group_box_color)
  cy.getByFormControlName('gbOpacity').as('gbOpacity').then(value =>{
    cy.get('@gbOpacity').type(calcArrowsSlider(mapPreferences.group_box_opacity * 100, 50))
  })
  cy.get('[data-cy=gbBorder]').click();
  cy.getOptionByContent(mapPreferences.group_box_border.charAt(0).toUpperCase() + mapPreferences.group_box_border.slice(1)).click();

  cy.get('#groupBoxBorderColor').click()
  cy.getColorPickerByClass('.gb-border-color').clear().type(mapPreferences.group_box_border_color)

  cy.get('#portGroupColor').click()
  cy.getColorPickerByClass('.pg-color').clear().type(mapPreferences.port_group_color)

  cy.getByFormControlName('pgSizeCtr').as('pgSizeCtr').then(value =>{
    cy.get('@pgSizeCtr').type(calcArrowsSlider(mapPreferences.port_group_size, 50))
  })

  cy.get('#edgeColor').click()
  cy.getColorPickerByClass('.edge-color').clear().type(mapPreferences.edge_color)
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
  cy.getColorPickerByClass('.text-color').clear().type(mapPreferences.text_color)

  cy.getByFormControlName('textHorizontalAlignmentCtr').click();
  cy.getOptionByContent(mapPreferences.text_halign.charAt(0).toUpperCase() + mapPreferences.text_halign.slice(1)).click();

  cy.getByFormControlName('textVerticalAlignmentCtr').click();
  cy.getOptionByContent(mapPreferences.text_valign.charAt(0).toUpperCase() + mapPreferences.text_valign.slice(1)).click();

  cy.get('#TextBG').click()
  cy.getColorPickerByClass('.text-bg').clear().type(mapPreferences.text_bg_color)

  cy.getByFormControlName('textBgOpacityCtr').as('textBgOpacityCtr').then(value =>{
    cy.get('@textBgOpacityCtr').type(calcArrowsSlider(mapPreferences.text_bg_opacity * 100, 50))
  })

  if (mapPreferences.grid_enabled) {
    cy.getByDataCy('mapPrefForm').get('.cy-map-grid > mat-checkbox span input[type="checkbox"]').check({ force: true }).should('be.checked')
  } else {
    cy.getByDataCy('mapPrefForm').get('.cy-map-grid > mat-checkbox span input[type="checkbox"]').uncheck({ force: true })
  }

  cy.getByFormControlName('gridSpacingCtr').as('gridSpacingCtr').then(value =>{
    if (mapPreferences.grid_spacing === 149) {
      cy.get('@gridSpacingCtr').type('{leftArrow}'.repeat((149)))
      cy.get('@gridSpacingCtr').type('{rightArrow}'.repeat((mapPreferences.grid_spacing - 50)))
    } else {
      cy.get('@gridSpacingCtr').type(calcArrowsSlider(mapPreferences.grid_spacing, 149))
    }
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
    if (mapPreferences.scale_image > 100) {
      cy.get('@mapImageSizeCtr').type(calcArrowsSlider(mapPreferences.scale_image, 100))
    } else {
      cy.get('@mapImageSizeCtr').type('{leftArrow}'.repeat((100)))
      cy.get('@mapImageSizeCtr').type('{rightArrow}'.repeat((mapPreferences.scale_image - 20)))
    }
  })

  cy.get('mat-error').should('not.exist')
  cy.wait(2000)
  cy.getByDataCy('mapPrefForm').submit()
  cy.log(`END: Add/Update new ${mapPreferences.name}`)
}
Cypress.Commands.add('addUpdateMapPreferences', addUpdateMapPreferences);


Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

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
