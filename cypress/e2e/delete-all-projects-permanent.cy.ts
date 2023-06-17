describe('Test - Clone a new project from the nodes that are selected', {testIsolation: true}, () => {
  beforeEach(() => {
    cy.viewport(window.screen.width, window.screen.height)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
  })

  it('Permanently delete all projects in the trash bin', () => {
    cy.visit('/')
    cy.deletePermanentlyProject('', true)
    cy.wait(3000)
  })
})
