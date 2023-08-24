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
  cy.wait(3000)
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
  cy.waitingLoadingFinish()
  cy.log('Add new project')
  cy.getByFormControlName('name').focus().type(project.name).blur()
  cy.checkingMatErrorIsExistOrNot(false)
  cy.getByFormControlName('description').focus().type(project.description).blur()
  cy.waitingLoadingFinish()
  cy.getByFormControlName('category').children(`mat-radio-button[value="${project.category}"]`).click()
  cy.getByFormControlName('target').click().then(() => {
    cy.get('mat-option').contains(`${project.target}`).click()
  })
  cy.getByFormControlName('option').children(`mat-radio-button[value="${project.option}"]`).click()
  if (project.option != 'blank') {
    cy.getByFormControlName('enclave_number').clear().type(project.enclave_number).blur()
    cy.getByFormControlName('enclave_clients').clear().type(project.enclave_clients).blur()
    cy.getByFormControlName('enclave_servers').clear().type(project.enclave_servers).blur()
    cy.getByFormControlName('enclave_users').clear().type(project.enclave_users).blur()
  }
  cy.getByFormControlName('vlan_min').clear().type(project.vlan_min).blur()
  cy.checkingMatErrorIsExistOrNot(false)
  cy.getByFormControlName('vlan_max').clear().type(project.vlan_max).blur()
  cy.checkingMatErrorIsExistOrNot(false)
  if (!isUsingDefaultNetwork) {
    cy.log('Delete all networks')
    cy.getByDataCy('btn-delete-network').each(($row) => {
      cy.wrap($row).click()
      cy.wait(1000)
      cy.getButtonByTypeAndContent('submit', 'OK').click()
      cy.checkingToastSuccess()
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
  cy.checkingToastSuccess()
}
Cypress.Commands.add('addNewProject', addNewProject);

// Open project by name
declare namespace Cypress {
  interface Chainable<Subject = any> {
    openProjectByName(projectName: string): typeof openProjectByName;
  }
}

function openProjectByName(projectName: string): void {
  cy.url().then(url => {
    if (!url.includes('project')) {
      cy.visit('/projects')
    }
  })
  cy.waitingLoadingFinish()
  cy.get('#search-project').type(projectName)
  cy.get('ag-grid-angular').contains(projectName, { timeout: 10000 }).first().dblclick()
  cy.waitingLoadingFinish()
  cy.get('#cy', { timeout: 10000 }).should('exist')
  cy.url().should('include', 'map')
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
  cy.waitingLoadingFinish()
  cy.getByDataCy('btn-nav-project').should('exist').click()
  cy.getByDataCy('btn-export-import-project').should('exist').click()
  cy.wait(1000)
  cy.getByDataCy('btn-import-project').should('exist').click()
  cy.get('input[type=file]').selectFile(`${filePath}`)
  cy.getByDataCy('importForm').submit()
  cy.checkingToastSuccess()
  cy.log(`Imported project from ${filePath}`)
}
Cypress.Commands.add('importProject', importProject);

// Export project by name
declare namespace Cypress {
  interface Chainable<Subject = any> {
    exportProject(projectName: string, isProjectOpened: boolean, newFileName?: string): typeof exportProject;
  }
}

function exportProject(projectName: string, isProjectOpened: boolean, newFileName?: string): void {
  cy.log('Export project')
  if (!isProjectOpened) {
    cy.openProjectByName(projectName)
  }
  cy.waitingLoadingFinish()
  cy.getByDataCy('btn-nav-project').should('exist').click()
  cy.getByDataCy('btn-export-import-project').should('exist').click()
  cy.getByDataCy('btn-export-project').should('exist').click()
  if (newFileName) {
    cy.getByFormControlName('fileNameCtr').focus().clear().type(newFileName)
  }
  cy.getByDataCy('exportForm').submit()
  cy.checkingToastSuccess()
  cy.log('Exported project')
}
Cypress.Commands.add('exportProject', exportProject);


// Delete project by name
declare namespace Cypress {
  interface Chainable<Subject = any> {
    deleteProject(projectName: string, isProjectOpened: boolean): typeof deleteProject;
  }
}

function deleteProject(projectName: string, isProjectOpened: boolean): void {
  cy.log('Delete project')
  if (!isProjectOpened) {
    cy.openProjectByName(projectName)
  }
  cy.waitingLoadingFinish()
  cy.getByDataCy('btn-nav-project').should('exist').click()
  cy.wait(1000)
  cy.getByDataCy('btn-delete-project').should('exist').click()
  cy.wait(1000)
  cy.getButtonByTypeAndContent('submit', 'Delete').click()
  cy.checkingToastSuccess()
}
Cypress.Commands.add('deleteProject', deleteProject);

// Permanently delete project by name
declare namespace Cypress {
  interface Chainable<Subject = any> {
      deletePermanentlyProject(projectName: string, isDeleteAllProjects: boolean): typeof deletePermanentlyProject;
  }
}

function deletePermanentlyProject(projectName: string, isDeleteAllProjects: boolean): void {
  cy.log('Permanently Delete project')
  cy.waitingLoadingFinish()
  cy.getByDataCy('btn-nav-project').should('exist').click()
  cy.getByDataCy('btn-delete-permanently-project').should('exist').click()
  cy.waitingLoadingFinish()
  if (isDeleteAllProjects) {
    cy.get('.ag-header-cell').first().click()
  } else {
    cy.get('.ag-row').contains(projectName).first().click({ force: true });
  }
  cy.get('.actions').click()
  cy.getButtonByTypeAndContent('button', 'Permanent Delete').click()
  cy.getButtonByTypeAndContent('submit', 'Delete').click()
  cy.checkingToastSuccess()
  cy.log('Permanently Delete project successfully')

}
Cypress.Commands.add('deletePermanentlyProject', deletePermanentlyProject);


// Clone Project to Template
declare namespace Cypress {
  interface Chainable<Subject = any> {
    cloneProject(projectName: string, option: string, isProjectOpened: boolean): typeof cloneProject;
  }
}

function cloneProject(projectName: string, option: string, isProjectOpened: boolean): void {
  cy.log('Clone Project to Template')
  if (!isProjectOpened) {
    cy.openProjectByName(projectName)
  }
  cy.waitingLoadingFinish()
  cy.getByDataCy('btn-nav-project').should('exist').click()
  cy.getByDataCy('btn-new-clone-project').should('exist').click()
  cy.getByDataCy('btn-clone-project').should('exist').click()
  cy.getByFormControlName('nameCtr').clear().type(`${projectName} clone`)
  cy.getByFormControlName('categoryCtr').children(`mat-radio-button[value=${option}]`).click()
  cy.getButtonByTypeAndContent('submit', 'Clone').click()
  cy.checkingToastSuccess()
}
Cypress.Commands.add('cloneProject', cloneProject);

// Update Project to Template
declare namespace Cypress {
  interface Chainable<Subject = any> {
    updateProjectToTemplate(projectName: string, isProjectOpened: boolean): typeof updateProjectToTemplate;
  }
}

function updateProjectToTemplate(projectName: string, isProjectOpened: boolean): void {
  cy.log('Update Project to Template')
  if (!isProjectOpened) {
    cy.openProjectByName(projectName)
  }
  cy.waitingLoadingFinish()
  cy.getByDataCy('btn-nav-project').should('exist').click()
  cy.getByDataCy('btn-edit-project').should('exist').click()
  cy.waitingLoadingFinish()
  cy.getByFormControlName('categoryCtr').children('mat-radio-button[value="template"]').click()
  cy.getButtonByTypeAndContent('submit', 'Update').click()
  cy.checkingToastSuccess()
  cy.get('mat-dialog-container').should('not.exist')
}
Cypress.Commands.add('updateProjectToTemplate', updateProjectToTemplate);

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

// Import Login Profile
declare namespace Cypress {
  interface Chainable<Subject = any> {
    importLoginProfile(filePath: string, validation: boolean): typeof importLoginProfile;
  }
}

function importLoginProfile(filePath: string, validation: boolean): void {
  cy.log(`Import login profiles from ${filePath}`)
  cy.getByFormControlName('fileCtr').click({ force: true })
  cy.get('input[type=file]').selectFile(`${filePath}`)
  if (validation) {
    cy.checkingMatErrorIsExistOrNot(true)
  } else {
    cy.checkingMatErrorIsExistOrNot(false)
    cy.getByDataCy('importForm').submit()
    cy.checkingToastSuccess()
    cy.log(`Imported login profiles from ${filePath}`)
  }
}
Cypress.Commands.add('importLoginProfile', importLoginProfile);


// add update import Images/Icon
declare namespace Cypress {
  interface Chainable<Subject = any> {
    actionImages(data: any, mode: string, category: string, validation: boolean): typeof actionImages;
  }
}

function actionImages(data: any, mode: string, category: string, validation: boolean): void {
  cy.log(`Add/update ${category} from ${data.filePath}`)
  const cySubmitForm = category === 'images' ? 'imageForm' : category === 'icon' ? 'iconForm' : 'importForm'
  if (mode !== 'import') {
    cy.getByFormControlName('name').as('name').invoke('val').then(value => {
      if (data.name !== value) {
        cy.get('@name').clear().type(data.name);
      }
    })
  }
  cy.getByFormControlName('fileCtr').click({ force: true })
  cy.get('input[type=file]').selectFile(`${data.filePath}`)
  if (!validation) {
    cy.checkingMatErrorIsExistOrNot(false)
    cy.getByDataCy(`${cySubmitForm}`).submit()
    cy.log(`Add/update ${category} from ${data.filePath}`)
    cy.wait(2000)
    cy.get('mat-dialog-container').should('not.exist')
  } else {
    cy.checkingMatErrorIsExistOrNot(true)
  }
}
Cypress.Commands.add('actionImages', actionImages);

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
  cy.checkingMatErrorIsExistOrNot(false)
  cy.getByDataCy('configTemplateForm').submit()
  cy.checkingToastSuccess()
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
  cy.get('.ace_content').first().then((aceContentEle: any) => {
    let aceContent = JSON.parse(aceContentEle[0].textContent)
    Object.entries(newValue).forEach(([key, value]) => {
      aceContent[key] = value
    })
    cy.wait(1000)
    cy.get('.ace_text-input').focus().clear({force: true})
    cy.wait(1000)
    cy.get('.ace_text-input').type(JSON.stringify(aceContent, null, 2), { force: true })
  })
  cy.checkingMatErrorIsExistOrNot(false)
  cy.getByDataCy('configTemplateForm').as('configTemplateForm').submit()
  cy.checkingToastSuccess()
  cy.log(`END: Edited ${configTemplate.name} Config`)
}
Cypress.Commands.add('editConfigTemplate', editConfigTemplate);

// Open Device/Template page
declare namespace Cypress {
  interface Chainable<Subject = any> {
    openPageInDevicesNav(pageName: string): typeof openPageInDevicesNav;
  }
}

function openPageInDevicesNav(pageName: string): void {
  cy.visit('/')
  cy.waitingLoadingFinish()
  cy.getByDataCy('btn-devices').click()
  cy.get('button>span').contains(pageName).click()
  cy.waitingLoadingFinish()
}
Cypress.Commands.add('openPageInDevicesNav', openPageInDevicesNav);

// Open Administration page
declare namespace Cypress {
  interface Chainable<Subject = any> {
    openPageInAdministrationNav(pageName: string): typeof openPageInAdministrationNav;
  }
}

function openPageInAdministrationNav(pageName: string): void {
  cy.visit('/')
  cy.waitingLoadingFinish()
  cy.getByDataCy('btn-admin').click()
  cy.get('button>span').contains(pageName).click()
  cy.waitingLoadingFinish()

}
Cypress.Commands.add('openPageInAdministrationNav', openPageInAdministrationNav);

// Select Device
declare namespace Cypress {
  interface Chainable<Subject = any> {
    selectDeviceByName(deviceName: string): typeof selectDeviceByName;
  }
}

function selectDeviceByName(deviceName: string): void {
  cy.get('.table__nav--search input').first().clear({force: true}).type(deviceName)
  cy.wait(1000)
  cy.get('.ag-row').contains(new RegExp(`^(${deviceName})`, "g")).first().click({ force: true })
}
Cypress.Commands.add('selectDeviceByName', selectDeviceByName);

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
    cy.checkingMatErrorIsExistOrNot(true)
    cy.getByDataCy('btn-add-bgp').should("be.disabled")
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
    cy.checkingMatErrorIsExistOrNot(true)
    cy.getByDataCy('btn-add-bgp').should("be.disabled")

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

    cy.checkingMatErrorIsExistOrNot(false)
    cy.getByDataCy('bgpForm').as('bgpForm').submit()
    cy.checkingMatErrorIsExistOrNot(false)
    cy.getByDataCy('configTemplateForm').as('configTemplateForm').submit()
    cy.checkingToastSuccess()
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
    const ospfBGPMetricTypeValid = configTemplate.ospf[0].redistribute.bgp.metric_type
    cy.getByFormControlName('bgpMetricTypeCtr').click();
    cy.getOptionByContent(ospfBGPMetricTypeValid).click();
    cy.checkingMatErrorIsExistOrNot(true)
    cy.getByDataCy('btn-add-ospf').should("be.disabled")
    // END
  } else {
    const networks = (configTemplate.ospf[0].networks).join()
    cy.getByFormControlName('networksCtr').as('networksCtr').invoke('val').then(nameValue => {
      if (nameValue !== networks) {
        cy.get('@networksCtr').clear().type(networks)
      }
    })
    const bgp = configTemplate.ospf[0].redistribute.bgp.state
    if (bgp) {
      cy.get('.cy-ospf-bgpState span input[type="checkbox"]').check({ force: true }).should('be.checked')
    } else {
      cy.get('.cy-ospf-bgpState span input[type="checkbox"]').uncheck({ force: true })
    }

    const ospfBGPMetricType = configTemplate.ospf[0].redistribute.bgp.metric_type
    cy.getByFormControlName('bgpMetricTypeCtr').click();
    cy.getOptionByContent(ospfBGPMetricType).click();

    const ospfConnectedState = configTemplate.ospf[0].redistribute.connected.state
    if (ospfConnectedState) {
      cy.get('.cy-ospf-connectedState span input[type="checkbox"]').check({ force: true }).should('be.checked')
    } else {
      cy.get('.cy-ospf-connectedState span input[type="checkbox"]').uncheck({ force: true })
    }

    const ospfConnectedMetricType = configTemplate.ospf[0].redistribute.connected.metric_type
    cy.getByFormControlName('connectedMetricTypeCtr').click();
    cy.getOptionByContent(ospfConnectedMetricType).click();

    const ospfStaticState = configTemplate.ospf[0].redistribute.static.state
    if (ospfStaticState) {
      cy.get('.cy-ospf-staticState span input[type="checkbox"]').check({ force: true }).should('be.checked')
    } else {
      cy.get('.cy-ospf-staticState span input[type="checkbox"]').uncheck({ force: true })
    }

    const ospfStaticMetricType = configTemplate.ospf[0].redistribute.static.metric_type
    cy.getByFormControlName('staticMetricTypeCtr').click();
    cy.getOptionByContent(ospfStaticMetricType).click();

    cy.checkingMatErrorIsExistOrNot(false)
    cy.getByDataCy('ospfForm').as('ospfForm').submit()
    cy.checkingToastSuccess()
    cy.checkingMatErrorIsExistOrNot(false)
    cy.getByDataCy('configTemplateForm').as('configTemplateForm').submit()
    cy.checkingToastSuccess()
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

  Object.entries(newValue).forEach(([key, value]) => {
    defaultConfig[key] = value
  })
  cy.get('.ace_text-input').focus().clear({force: true})
  cy.get('.ace_text-input').type(JSON.stringify(defaultConfig, null, 2), {force: true})
  cy.checkingMatErrorIsExistOrNot(false)
  cy.getByDataCy('configTemplateForm').as('configTemplateForm').submit()
  if (validation) {
    cy.checkingIsToastWarningExistOrNot(true)
    cy.log(`END: Edited ${configTemplate.name} Config`)
  } else {
    cy.checkingIsToastWarningExistOrNot(false)
    cy.log(`END: Edited ${configTemplate.name} Config`)
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
  cy.waitingLoadingFinish()
  cy.get('input[type="search"]').as('searchInput').focus().type(name)
  cy.get('.ag-row').contains(name, {timeout: 5000}).first().click({ force: true }).type(" ");
  cy.get('@searchInput').clear({ force: true })
}
Cypress.Commands.add('selectRowByName', selectRowByName);

// Showing edit form by name
declare namespace Cypress {
  interface Chainable<Subject = any> {
    showFormEditByName(name: string): typeof showFormEditByName;
  }
}

function showFormEditByName(name: string): void {
  cy.waitingLoadingFinish()
  cy.get('input[type="search"]').as('searchInput').focus().type(name)
  cy.get('.ag-row').contains(name).first().dblclick({ force: true })
  cy.get('@searchInput').clear({ force: true })
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
  cy.waitingLoadingFinish()
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
  cy.checkingMatErrorIsExistOrNot(false)
  cy.getByDataCy('loginProfileEditForm').submit()
  cy.checkingToastSuccess()
  cy.log(`END: Add/Update ${loginProfile.name}`)
}
Cypress.Commands.add('addUpdateNewLoginProfile', addUpdateNewLoginProfile);

// Add/update a role
declare namespace Cypress {
  interface Chainable<Subject = any> {
    addUpdateRole(role: any, mode?: string): typeof addUpdateRole;
  }
}

function addUpdateRole(role: any,  mode: string = 'add'): void {
  cy.log(`START: Add/Update new ${role.name}`)
  const buttonContent = mode === 'add' ? 'Create' : 'Update'
  cy.getByFormControlName('nameCtr').as('name').invoke('val').then(nameValue => {
    if (nameValue !== role.name) {
      cy.get('@name').clear().type(role.name)
    }
  })
  cy.checkingMatErrorIsExistOrNot(false)
  if (mode !== 'add') {
    cy.get('.pull-left').last().click()
    cy.getButtonByTypeAndContent('button', 'Remove').click()
  }
  if (role.permissions.length > 0) {
    role.permissions.map((roleName: string) => {
      cy.get('dual-list ul li label').contains(roleName).click()
    })
  }
  cy.checkingMatErrorIsExistOrNot(false)
  cy.getButtonByTypeAndContent('button', 'Add').click()
  cy.wait(1000)
  cy.getButtonByTypeAndContent('submit', buttonContent).click()
  cy.checkingToastSuccess()
  cy.log(`END: Add/Update ${role.name}`)
}
Cypress.Commands.add('addUpdateRole', addUpdateRole);

// // Add/update a user
declare namespace Cypress {
  interface Chainable<Subject = any> {
    addUpdateUser(user: any, mode?: string): typeof addUpdateUser;
  }
}

function addUpdateUser(user: any,  mode: string = 'add'): void {
  cy.log(`START: Add/Update new ${user.first_name} ${user.last_name}`)
  const buttonContent = mode === 'add' ? 'Create' : 'Update'
  cy.getByFormControlName('firstNameCtr').as('firstName').invoke('val').then(firstName => {
    if (firstName !== user.firstName) {
      cy.get('@firstName').clear().type(user.first_name)
    }
  })

  cy.getByFormControlName('lastNameCtr').as('lastName').invoke('val').then(lastName => {
    if (lastName !== user.last_name) {
      cy.get('@lastName').clear().type(user.last_name)
    }
  })

  cy.getByFormControlName('userNameCtr').as('userName').invoke('val').then(userName => {
    if (userName !== user.username) {
      cy.get('@userName').clear().type(user.username)
    }
  })

  if (user.active) {
    cy.getByFormControlName('activeCtr').get('mat-checkbox span input[type="checkbox"]').check({force: true})
  } else {
    cy.getByFormControlName('activeCtr').get('mat-checkbox span input[type="checkbox"]').uncheck({force: true})
  }

  cy.getByFormControlName('emailCtr').as('email').invoke('val').then(email => {
    if (email !== user.email) {
      cy.get('@email').clear().type(user.email)
    }
  })

  if (mode !== 'add') {
    cy.get('mat-chip-list mat-chip').each((chip: any) => {
      chip.wrap().find('button mat-icon').click()
    })
  }
  user.role.map((role: string) => {
    cy.getByFormControlName('roleCtr').first().click()
    cy.get('.mat-option-text').contains(role).first().click()
  })

  if (mode == 'add') {
    cy.getByFormControlName('passwordCtr').as('password').invoke('val').then(password => {
      if (password !== user.password) {
        cy.get('@password').clear().type(user.password)
      }
    })

    cy.getByFormControlName('confirmPasswordCtr').as('confirmPassword').invoke('val').then(confirmPassword => {
      if (confirmPassword !== user.confirmPassword) {
        cy.get('@confirmPassword').clear().type(user.confirm_password)
      }
    })
  }
  cy.checkingMatErrorIsExistOrNot(false)
  cy.getButtonByTypeAndContent('submit', buttonContent).click()
  cy.checkingToastSuccess()
  cy.log(`END: Add/Update ${user.first_name} ${user.last_name}`)
}
Cypress.Commands.add('addUpdateUser', addUpdateUser);

// Delete record by name
declare namespace Cypress {
  interface Chainable<Subject = any> {
    deleteRecordByName(name: string, matToolTipName: string, isRowSelected: boolean): typeof deleteRecordByName;
  }
}

function deleteRecordByName(name: string, matToolTipName: string, isRowSelected: boolean): void {
  cy.log(`START: Delete ${name}`)
  if (!isRowSelected) {
    cy.selectRowByName(name)
  }
  cy.getByMatToolTip(matToolTipName).click()
  cy.get('mat-dialog-container').should('exist')
  cy.getButtonByTypeAndContent('submit', 'OK').click()
  cy.checkingToastSuccess()
  cy.log(`END: Delete ${name} successfully`)
}
Cypress.Commands.add('deleteRecordByName', deleteRecordByName);

// Add new node on map
declare namespace Cypress {
  interface Chainable<Subject = any> {
    addNewNodeOnMap(node: any, positionX: any, positionY: any, custom: boolean): typeof addNewNodeOnMap;
  }
}

function addNewNodeOnMap(node: any, positionX: any, positionY: any, custom: boolean): void {
  cy.log(`START: Add new node ${node.name}`)
  cy.waitingLoadingFinish()
  cy.getByFormControlName('deviceCtr').first().click()
  cy.get('.option-text').contains(node.device_name).first().click()
  cy.getByFormControlName('templateCtr').click()
  cy.get('.option-text').contains(node.template_name).first().click()
  cy.getByDataCy('btn-add-node').click({ force: true })
  cy.waitingLoadingFinish()
  cy.get('canvas.expand-collapse-canvas').click(positionX, positionY, { force: true });
  cy.wait(1000)
  if (custom) {
    cy.getByFormControlName('nameCtr').as('nameCtr').invoke('val').then(nameValue => {
      if (nameValue !== node.name) {
        cy.get('@nameCtr').clear().type(node.name)
      }
    })
    cy.getByFormControlName('parentFolderCtr').as('parentFolderCtr').invoke('val').then(value => {
      if (value !== node.parent_folder) {
        cy.get('@parentFolderCtr').clear().type(node.parent_folder)
      }
    })
    cy.getByFormControlName('folderCtr').as('folderCtr').invoke('val').then(value => {
      if (value !== node.folder) {
        cy.get('@folderCtr').clear().type(node.folder)
      }
    })
  } else {
    cy.getByFormControlName('nameCtr').invoke('val').should('not.eq', '')
    .then(nodeNameInput => {
      cy.wait(1000)
      cy.getByFormControlName('folderCtr').type(`${node.folder}-${nodeNameInput}`)
    })
  }
  cy.checkingMatErrorIsExistOrNot()
  cy.getByDataCy('nodeAddForm').submit()
  cy.wait(1000)
  cy.checkingToastSuccess()
  cy.waitingLoadingFinish()
  cy.log(`END: Added new node ${node.name} successfully`)
}
Cypress.Commands.add('addNewNodeOnMap', addNewNodeOnMap);

// Add new port group on map
declare namespace Cypress {
  interface Chainable<Subject = any> {
    addNewPortGroupOnMap(portGroup: any, positionX: any, positionY: any, custom: boolean): typeof addNewPortGroupOnMap;
  }
}

function addNewPortGroupOnMap(portGroup: any, positionX: any, positionY: any, custom: boolean): void {
  cy.log(`START: Add new portGroup ${portGroup.name}`)
  cy.waitingLoadingFinish()
  const portGroupCategory = portGroup.category == 'public' ? '[matTooltip="Add Public"]' : '[matTooltip="Add Private"]'
  cy.get(portGroupCategory).click()
  cy.get('canvas.expand-collapse-canvas').click(positionX, positionY, { force: true });
  cy.wait(1000)
  if (custom) {
    cy.getByFormControlName('nameCtr').as('nameCtr').invoke('val').then(nameValue => {
      if (nameValue !== portGroup.name) {
        cy.get('@nameCtr').clear().type(portGroup.name)
      }
    })
    cy.getByFormControlName('vlanCtr').as('vlanCtr').invoke('val').then(value => {
      if (value !== portGroup.vlan) {
        cy.get('@vlanCtr').clear().type(portGroup.vlan)
      }
    })
    if (portGroup.subnet_allocation == 'static_manual') {
      cy.getByFormControlName('subnetAllocationCtr').children(`mat-radio-button[value="${portGroup.subnet_allocation}"]`).click()
      cy.wait(1000)
      cy.getByFormControlName('subnetCtr').as('subnetCtr').invoke('val').then(value => {
        if (value !== portGroup.subnet) {
          cy.get('@subnetCtr').clear().type(portGroup.subnet)
        }
      })
    }
  }
  cy.checkingMatErrorIsExistOrNot(false)
  cy.getByDataCy('pgAddForm').submit()
  cy.wait(1000)
  cy.checkingToastSuccess()
  cy.waitingLoadingFinish()
  cy.log(`END: Add new port group ${portGroup.name} successfully`)
}
Cypress.Commands.add('addNewPortGroupOnMap', addNewPortGroupOnMap);

// Add new interface on map
declare namespace Cypress {
  interface Chainable<Subject = any> {
    addNewInterface(edge: any, nodeX: any, nodeY: any, pgX: any, pgY: any, isValidateIP?: boolean): typeof addNewInterface;
  }
}

function addNewInterface(edge: any, nodeX: any, nodeY: any, pgX: any, pgY: any, isValidateIP = false): void {
  cy.log('START: Add new interface')
  cy.waitingLoadingFinish()
  cy.get('canvas.expand-collapse-canvas').click(nodeX, nodeY, { force: true })
    .rightclick(nodeX, nodeY,{force: true}).then(() => {
    cy.get('.cy-context-menus-cxt-menu').first().should('exist')
    cy.get('#node_interface').should('exist').click({ force: true })
    cy.get('#connect_interface').should('exist').click({ force: true })
    cy.waitingLoadingFinish()
    cy.get('canvas.expand-collapse-canvas').click(pgX, pgY, { force: true });
    cy.getButtonByTypeAndContent('button', 'Add New Interface').click()
    if (edge && edge.direction) {
      cy.getByFormControlName('directionCtr').click().then(() => {
        cy.get('mat-option').contains('Both').click()
      })
    }
    cy.wait(1000)
    if (edge) {
      if (edge.ip_allocation) {
        cy.getByFormControlName('ipAllocationCtr').children(`mat-radio-button[value="${edge.ip_allocation}"]`).click()
        cy.wait(1000)
      }
      if (edge.ip_allocation === 'static_manual') {
        cy.getByFormControlName('netMaskCtr').first().click().then(() => {
          cy.get('mat-option').first().click()
        })
        if (edge.ip_address) {
          cy.getByFormControlName('ipCtr').clear().type(edge.ip_address);
          if (isValidateIP) {
            cy.checkingMatErrorIsExistOrNot(true)
            return;
          } else {
            cy.checkingMatErrorIsExistOrNot(false)
          }
          cy.wait(1000)
        }
      }
    }

    cy.checkingMatErrorIsExistOrNot(false)
    cy.getByDataCy('interfaceAddForm').submit()
    cy.checkingToastSuccess()
    cy.waitingLoadingFinish()
    cy.getButtonByTypeAndContent('submit', 'Connect').click()
    cy.checkingToastSuccess()
    cy.waitingLoadingFinish()
    cy.get('button[matTooltip="Save"]').click()
    cy.checkingToastSuccess()
    cy.waitingLoadingFinish()
    cy.log('END: Add new interface successfully')
  })

}
Cypress.Commands.add('addNewInterface', addNewInterface);

declare namespace Cypress {
  interface Chainable<Subject = any> {
    connectInterface(nodeX: any, nodeY: any, nodeX2: any, nodeY2: any): typeof connectInterface;
  }
}

function connectInterface(nodeX: any, nodeY: any, nodeX2: any, nodeY2: any): void {
  cy.log('START: Connect interface')
  cy.wait(2000)
  cy.get('canvas.expand-collapse-canvas').click(nodeX, nodeY, { force: true })
    .rightclick(nodeX, nodeY,{force: true}).then(() => {
    cy.get('.cy-context-menus-cxt-menu').first().should('exist')
    cy.get('#node_interface').should('exist').click({ force: true })
    cy.get('#connect_interface').should('exist').click({ force: true })
    cy.waitingLoadingFinish()
    cy.get('canvas.expand-collapse-canvas').click(nodeX2, nodeY2, { force: true });
  })
  cy.wait(2000)
  cy.log('END: Add new interface successfully')
}
Cypress.Commands.add('connectInterface', connectInterface);

declare namespace Cypress {
  interface Chainable<Subject = any> {
    addNewSourceInterfaces(edge: any): typeof addNewSourceInterfaces;
  }
}

function addNewSourceInterfaces(edge: any): void {
  cy.getByDataCy('addInterfaceSource').click({force: true})
  // add new source edge
  cy.getByFormControlName('vlanIdSourceCtr').type(edge.vlan_id);
  cy.getByFormControlName('vlanModeSourceCtr').click({force: true});
  cy.get(`mat-option[value="${edge.vlan_mode}"]`).click();
  cy.get('mat-error').should('not.exist')
  cy.getByDataCy('interfaceAddFormSource').submit()
  cy.checkingToastSuccess()
  cy.waitingLoadingFinish()
}
Cypress.Commands.add('addNewSourceInterfaces', addNewSourceInterfaces);

declare namespace Cypress {
  interface Chainable<Subject = any> {
    addNewTargetInterfaces(edge: any): typeof addNewTargetInterfaces;
  }
}

function addNewTargetInterfaces(edge: any): void {
  cy.getByDataCy('addInterfaceTarget').click({force: true})
  // add new target edge
  cy.getByFormControlName('vlanIdTargetCtr').type(edge.vlan_id);
  cy.getByFormControlName('vlanModeTargetCtr').click({force: true});
  cy.get(`mat-option[value="${edge.vlan_mode}"]`).click();
  cy.get('mat-error').should('not.exist')
  cy.getByDataCy('interfaceAddFormTarget').submit()
  cy.checkingToastSuccess()
  cy.waitingLoadingFinish()
}
Cypress.Commands.add('addNewTargetInterfaces', addNewTargetInterfaces);

// Delete interface on map
declare namespace Cypress {
  interface Chainable<Subject = any> {
    deleteInterfaceOnMap(x: number, y: number): typeof deleteInterfaceOnMap;
  }
}
function deleteInterfaceOnMap(x: number, y: number): void {
  cy.get('canvas.expand-collapse-canvas').rightclick(x, y, {force: true}).then(() => {
    cy.get('.cy-context-menus-cxt-menu').first().should('exist')
    cy.get('#delete').should('exist').click({ force: true });
    cy.getByMatToolTip('Save').click()
  })
}
Cypress.Commands.add('deleteInterfaceOnMap', deleteInterfaceOnMap);
// Export project by name
declare namespace Cypress {
  interface Chainable<Subject = any> {
    addTemplateIntoProject(projectName: string, isProjectOpened: boolean, templateName: string): typeof addTemplateIntoProject;
  }
}
function addTemplateIntoProject(projectName: string, isProjectOpened: boolean, templateName: string): void {
  cy.log('Start add a template into current project')
  if (!isProjectOpened) {
    cy.openProjectByName(projectName)
  }
  cy.waitingLoadingFinish()
  cy.get('#toolpanel-add-template').click();
  cy.getOptionByContent(templateName).first().click();
  cy.getByDataCy('addTemplateForm').submit();
  cy.get('canvas.expand-collapse-canvas').click(220, 250, { force: true });
  cy.checkingToastSuccess()
  cy.log('Added a template into current project')
}
Cypress.Commands.add('addTemplateIntoProject', addTemplateIntoProject);


// Select node, port group or interface
declare namespace Cypress {
  interface Chainable<Subject = any> {
    selectElementOnMap(type: any, name: string): typeof selectElementOnMap;
  }
}

function selectElementOnMap(type: any, name: string): void {
  cy.log('START: Select element')
  if (type !== 'edge') {
    cy.get('#cy').then((el: any) => {
      const cytoscape = el[0]._cyreg.cy
      cytoscape.nodes().unselect()
      cytoscape.edges().unselect()
      const newNode = cytoscape.nodes().filter(`[name="${name}"]`)[0]
      newNode.select()
    })
  } else {
    cy.get('#cy').then((el: any) => {
      const cytoscape = el[0]._cyreg.cy
      cytoscape.nodes().unselect()
      cytoscape.edges().unselect()
      const newNode = cytoscape.edges().filter(`[name="${name}"]`)[0]
      newNode.select()
    })
  }
  cy.log('END: Select element')
}
Cypress.Commands.add('selectElementOnMap', selectElementOnMap);

declare namespace Cypress {
  interface Chainable<Subject = any> {
    updateMapStyle(data: any, type: any): typeof updateMapStyle;
  }
}

function updateMapStyle(data: any, type: any): void {
  cy.log('START: Update style element')

  const dataCy = `toolpanel-${type}-size`
  const sizeElement = type == 'node' ? data.node_size : type == 'port-group' ? data.port_group_size : data.edge_width
  const currentValue = type == 'node' ? 50 : type == 'port-group' ? 50 : 25
  cy.getByDataCy(dataCy).as('size').then(value =>{
    cy.get('@size').focus().type(calcArrowsSlider(sizeElement, currentValue), {force: true})
  })
  cy.wait(1000)
  cy.get('#textColor').click()
  cy.getColorPickerByClass('.text-color').clear({force: true}).type(data.text_color, {force: true}).type('{enter}', {force: true})
  cy.wait(1000)
  cy.getByDataCy('toolpanel-text-size').as('textSize').then(value =>{
    cy.get('@textSize').type(calcArrowsSlider(data.text_size, 100))
  })

  if (type !== 'edge') {
    cy.getByDataCy('select-valign').children(`mat-button-toggle[value="${data.text_valign}"]`).click()
    cy.getByDataCy('select-halign').children(`mat-button-toggle[value="${data.text_halign}"]`).click()
  } else {
    cy.get('#edgeColor').click()
    cy.getColorPickerByClass('.edge-color').clear().type(data.edge_color).type('{enter}')

    cy.getByDataCy('select-direction').children(`mat-button-toggle[value="${data.edge_arrow_direction}"]`).click()
    cy.getByDataCy('toolpanel-arrow-size').as('arrowsize').then(value =>{
      cy.get('@arrowsize').type(calcArrowsSlider(data.edge_arrow_size, 5))
    })
  }

  cy.get('#textBGColor').click()
  cy.getColorPickerByClass('.text-bg-color').clear({force: true}).type(data.text_bg_color, {force: true}).type('{enter}', {force: true})
  cy.wait(1000)

  cy.getByDataCy('toolpanel-text-bgopacity').as('textbgopacity').then(value =>{
    cy.get('@textbgopacity').type(calcArrowsSlider(data.text_bg_opacity * 100, 50))
  })

  cy.log('START: update style element')
}
Cypress.Commands.add('updateMapStyle', updateMapStyle);

// Add update domain
declare namespace Cypress {
  interface Chainable<Subject = any> {
    addEditDomain(domain: any, mode: string): typeof addEditDomain;
  }
}

function addEditDomain(domain: any, mode: string) {
  cy.log('START: Add/edit domain')
  cy.getByFormControlName('nameCtr').as('nameCtr').invoke('val').then(value => {
    if (value !== domain.name) {
      cy.get('@nameCtr').clear().type(domain.name)
    }
  })
  if (domain.admin_user) {
    cy.getByFormControlName('adminUserCtr').as('adminUserCtr').invoke('val').then(value => {
      if (value !== domain.admin_user) {
        cy.get('@adminUserCtr').clear().type(domain.admin_user)
      }
    })
  }
  if (domain.admin_password) {
    cy.getByFormControlName('adminPasswordCtr').as('adminPasswordCtr').invoke('val').then(value => {
      if (value !== domain.admin_password) {
        cy.get('@adminPasswordCtr').clear().type(domain.admin_password)
      }
    })
  }
  cy.checkingMatErrorIsExistOrNot(false)
  cy.wait(2000)
  cy.getByDataCy('domainAddForm').submit()
  cy.checkingToastSuccess()
  cy.log('END: Add/edit domain')
}
Cypress.Commands.add('addEditDomain', addEditDomain);

// Create Users Domain
declare namespace Cypress {
  interface Chainable<Subject = any> {
    createUsersDomain(domain: any): typeof createUsersDomain;
  }
}

function createUsersDomain(domain: any) {
  cy.log('START: Create Users')
  cy.getByFormControlName('numberUserCtr').as('numberUserCtr').invoke('val').then(value => {
    if (value !== domain) {
      cy.get('@numberUserCtr').clear().type(domain)
    }
  })
  cy.checkingMatErrorIsExistOrNot(false)
  cy.wait(2000)
  cy.getByDataCy('addDomainUserForm').submit()
  cy.checkingToastSuccess()
  cy.log('END: Create Users')
}
Cypress.Commands.add('createUsersDomain', createUsersDomain);

// Add update domain
declare namespace Cypress {
  interface Chainable<Subject = any> {
    addEditGroup(group: any, mode: string): typeof addEditGroup;
  }
}

function addEditGroup(group: any, mode: string) {
  cy.log('START: Add/edit group')
  cy.getByFormControlName('nameCtr').as('nameCtr').invoke('val').then(value => {
    if (value !== group.name) {
      cy.get('@nameCtr').clear().type(group.name)
    }
  })

  if (mode == 'add' && group.category == 'domain') {
    cy.getByFormControlName('categoryCtr').click()
    cy.get('.option-text').contains(group.category).first().click()
  }

  if (mode == 'edit') {
    cy.getByFormControlName('categoryCtr').click()
    cy.get('.option-text').contains(group.category).first().click();
    cy.getByFormControlName('nodesCtr').click();
    cy.wait(2000)
    cy.get('ng-dropdown-panel .ng-dropdown-panel-items').contains(group.nodes).click();
    cy.wait(2000)
    group.port_groups.forEach((val: any) => {
      cy.getByFormControlName('portGroupsCtr').click();
      cy.wait(2000)
      cy.get('ng-dropdown-panel .ng-dropdown-panel-items').contains(new RegExp(`^${val}$`, 'gi')).click();
      cy.wait(2000)
      cy.get('body').click(0,0);
    })
  }
  cy.getByFormControlName('descriptionCtr').as('descriptionCtr').invoke('val').then(value => {
    if (value !== group.description) {
      cy.get('@descriptionCtr').clear().type(group.description)
    }
  })
  cy.checkingMatErrorIsExistOrNot(false)
  cy.wait(2000)
  cy.getByDataCy('groupAddForm').submit()
  cy.checkingToastSuccess()
  cy.log('END: Add/edit group')
}
Cypress.Commands.add('addEditGroup', addEditGroup);


// Waiting loading API
declare namespace Cypress {
  interface Chainable<Subject = any> {
    waitingLoadingFinish(): typeof waitingLoadingFinish;
  }
}

function waitingLoadingFinish() {
  cy.wait(1000)
  cy.get('.loading', { timeout: 15000 }).should('not.exist')
}
Cypress.Commands.add('waitingLoadingFinish', waitingLoadingFinish);
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
  cy.checkingMatErrorIsExistOrNot(false)
  cy.getByDataCy('connectionForm').submit()
  cy.checkingToastSuccess()
  cy.log(`END: Add/Update ${connectionProfile.name}`)

}

