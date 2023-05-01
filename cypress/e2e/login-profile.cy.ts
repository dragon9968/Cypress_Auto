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
    cy.visit('/login')
    cy.fixture('login/admin.json').then(
      adminData => admin = adminData
    )
  })

  it('Test - Login Profile',() => {
    cy.login(admin.username, admin.password)
    cy.getByDataCy('btn-devices').click()
    cy.get('button>span').contains('Login Profiles').click()
    cy.wait(2000)

    cy.showFormAddByMatTooltip('Add')
    cy.addUpdateNewLoginProfile(loginProfile, 'add')

    cy.wait(3000)
    cy.showFormEditByName(loginProfile.name)
    cy.addUpdateNewLoginProfile(loginProfileUpdate, 'update')


  });

  afterEach(() => {
    cy.wait(2000)
    cy.deleteRecordByName(loginProfile.name, 'Delete', false)
  })
})
