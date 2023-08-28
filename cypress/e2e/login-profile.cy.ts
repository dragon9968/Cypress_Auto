describe('Login Profile e2e testing', {testIsolation: true}, () => {
  const loginProfile = {
    name: 'Test Login Profile',
    username: 'admin',
    password: 'password'
  }
  const loginProfileUpdate = {
    name: 'Test Login Profile',
    username: 'root',
    updatePassword: 'P@ssw0rd'
  }
  beforeEach(() => {
    cy.viewport(1366, 768)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
  })

  it('Test - Login Profile',() => {
    cy.visit('/')
    cy.openPageInDevicesNav('Login Profiles')
    cy.showFormAddByMatTooltip('Add')
    cy.addUpdateNewLoginProfile(loginProfile, 'add')
    cy.showFormEditByName(loginProfile.name)
    cy.addUpdateNewLoginProfile(loginProfileUpdate, 'update')
    cy.deleteRecordByName(loginProfile.name, 'Delete', false)
  });

  it ('Test - Check the Validation format file for import', () => {
    cy.openPageInDevicesNav('Login Profiles')
    cy.getByMatToolTip('Import').click({ force: true })
    cy.importLoginProfile(`cypress/fixtures/validation-data/login-profile/LoginProfile.csv`, true)
    cy.importLoginProfile(`cypress/fixtures/validation-data/login-profile/images.jpg`, true)
  })

  it ('Test - Check import Login Profile', () => {
    cy.visit('/')
    cy.openPageInDevicesNav('Login Profiles')
    cy.getByMatToolTip('Import').click({ force: true })
    cy.importLoginProfile(`cypress/fixtures/devices-data/login-profile-data/LoginProfile-Data.json`, false)
  })
})
