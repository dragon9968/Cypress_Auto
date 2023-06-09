describe('Login Profile e2e testing', () => {
  let admin:any = {}
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
    cy.getByDataCy('btn-devices').click()
    cy.get('button>span').contains('Login Profiles').click()
    cy.wait(2000)

    cy.showFormAddByMatTooltip('Add')
    cy.addUpdateNewLoginProfile(loginProfile, 'add')

    cy.wait(3000)
    cy.showFormEditByName(loginProfile.name)
    cy.addUpdateNewLoginProfile(loginProfileUpdate, 'update')

    cy.wait(2000)
    cy.deleteRecordByName(loginProfile.name, 'Delete', false)
    cy.wait(2000)
  });

  it ('Test - Check the Validation format file for import', () => {
    cy.viewport(1366, 768)
    cy.visit('/devices/login_profiles')
    cy.wait(2000)
    cy.getByMatToolTip('Import').click({ force: true })
    cy.wait(2000)
    cy.importLoginProfile(`cypress/fixtures/validation-data/login-profile/LoginProfile.csv`, true)
    cy.wait(3000)
    cy.importLoginProfile(`cypress/fixtures/validation-data/login-profile/images.jpg`, true)
    cy.wait(4000)
  })

  it ('Test - Check import Login Profile', () => {
    cy.viewport(1366, 768)
    cy.visit('/devices/login_profiles')
    cy.wait(2000)
    cy.getByMatToolTip('Import').click({ force: true })
    cy.wait(2000)
    cy.importLoginProfile(`cypress/fixtures/devices-data/login-profile-data/LoginProfile-Data.json`, false)
    cy.wait(4000)
    Cypress.session.clearAllSavedSessions()
  })
})
