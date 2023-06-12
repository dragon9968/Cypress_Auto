describe('Project export, import, clone to template', () => {
  let project:any = {}
  beforeEach(() => {
    cy.viewport(window.screen.width, window.screen.height)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
    cy.fixture('project/new-project-import-export.json').then(projectData => {
      project = projectData
    })
  })

  it('Test - Add new project with custom network',() => {
    cy.visit('/')
    cy.getByDataCy('btn-create-new').click()
    cy.addNewProject(project, false)
    cy.wait(3000)
  });

  it('Test - Export project', () => {
    cy.visit('/')
    cy.exportProject(project.name, false)
    cy.wait(3000)
  })

  it('Test - Import project', () => {
    cy.visit('/')
    cy.importProject('cypress/fixtures/project/project-export.json')
    cy.wait(3000)
  });

  it('Test - Clone project to template ', () => {
    cy.visit('/')
    cy.cloneProject(project.name, 'template', false)
    cy.wait(3000)
  });
})
