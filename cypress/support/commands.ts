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
//
// NOTE: You can use it like so:
Cypress.Commands.add('addNewRandomProject', addNewRandomProject);
Cypress.Commands.add('addNewBlankProject', addNewBlankProject);


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
    Random_Name (text: string):Chainable<JQuery<HTMLElement>>
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
