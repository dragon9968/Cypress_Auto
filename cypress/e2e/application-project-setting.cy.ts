import './app-preferences.cy'
import './map-preferences.cy'
import './device-template.cy'
import './login-profile.cy'

describe('Project Settings', {testIsolation: true}, () => {
  let project:any = {}
  let blankProject:any = {}
  let projectImport:any = {}
  const random = (Math.random() + 1).toString(36).substring(5);
  beforeEach(() => {
    cy.viewport(window.screen.width, window.screen.height)
    cy.fixture('project/new-project.json').then(projectData => {
      project = projectData
      project.name += ` (${random})`
      blankProject = JSON.parse(JSON.stringify(project))
      blankProject.option = 'blank'
      blankProject.name =  blankProject.name + ' blank'
    })
    cy.fixture('project/West_ISP.json').then(projectData => {
      projectImport = projectData
    })
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
  })

  it('1. Create a blank project', function () {
    cy.visit('/')
    cy.getByDataCy('btn-create-new').click()
    cy.addNewProject(blankProject, true)
    cy.openProjectByName(blankProject.name)
  });

  it('2. Create a random project', function () {
    cy.visit('/')
    cy.getByDataCy('btn-create-new').click()
    cy.addNewProject(project, true)
    cy.openProjectByName(project.name)
  });

  it('3. Import a saved map (West_ISP.json)', function () {
    cy.visit('/')
    cy.importProject('cypress/fixtures/project/West_ISP.json')
    cy.openProjectByName(projectImport.collection[0].name)
    cy.waitingLoadingFinish()
    cy.get('.tool-panel-actions button[mattooltip="Save"]').first().click()
    cy.checkingToastSuccess()
  });

  it('4. Export West_ISP Project', () => {
    cy.visit('/')
    cy.exportProject(projectImport.collection[0].name, false)
  })

  it('5. Save as Project Template (Editing project change category from project to template)', () => {
    cy.visit('/')
    cy.openProjectByName(projectImport.collection[0].name)
    cy.updateProjectToTemplate(projectImport.collection[0].name, true)
  });

  it('6. Clone random project', () => {
    cy.visit('/')
    cy.cloneProject(project.name, 'template', false)
  });


  it('7. Delete random project', () => {
    cy.visit('/')
    cy.deleteProject(project.name, false)
  })

  it('8. Permanently delete random project', () => {
    cy.visit('/')
    cy.deletePermanentlyProject(project.name, false)
  })

  it('9. Import old project data without any errors', function () {
    cy.visit('/')
    cy.importProject('cypress/fixtures/project/project-dev-old.json')
    cy.checkingToastSuccess()
  });

})
