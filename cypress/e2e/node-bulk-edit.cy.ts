describe('Test for Node Bulk Edit', () => {
  let admin:any = {}
  let node: any = {};
  let node2: any = {};
  let node3: any = {};
  let nodeX: number;
  let nodeY: number;
  let nodeX2: number;
  let nodeY2: number;
  let nodeX3: number;
  let nodeY3: number;
  let cytoscape: any;
  let project: any = {};
  let blankProject:any = {}
  const random = (Math.random() + 1).toString(36).substring(5);
  beforeEach(() => {
    cy.viewport(1366, 768)
    cy.visit('/login')
    cy.fixture('project/new-project.json').then(projectData => {
      project = projectData
      project.name += ` (${random})`
      blankProject = JSON.parse(JSON.stringify(project))
      blankProject.option = 'blank'
      blankProject.name =  blankProject.name + ' blank'
    })
    cy.fixture('login/admin.json').then(adminData => {
      admin = adminData
    })
    cy.fixture('map/node.json').then(nodeData => {
      node = nodeData
      nodeX = 300
      nodeY = 300
      nodeX2 = 300
      nodeY2 = 100
      nodeX3 = 500
      nodeY3 = 100
      node2 = JSON.parse(JSON.stringify(node))
      node3 = JSON.parse(JSON.stringify(node))
    })
    cy.waitingLoadingFinish()
  })

  it('Test - Node Bulk Edit', () => {
    cy.login(admin.username, admin.password)

    // Landing project page
    cy.getByDataCy('btn-create-new').click()

    // Click on the first project
    cy.addNewProject(blankProject, true)
    
    // Open project just created
    cy.openProjectByName(blankProject.name)
    cy.waitingLoadingFinish()

    // Add new node 2
    cy.addNewNodeOnMap(node2, nodeX2, nodeY2, false)
    cy.get('canvas.expand-collapse-canvas').rightclick(300, 100, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#view_details').should('exist').click({ force: true })
      cy.getButtonByTypeAndContent('button', 'Close').click({ force: true })
    })
    // Add new node
    cy.addNewNodeOnMap(node, nodeX, nodeY, false)

    // Add new node
    cy.addNewNodeOnMap(node3, nodeX3, nodeY3, false)
    cy.waitingLoadingFinish()

    cy.get('#cy').then((el: any) => {
      const cytoscape = el[0]._cyreg.cy
      cytoscape.nodes().select()
      cytoscape.edges().unselect()
    })

    cy.get('canvas.expand-collapse-canvas').rightclick(500, 100, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#edit').should('exist').click({ force: true });
      cy.getByFormControlName('loginProfileCtr').click({ force: true })
      cy.get('.option-text-items').contains('Default Maintenance Account').first().click()
      cy.checkingMatErrorIsExistOrNot()
      cy.getByDataCy('nodeBulkEditForm').submit()
    })
  })
})