describe('Device/Template e2e testing', {testIsolation: true}, () => {
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

  let deviceImportName = ''
  const deviceDataPath = 'devices-data/device/devices-export.json'
  const templateDataPath = 'devices-data/template/templates-export.json'
  beforeEach(() => {
    cy.fixture(deviceDataPath).then(
      deviceImport => deviceImportName = deviceImport.device[0].name
    )
    cy.viewport(1366, 768)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
  })


  it('Add new login profile', () => {
    cy.openPageInDevicesNav('Login Profiles')
    cy.showFormAddByMatTooltip('Add')
    cy.addUpdateNewLoginProfile(loginProfile, 'add')
  });

  it('Add new device', () => {
    cy.openPageInDevicesNav('Device/Template')
    cy.showFormAddByMatTooltip('Add New Device')
    cy.getByFormControlName('name').clear().type(newDevice.name)
    cy.getByFormControlName('category').click()
    cy.get('ng-select input').type(newDevice.category)
    cy.get('.ng-option').contains(new RegExp(`^(${newDevice.category})`, "g"), {timeout: 5000}).click()
    cy.get('#device-icon').focus().clear().type(newDevice.icon)
    cy.getOptionByContent(newDevice.icon).click()
    cy.checkingMatErrorIsExistOrNot(false)
    cy.getButtonByTypeAndContent('submit', 'Create').click()
    cy.checkingToastSuccess()
  });

  it('Add new template', () => {
    cy.openPageInDevicesNav('Device/Template')
    cy.selectDeviceByName(newDevice.name)

    cy.showFormAddByMatTooltip('Add New Template')
    cy.getByFormControlName('displayName').clear().type(newTemplate.display_name)
    cy.getByFormControlName('name').clear().type(newTemplate.name)
    cy.get(`mat-radio-button[value=${newTemplate.category}]`).click()
    cy.get('#template-login-profile').clear().type(newTemplate.login_profile_name)
    cy.getOptionByContent(newTemplate.login_profile_name).first().click()
    cy.checkingMatErrorIsExistOrNot(false)
    cy.getButtonByTypeAndContent('submit', 'Create').click()
    cy.checkingToastSuccess()
  });

  it('Edit and delete template', () => {
    cy.openPageInDevicesNav('Device/Template')
    cy.selectDeviceByName(newDevice.name)

    cy.get('.table__nav--search input#search-template').clear().type(newTemplate.name)
    cy.get('.ag-row').contains(newTemplate.name, {timeout: 5000}).first().click({ force: true }).type(" ");
    cy.getByMatToolTip('Edit Template').click()
    cy.getByFormControlName('name').clear().type(templateUpdate.name)
    cy.get(`mat-radio-button[value=${templateUpdate.category}]`).click()
    cy.get('mat-error').should('not.exist')
    cy.getButtonByTypeAndContent('submit', 'Update').click()
    cy.get('mat-dialog-container').should('not.exist')
    cy.get('.table__nav--search input#search-template').clear()
    cy.log('Delete Template')
    cy.deleteRecordByName(templateUpdate.name, 'Delete Template', true)
  });

  it('Edit device', () => {
    cy.openPageInDevicesNav('Device/Template')
    cy.selectDeviceByName(newDevice.name)

    cy.log('Edit Device')
    cy.getByMatToolTip('Edit Device').click()
    cy.getByFormControlName('name').clear().type(deviceUpdate.name)
    cy.getByFormControlName('category').click()
    cy.get('ng-select input').type(deviceUpdate.category)
    cy.get('.ng-option').contains(new RegExp(`^(${deviceUpdate.category})`, "g")).click()
    cy.get('#device-icon').focus().clear().type(deviceUpdate.icon)
    cy.getOptionByContent(deviceUpdate.icon).click()
    cy.checkingMatErrorIsExistOrNot(false)
    cy.getButtonByTypeAndContent('submit', 'Update').click()
    cy.checkingToastSuccess()
  });

  it('Delete device', () => {
    cy.openPageInDevicesNav('Device/Template')
    cy.get('.table__nav--search input').first().clear({force: true}).type(deviceUpdate.name)
    cy.wait(1000)
    cy.get('.ag-row').contains(new RegExp(`^(${deviceUpdate.name})`, "g")).first().click({ force: true })
    cy.deleteRecordByName(deviceUpdate.name, 'Delete Device', true)
    cy.get('.table__nav--search input').first().clear()
  });

  it('Import device', () => {
    cy.openPageInDevicesNav('Device/Template')
    cy.importJsonData(`cypress/fixtures/${deviceDataPath}`, 'Import Device')
  });

  it('Import template', () => {
    cy.openPageInDevicesNav('Device/Template')
    cy.get('.table__nav--search input').first().clear({force: true}).type(deviceImportName)
    cy.get('.ag-row').contains(new RegExp(`^(${deviceImportName})`, "g")).first().click({ force: true })
    cy.importJsonData(`cypress/fixtures/${templateDataPath}`, 'Import Template')
  });

  it('Delete device import', () => {
    cy.openPageInDevicesNav('Device/Template')
    cy.get('.table__nav--search input').first().clear({force: true}).type(deviceImportName)
    cy.get('.ag-row').contains(new RegExp(`^(${deviceImportName})`, "g")).first().click({ force: true })
    cy.deleteRecordByName(deviceImportName, 'Delete Device', true)
    cy.get('.table__nav--search input').first().clear()
  });
})
