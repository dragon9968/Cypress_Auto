describe('Clone map tests', {testIsolation: true}, () => {
  let admin: any = {}
  let node: any = {}
  let node2: any = {}
  let portGroup:any = {};
  let pgX: number;
  let pgY: number;
  let nodeX: number;
  let nodeY: number;
  let nodeX2: number;
  let nodeY2: number;
  let project:any = {}
  const domain = {
    name: 'helio.test'
  }
  const random = (Math.random() + 1).toString(36).substring(5);
  beforeEach(() => {
    cy.viewport(window.screen.width, window.screen.height)
    cy.fixture('map/node.json').then(nodeData => {
      node = nodeData
      nodeX = node.logical_map.position.x
      nodeY = node.logical_map.position.y
      nodeX2 = nodeX
      nodeY2 = nodeY - 200
      node2 = JSON.parse(JSON.stringify(node))
      node2.logical_map.position.y = nodeY2
    })
    cy.fixture('map/port_group.json').then(portGroupData => {
      portGroup = portGroupData
      pgX = portGroup.logical_map.position.x
      pgY = portGroup.logical_map.position.y
    })

    cy.fixture('project/new-project.json').then(projectData => {
      project = projectData
      project.option = 'blank'
      project.name += ` (${random})`
    })
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
  })

  it('Create new a project',() => {
    cy.visit('/')
    // Landing project page
    cy.getByDataCy('btn-create-new').click()

    // Click on the first project
    cy.addNewProject(project, true)

    // Open project just created
    cy.openProjectByName(project.name)

    // Add new node 1
    cy.addNewNodeOnMap(node, node.logical_map.position.x, node.logical_map.position.y, false)

    // Add new node 2
    cy.addNewNodeOnMap(node2, node2.logical_map.position.x, node2.logical_map.position.y, true)

    // Add new port group
    cy.addNewPortGroupOnMap(portGroup, portGroup.logical_map.position.x, portGroup.logical_map.position.y, false)

    // Add new interface from node 1
    cy.addNewInterface(undefined, nodeX, nodeY, pgX, pgY)

    // Add new interface from node 2
    cy.addNewInterface(undefined, nodeX2, nodeY2, pgX, pgY)

    // Add new domain
    cy.selectMatTabByLabel('Domains').click();
    cy.getByMatToolTip('Add new domain').click({ force: true });
    cy.addEditDomain(domain, 'add')

  });

  it('Clone project just created', function () {
    cy.cloneProject(project.name, 'project', false)
  });

  it('Open cloned project, turn on group box, change domain', function () {
    cy.openProjectByName(`${project.name} clone`)

    // Turn on group box
    cy.selectMatTabByLabel('Option').click();
    cy.getMatSliderToggleByClass('.groupboxes-toggle').check({ force: true })
    // Save map
    cy.getByMatToolTip('Save').click()
    cy.checkingToastSuccess()

    // Select node
    cy.selectElementOnMap('node', node.name)

    // Change domain
    cy.selectMatTabByLabel('Nodes').click();
    cy.getByMatToolTip('Edit').click();
    cy.get('mat-dialog-container', {timeout: 10000}).should('exist')
    cy.getByFormControlName('domainCtr').click()
    cy.get('.mat-option-text').contains(domain.name).first().click()
    cy.getButtonByTypeAndContent('submit', 'Update').click()
    cy.checkingToastSuccess()

    // Save map
    cy.getByMatToolTip('Save').click()
    cy.checkingToastSuccess()
  });

})
