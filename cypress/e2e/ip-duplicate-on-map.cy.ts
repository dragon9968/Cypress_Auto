describe('Test duplicate IPs in a port group on map', () => {
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
  beforeEach(() => {
    cy.viewport(1366, 768)
    cy.visit('/login')
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
      project.option = 'blank'
    })
  })

  it('Test duplicate IPs in a port group on map',() => {
    cy.login(admin.username, admin.password)
    // Landing project page
    cy.getByDataCy('btn-create-new').click()

    // Click on the first project
    cy.addNewProject(project, true)

    // Open project just created
    cy.get('ag-grid-angular').contains(project.name).dblclick()

    // Add new node 1
    cy.addNewNodeOnMap(node)

    // Add new node 2
    cy.addNewNodeOnMap(node2)

    // Add new port group
    cy.addNewPortGroupOnMap(portGroup)

    const edgeData = {
      ip_allocation: 'static_manual',
      ip_address: '10.213.232.2'
    }
    // Add new interface from node 1
    cy.addNewInterface(edgeData, nodeX, nodeY, pgX, pgY, false)

    // Add new interface from node 2
    cy.addNewInterface(edgeData, nodeX2, nodeY2, pgX, pgY, true)

  });
})
