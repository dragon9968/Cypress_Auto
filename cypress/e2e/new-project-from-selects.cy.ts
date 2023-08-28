describe('Test - Clone a new project from the nodes that are selected', {testIsolation: true}, () => {
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
  let project:any = {};
  const random = (Math.random() + 1).toString(36).substring(5);
  const nameProject = `Project from nodes that are selected ${random}`
  beforeEach(() => {
    cy.viewport(window.screen.width, window.screen.height)
    cy.fixture('login/admin.json').then(adminData => {
      admin = adminData
    })
    cy.fixture('map/node.json').then(nodeData => {
      node = nodeData
      nodeX = node.logical_map_position.x
      nodeY = node.logical_map_position.y
      nodeX2 = nodeX
      nodeY2 = nodeY - 200
      node2 = JSON.parse(JSON.stringify(node))
      node2.logical_map_position.y = nodeY2
    })
    cy.fixture('map/port_group.json').then(portGroupData => {
      portGroup = portGroupData
      pgX = portGroup.logical_map_position.x
      pgY = portGroup.logical_map_position.y
    })

    cy.fixture('project/new-project.json').then(projectData => {
      project = projectData
      project.name += `blank (${random})`
      project.option = 'blank'
    })
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
  })

  it('Clone a new project from the nodes that are selected',() => {
    cy.visit('/')
    cy.log('Landing project page')
    cy.getByDataCy('btn-create-new').click()

    cy.log('Click on the first project')
    cy.addNewProject(project, true)

    cy.log('Open project just created')
    cy.get('ag-grid-angular').contains(project.name).dblclick()

    cy.log('Add new node 1')
    cy.addNewNodeOnMap(node, node.logical_map_position.x, node.logical_map_position.y, false)

    cy.log('Add new node 2')
    cy.addNewNodeOnMap(node2, node2.logical_map_position.x, node2.logical_map_position.y, false)

    cy.log('Add new port group')
    cy.addNewPortGroupOnMap(portGroup, portGroup.logical_map_position.x, portGroup.logical_map_position.y, false)

    cy.log('Add new interface from node')
    cy.addNewInterface({}, nodeX, nodeY, pgX, pgY, false)

    cy.log('Add new interface from node 1')
    cy.addNewInterface({}, nodeX2, nodeY2, pgX, pgY, false)

    cy.log('Select on nodes')
    cy.get('#cy').then((cyElement: any) => {
      cyElement[0]._cyreg.cy.nodes().select()
    })

    cy.log('Scroll to button Clone selected items to new a project')
    cy.get('mat-sidenav').scrollTo('bottom', { ensureScrollable: false })

    cy.getByDataCy('btn-create-from-selected').click()
    cy.checkingIsToastWarningExistOrNot(false)
    cy.waitingLoadingFinish()

    cy.log('Clone a new project from the nodes that are selected')
    cy.getByFormControlName('name').type(nameProject).blur()
    cy.checkingMatErrorIsExistOrNot(false)
    cy.getButtonByTypeAndContent('submit', 'Create').click()
    cy.checkingToastSuccess()
  });

  it('Delete random project', () => {
    cy.visit('/')
    cy.deleteProject(project.name, false)
    cy.wait(3000)
  })

  it('Delete project clone', () => {
    cy.visit('/')
    cy.deleteProject(nameProject, false)
    cy.wait(3000)
  })

  it('Permanently delete random project', () => {
    cy.visit('/')
    cy.deletePermanentlyProject(project.name, false)
    cy.wait(3000)
  })

  it('Permanently delete project clone', () => {
    cy.visit('/')
    cy.deletePermanentlyProject(nameProject, false)
    cy.wait(3000)
  })

})