Cypress.Commands.add('addEditConnectionProfile', addEditConnectionProfile);

// Import project
declare namespace Cypress {
  interface Chainable<Subject = any> {
    importJsonData(filePath: string, importType?: string): typeof importJsonData;
  }
}

function importJsonData(filePath: string, importType = 'Import'): void {
  cy.log(`Import JSON data from ${filePath}`)
  cy.showFormAddByMatTooltip(importType);
  cy.get('input[type=file]').selectFile(`${filePath}`)
  cy.wait(1000)
  cy.checkingMatErrorIsExistOrNot(false)
  cy.getButtonByTypeAndContent('submit', 'Import').click()
  cy.checkingToastSuccess()
  cy.log(`Imported JSON data from ${filePath}`)
}
Cypress.Commands.add('importJsonData', importJsonData);

// Update App Preferences
declare namespace Cypress {
  interface Chainable<Subject = any> {
    updateAppPreferences(appPreferences: any, privateNetwork: any, privateNetworkIps: any): typeof updateAppPreferences;
  }
}

function updateAppPreferences(appPreferences: any,  privateNetwork: any, privateNetworkIps: any): void {
  cy.log(`START: Update App Preferences`)
  cy.get('[data-cy=select-mappref]').click();
  cy.getOptionByContent(`${appPreferences.map_pref}`).click();
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
  cy.checkingMatErrorIsExistOrNot(false)
  cy.getByDataCy('mapPrefForm').submit()
  cy.checkingToastSuccess()
  cy.log(`END: Add/Update new ${mapPreferences.name}`)
}
Cypress.Commands.add('addUpdateMapPreferences', addUpdateMapPreferences);

