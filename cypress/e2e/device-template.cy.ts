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
    cy.visit('/login')
    cy.fixture('login/admin.json').then(
      adminData => admin = adminData
    )
  })

  it('Test - Device/Template',() => {
    cy.login(admin.username, admin.password)
    cy.getByDataCy('btn-devices').click()
    cy.log('Login Profile - Add new login profile')
    cy.get('button>span').contains('Login Profiles').click()
    cy.wait(2000)

    cy.showFormAddByMatTooltip('Add')
    cy.addUpdateNewLoginProfile(loginProfile, 'add')
    cy.wait(2000)
    cy.getByDataCy('btn-devices').click()
    cy.log('Device Table')
    cy.get('button>span').contains('Device/Template').click()
    cy.wait(1000)

    cy.log('Add new device')
    cy.showFormAddByMatTooltip('Add New Device')
    cy.getByFormControlName('name').clear().type(newDevice.name)

    cy.getByFormControlName('category').click()
    cy.wait(1000)
    cy.get('ng-select input').type(newDevice.category)
    cy.get('.ng-option').contains(newDevice.category).click()

    cy.wait(1000)
    cy.get('#device-icon').focus().clear().type(newDevice.icon)
    cy.getOptionByContent(newDevice.icon).click()

    cy.get('mat-error').should('not.exist')
    cy.getButtonByTypeAndContent('submit', 'Create').click()
    cy.wait(2000)
    cy.get('mat-dialog-container').should('not.exist')

    cy.log('Add new template')
    cy.get('.table__nav--search input').first().clear({force: true}).type(newDevice.name)
    cy.wait(1000)
    cy.get('.ag-row').contains(newDevice.name).first().click({ force: true })

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

    cy.log('Edit Device')
    cy.getByMatToolTip('Edit Device').click()
    cy.wait(1000)
    cy.getByFormControlName('name').clear().type(deviceUpdate.name)
    cy.getByFormControlName('category').click()
    cy.wait(1000)
    cy.get('ng-select input').type(deviceUpdate.category)
    cy.get('.ng-option').contains(deviceUpdate.category).click()
    cy.wait(1000)
    cy.get('#device-icon').focus().clear().type(deviceUpdate.icon)
    cy.getOptionByContent(deviceUpdate.icon).click()
    cy.wait(1000)
    cy.get('mat-error').should('not.exist')
    cy.getButtonByTypeAndContent('submit', 'Update').click()

    cy.log('Delete Device')
    cy.deleteRecordByName(deviceUpdate.name, 'Delete Device', true)
    cy.get('.table__nav--search input').first().clear()
  });
})
