import './app-preferences.cy'
import './map-preferences.cy'
import './device-template.cy'
import './login-profile.cy'

describe('Project Settings', () => {
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

    // Landing project page
    cy.getByDataCy('btn-create-new').click()

    // Click on the first project
    cy.addNewProject(blankProject, true)

    // Open project just created
    cy.openProjectByName(blankProject.name)
    cy.wait(3000)
  });

  it('2. Create a random project', function () {
    cy.visit('/')

    // Landing project page
    cy.getByDataCy('btn-create-new').click()

    // Click on the first project
    cy.addNewProject(project, true)

    // Open project just created
    cy.openProjectByName(project.name)
    cy.wait(3000)
  });

  it('3. Import a saved map (West_ISP.json)', function () {
    cy.visit('/')
    cy.importProject('cypress/fixtures/project/West_ISP.json')
    cy.openProjectByName(projectImport.collection[0].name)
    cy.get('.tool-panel-actions button[mattooltip="Save"]').first().click()
    cy.wait(2000)
  });

  it('4. Export West_ISP Project', () => {
    cy.visit('/')
    cy.exportProject(projectImport.collection[0].name, false)
    cy.wait(3000)
  })

  it('5. Save as Project Template (Editing project change category from project to template)', () => {
    cy.openProjectByName(projectImport.collection[0].name)
    cy.updateProjectToTemplate(projectImport.collection[0].name, true)
  });

  it('6. Clone random project', () => {
    cy.visit('/')
    cy.cloneProject(project.name, 'template', false)
    cy.wait(3000)
  });


  it('7. Delete random project', () => {
    cy.visit('/')
    cy.deleteProject(project.name, false)
    cy.wait(3000)
  })

  it('8. Permanently delete random project', () => {
    cy.visit('/')
    cy.deletePermanentlyProject(project.name, false)
    cy.wait(3000)
  })

})
