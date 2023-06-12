describe('Test for Node View', () => {
  let admin:any = {}
  let node: any = {}
  let nodeX: number;
  let nodeY: number;
  let portGroup:any = {};
  let pgX: number;
  let pgY: number;
  let cytoscape: any;
  let nodeName: any;
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
      nodeX = node.logical_map_position.x
      nodeY = node.logical_map_position.y
    })
    cy.fixture('map/port_group.json').then(portGroupData => {
      portGroup = portGroupData
      pgX = portGroup.logical_map_position.x
      pgY = portGroup.logical_map_position.y
    })
    cy.waitingLoadingFinish()
  })

  it('Test - Node View', () => {
    cy.login(admin.username, admin.password)

    // Landing project page
    cy.getByDataCy('btn-create-new').click()

    // Click on the first project
    cy.addNewProject(blankProject, true)
    
    // Open project just created
    cy.openProjectByName(blankProject.name)
    cy.wait(3000)

    // Add new node
    cy.addNewNodeOnMap(node, node.logical_map_position.x, node.logical_map_position.y, false)

    // Add new port group
    cy.addNewPortGroupOnMap(portGroup, portGroup.logical_map_position.x, portGroup.logical_map_position.y, true)

    const edgeData1 = {
      ip_allocation: 'static_manual',
      ip_address: '192.168.229.52'
    }

    // Add new interface from node
    cy.addNewInterface(edgeData1, nodeX, nodeY, pgX, pgY, false)

    cy.wait(3000)
    cy.log('END: Added new node')
    // Show View Node
    cy.get('#cy').then((el: any) => {
      cytoscape = el[0]._cyreg.cy
      cytoscape.nodes().unselect()
      cytoscape.edges().unselect()

      cy.get('canvas.expand-collapse-canvas').rightclick(nodeX, nodeY, {force: true}).then(() => {
        cy.get('.cy-context-menus-cxt-menu').first().should('exist')
        cy.get('#view_details').should('exist').click({ force: true })
        cy.getByFormControlName('nameCtr').invoke('val').should('not.be.empty')
        cy.get('#node-device').invoke('val').should('not.be.empty')
        cy.get('input[name="node-device"]').should('be.visible').invoke('val').should('not.be.empty')
        cy.getByFormControlName('domainCtr').should('be.visible').invoke('val').should('not.be.empty')
        cy.getByFormControlName('folderCtr').invoke('val').should('not.be.empty')
        cy.get('input[name="node-template"]').should('be.visible').invoke('val').should('not.be.empty')
        cy.getByFormControlName('roleCtr').should('be.visible').invoke('val').should('not.be.empty')
        cy.getByFormControlName('hostnameCtr').invoke('val').should('not.be.empty')

        // Test interface view
        cy.wait(2000)
        cy.get('.node-area').find('.mat-tab-label').contains('Interfaces').should('be.visible')
        cy.get('.node-area').find('.mat-tab-label').contains('Interfaces').click()
      })
      cy.log('Select Node and check all required fields SUCCESS')
    })
  })
})