// Clone node
declare namespace Cypress {
  interface Chainable<Subject = any> {
    cloneNode(nodeX: number, nodeY: number): typeof cloneNode;
  }
}

function cloneNode(nodeX: number, nodeY: number) {
  cy.get('canvas.expand-collapse-canvas').click(nodeX, nodeY, { force: true })
    .rightclick(300, 500,{force: true}).then(() => {
    cy.get('.cy-context-menus-cxt-menu').first().should('exist')
    cy.get('#node_actions').should('exist').click({ force: true })
    cy.get('#clone_node').should('exist').click({ force: true })
    cy.waitingLoadingFinish()
    cy.checkingToastSuccess()
  })
}
Cypress.Commands.add('cloneNode', cloneNode);


// Unselect all elements on map
declare namespace Cypress {
  interface Chainable<Subject = any> {
    unSelectAllElementOnMap(): typeof unSelectAllElementOnMap;
  }
}

function unSelectAllElementOnMap() {
  cy.get('#cy').then((el: any) => {
    const cytoscape = el[0]._cyreg.cy
    cytoscape.nodes().unselect()
    cytoscape.edges().unselect()
  })
}
Cypress.Commands.add('unSelectAllElementOnMap', unSelectAllElementOnMap);


// Checking toast message success
declare namespace Cypress {
  interface Chainable<Subject = any> {
    checkingToastSuccess(): typeof checkingToastSuccess;
  }
}

