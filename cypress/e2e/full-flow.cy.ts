describe('C.R.O Automation testing full flow', () => {
  let admin:any = {}
  let project:any = {}
  beforeEach(() => {
    cy.viewport(window.screen.width, window.screen.height)
    cy.visit('/login')
    cy.fixture('login/admin.json').then(adminData => {
      admin = adminData
    })
    cy.fixture('project/new-project.json').then(projectData => {
      project = projectData
    })
  })

  it('Login and add new project',() => {
    cy.login(admin.username, admin.password)
    // Landing add project page
    cy.getByDataCy('btn-create-new').click()
    // Add new one
    cy.addNewProject(project)
    // Open project just created
    cy.get('ag-grid-angular').contains(project.name).dblclick().then(() => {
      // Validate project
      cy.getByDataCy('btn-nav-project').should('exist').click().then( () => {
        cy.getByDataCy('btn-nav-project-validate').should('exist').click()
      })
    })
  });
})
