describe('Device/Template e2e testing', () => {
  let admin:any = {}
  const loginProfile = {
    name: 'Test Device Login',
    username: 'Test',
    password: 'Password',
    description: 'Test login profile'
  }
  const newDevice = {
    name: 'Test Device',
    category: 'Other',
    icon: 'Default'
  }
  const deviceUpdate = {
    name: 'Test VM Device',
    category: 'Router',
    icon: 'Router (Black)'
  }
  const newTemplate = {
    display_name: 'Test Template',
    name: 'test_template',
    category: 'other',
    login_profile_name: 'Test Device Login'
  }
  const templateUpdate = {
    name: 'Test VM Template',
    category: 'vm'
  }
  beforeEach(() => {
    cy.viewport(1366, 768)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
  })


  it('Add new login profile', () => {
    cy.openPageInDeviceTemplate('Login Profiles')
    cy.showFormAddByMatTooltip('Add')
    cy.addUpdateNewLoginProfile(loginProfile, 'add')
    cy.wait(2000)
  });

  it('Add new device', () => {
    cy.openPageInDeviceTemplate('Device/Template')
    cy.showFormAddByMatTooltip('Add New Device')
    cy.wait(1000)

    cy.getByFormControlName('name').clear().type(newDevice.name)

    cy.getByFormControlName('category').click()
    cy.wait(1000)
    cy.get('ng-select input').type(newDevice.category)
    cy.get('.ng-option').contains(new RegExp(`^(${newDevice.category})`, "g")).click()

    cy.wait(1000)
    cy.get('#device-icon').focus().clear().type(newDevice.icon)
    cy.getOptionByContent(newDevice.icon).click()

    cy.get('mat-error').should('not.exist')
    cy.getButtonByTypeAndContent('submit', 'Create').click()
    cy.wait(2000)
    cy.get('mat-dialog-container').should('not.exist')
  });

  it('Add new template', () => {
    cy.openPageInDeviceTemplate('Device/Template')
    cy.selectDeviceByName(newDevice.name)

    cy.showFormAddByMatTooltip('Add New Template')
    cy.getByFormControlName('displayName').clear().type(newTemplate.display_name)
    cy.wait(1000)
    cy.getByFormControlName('name').clear().type(newTemplate.name)
    cy.get(`mat-radio-button[value=${newTemplate.category}]`).click()
    cy.get('#template-login-profile').clear().type(newTemplate.login_profile_name)
    cy.getOptionByContent(newTemplate.login_profile_name).first().click()
    cy.get('mat-error').should('not.exist')
    cy.getButtonByTypeAndContent('submit', 'Create').click()
    cy.wait(2000)
    cy.get('mat-dialog-container').should('not.exist')
  });

  it('Delete template', () => {
    cy.openPageInDeviceTemplate('Device/Template')
    cy.selectDeviceByName(newDevice.name)

    cy.get('.table__nav--search input#search-template').clear().type(newTemplate.name)
    cy.selectRowByName(newTemplate.name)
    cy.wait(1000)
    cy.getByMatToolTip('Edit Template').click()
    cy.wait(1000)
    cy.getByFormControlName('name').clear().type(templateUpdate.name)
    cy.wait(1000)
    cy.get(`mat-radio-button[value=${templateUpdate.category}]`).click()
    cy.get('mat-error').should('not.exist')
    cy.getButtonByTypeAndContent('submit', 'Update').click()
    cy.get('mat-dialog-container').should('not.exist')
    cy.get('.table__nav--search input#search-template').clear()
    cy.log('Delete Template')
    cy.deleteRecordByName(templateUpdate.name, 'Delete Template', true)
    cy.wait(2000)
    cy.get('mat-dialog-container').should('not.exist')
  });

  it('Edit device',  () => {
    cy.openPageInDeviceTemplate('Device/Template')
    cy.selectDeviceByName(newDevice.name)

    cy.log('Edit Device')
    cy.getByMatToolTip('Edit Device').click()
    cy.wait(1000)
    cy.getByFormControlName('name').clear().type(deviceUpdate.name)
    cy.getByFormControlName('category').click()
    cy.wait(1000)
    cy.get('ng-select input').type(deviceUpdate.category)
    cy.get('.ng-option').contains(new RegExp(`^(${deviceUpdate.category})`, "g")).click()
    cy.wait(1000)
    cy.get('#device-icon').focus().clear().type(deviceUpdate.icon)
    cy.getOptionByContent(deviceUpdate.icon).click()
    cy.wait(1000)
    cy.get('mat-error').should('not.exist')
    cy.getButtonByTypeAndContent('submit', 'Update').click()
    cy.wait(3000)
    cy.get('mat-dialog-container').should('not.exist')
  });

  it('Delete device', () => {
    cy.openPageInDeviceTemplate('Device/Template')
    cy.get('.table__nav--search input').first().clear({force: true}).type(deviceUpdate.name)
    cy.wait(1000)
    cy.get('.ag-row').contains(new RegExp(`^(${deviceUpdate.name})`, "g")).first().click({ force: true })
    cy.deleteRecordByName(deviceUpdate.name, 'Delete Device', true)
    cy.get('.table__nav--search input').first().clear()
  });

  afterEach(() => {
    Cypress.session.clearAllSavedSessions()
  })
})
