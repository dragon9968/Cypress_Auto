describe('Project export, import, clone to template',{testIsolation: true}, () => {
  let project:any = {}
  let newProjectTemplate: any = {}
  const random = (Math.random() + 1).toString(36).substring(5);
  beforeEach(() => {
    cy.viewport(window.screen.width, window.screen.height)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
    cy.fixture('project/new-project-import-export.json').then(projectData => {
      project = projectData
      project.name += ` (${random})`
    })
    cy.fixture('project/new-project-template.json').then(projectTemplateData => {
      newProjectTemplate = projectTemplateData
      newProjectTemplate.name += ` (${random})`
    })
  })

  it('Test - Add new project with custom network',() => {
    cy.visit('/')
    cy.getByDataCy('btn-create-new').click()
    cy.addNewProject(project, false)
  });

  it('Test - Export project', () => {
    cy.visit('/')
    cy.exportProject(project.name, false)
  })

  it('Test - Import project', () => {
    cy.visit('/')
    cy.importProject('cypress/fixtures/project/project-export.json')
  });

  it('Test - Clone project to template ', () => {
    cy.visit('/')
    cy.cloneProject(project.name, 'template', false)
  });

  it('Test - Import project is containing template', () => {
    cy.visit('/')
    cy.getByDataCy('btn-create-new').click()
    cy.addNewProject(newProjectTemplate, true)

    project.name += ' - blank'
    project.option = 'blank'
    cy.visit('/')
    cy.getByDataCy('btn-create-new').click()
    cy.addNewProject(project, true)

    cy.addTemplateIntoProject(project.name, false, newProjectTemplate.name)

    const nameProjectExport = `Export-Project-${random}`
    cy.exportProject(project.name, false, nameProjectExport)
    cy.wait(1000)
    cy.importProject(`cypress/downloads/${nameProjectExport}.json`)
  });
})