function checkingToastSuccess() {
  cy.get('.toast-success', { timeout: 15000 }).should('exist')
}
Cypress.Commands.add('checkingToastSuccess', checkingToastSuccess);


// Checking toast message warning
declare namespace Cypress {
  interface Chainable<Subject = any> {
    checkingIsToastWarningExistOrNot(isCheckExist?: boolean): typeof checkingIsToastWarningExistOrNot;
  }
}

function checkingIsToastWarningExistOrNot(isCheckExist: boolean = true) {
  const condition = isCheckExist ? 'exist' : 'not.exist'
  cy.get('.toast-warning', {timeout: 10000}).should(condition)
}
Cypress.Commands.add('checkingIsToastWarningExistOrNot', checkingIsToastWarningExistOrNot);


// Checking mat-error tag
declare namespace Cypress {
  interface Chainable<Subject = any> {
    checkingMatErrorIsExistOrNot(isCheckExist?: boolean): typeof checkingMatErrorIsExistOrNot;
  }
}

function checkingMatErrorIsExistOrNot(isCheckExist: boolean = false) {
  const condition = isCheckExist ? 'exist' : 'not.exist'
  cy.get('mat-error', {timeout: 10000}).should(condition)
}
Cypress.Commands.add('checkingMatErrorIsExistOrNot', checkingMatErrorIsExistOrNot);


