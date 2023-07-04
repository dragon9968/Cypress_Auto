describe('[Map Editor] Failed to save map when user deletes the edge', {testIsolation: true}, () => {
  let node: any = {}
  let portGroup:any = {};
  let pgX: number;
  let pgY: number;
  let nodeX: number;
  let nodeY: number;
  let project:any = {}
  const random = (Math.random() + 1).toString(36).substring(5);
  beforeEach(() => {
    cy.viewport(window.screen.width, window.screen.height)
    cy.fixture('map/node.json').then(nodeData => {
      node = nodeData
      nodeX = node.logical_map.position.x
      nodeY = node.logical_map.position.y
    })
    cy.fixture('map/port_group.json').then(portGroupData => {
      portGroup = portGroupData
      pgX = portGroup.logical_map.position.x
      pgY = portGroup.logical_map.position.y
    })

    cy.fixture('project/new-project.json').then(projectData => {
      project = projectData
      project.name += ` - (${random})`
      project.option = 'blank'
    })
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
  })

  it('Test - Delete a edge and save map',() => {
    cy.visit('/')
    cy.getByDataCy('btn-create-new').click()
    cy.addNewProject(project, true)
    cy.openProjectByName(project.name)
    cy.addNewNodeOnMap(node, node.logical_map.position.x, node.logical_map.position.y, false)
    cy.addNewPortGroupOnMap(portGroup, portGroup.logical_map.position.x, portGroup.logical_map.position.y, false)
    cy.addNewInterface(undefined, nodeX, nodeY, pgX, pgY, false)
    cy.unSelectAllElementOnMap()
    cy.deleteInterfaceOnMap(500, 300)
  });
})
