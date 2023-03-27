describe('Testing for the login', () => {
  let admin:any = {}
  beforeEach(() => {
    cy.viewport(1366, 768)
    cy.visit('/login')
    cy.fixture('login/admin.json').then(adminData => {
      admin = adminData
    })
  })

  it('Login',() => {
    cy.login(admin.username, admin.password)
  });

})