Cypress.on('fail', () => {
  //@ts-ignore
  Cypress.runner.stop()
})

Cypress.on('window:before:load', () => {
  cy.waitingLoadingFinish()
})

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

    getMatSliderToggleByClass(value: string): Chainable<JQuery<HTMLElement>>

    selectMatTabByLabel(content: any): Chainable<JQuery<HTMLElement>>

    selectInfoPanelRowByLabelAndContent(label: string, content: string): Chainable<JQuery<HTMLElement>>

    getSelectImagesByName(content: string): Chainable<JQuery<HTMLElement>>
  }
}
Cypress.Commands.add(
  'getByDataCy',
  (id: string) => {
    cy.get(`[data-cy="${id}"]`, {timeout: 10000})
  }
);

Cypress.Commands.add(
  'getByFormControlName',
  (controlName: string) => {
    cy.get(`[formControlName="${controlName}"]`, {timeout: 10000})
  }
);

Cypress.Commands.add(
  'getByMatToolTip',
  (matTooltip: string) => {
    cy.get(`[matTooltip="${matTooltip}"]`, {timeout: 5000})
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

Cypress.Commands.add(
  'getMatSliderToggleByClass',
  (value: string) => {
    cy.get(`${value} label.mat-slide-toggle-label span input[type="checkbox"]`, {timeout: 5000})
  }
);

Cypress.Commands.add(
  'selectMatTabByLabel',
  (content: any) => {
    cy.get('.mat-tab-label', {timeout: 5000}).contains(content)
  }
);

Cypress.Commands.add(
  'selectInfoPanelRowByLabelAndContent',
  (label: string, content: string) => {
    cy.get(`app-info-panel-${label} ag-grid-angular .ag-row`).contains(`${content}`)
    .parent('.ag-cell-wrapper').parent('.ag-cell').parent('.ag-row').find('.ag-checkbox-input')
  }
);

Cypress.Commands.add(
  'getSelectImagesByName',
  (content: string) => {
    cy.get('mat-card-footer > .icon-name').contains(content).closest('mat-grid-tile').find('input[type="checkbox"]')
  }
);
