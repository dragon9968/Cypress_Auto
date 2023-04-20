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
    addNewProject(project: any): typeof addNewProject;
  }
}

function addNewProject(project: any): void {
  cy.getByFormControlName('name').type(project.name)
  cy.getByFormControlName('description').type(project.description)
  cy.getByFormControlName('category').children(`mat-radio-button[value="${project.category}"]`).click()
  cy.getByFormControlName('target').click().then(() => {
    cy.get('mat-option').contains(`${project.target}`).click()
  })
  cy.getByFormControlName('option').children(`mat-radio-button[value="${project.option}"]`).click()
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
Cypress.Commands.add('addNewProject', addNewProject);

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
     * @example cy.getByFormControlName('username')
     */
    getByMatToolTip(matTooltip: string): Chainable<JQuery<HTMLElement>>
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

