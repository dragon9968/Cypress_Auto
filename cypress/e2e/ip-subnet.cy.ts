describe('Test IP/Subnet in a interface on map', () => {
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
    cy.viewport(window.screen.width, window.screen.height)
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

  it('Test IP/Subnet in a interface on map',() => {
    cy.login(admin.username, admin.password)
    // Landing project page
    cy.getByDataCy('btn-create-new').click()

    // Click on the first project
    cy.addNewProject(project, true)

    // Open project just created
    cy.get('ag-grid-angular').contains(project.name).dblclick()

    // Add new node 1
    cy.addNewNodeOnMap(node, node.logical_map_position.x, node.logical_map_position.y, false)

    // Add new node 2
    cy.addNewNodeOnMap(node2, node2.logical_map_position.x, node2.logical_map_position.y, false)

    // Add new port group
    cy.addNewPortGroupOnMap(portGroup, portGroup.logical_map_position.x, portGroup.logical_map_position.y, true)

    const edgeData1 = {
      ip_allocation: 'static_manual',
      ip_address: '192.168.229.52'
    }
    const edgeData2 = {
      ip_allocation: 'static_manual',
      ip_address: '192.168.229.88'
    }

    // Add new interface from node 1
    cy.addNewInterface(edgeData1, nodeX, nodeY, pgX, pgY, false)

    cy.addNewInterface(edgeData2, nodeX2, nodeY2, pgX, pgY, false)


    const editEdgeData = {
      ip_allocation: 'static_manual',
      ip_address: '192.168.229.88'
    }

    const ipInSubnet = {
      ip_allocation: 'static_manual',
      ip_address: '192.168.20.88'
    }

    const ipInvalid = {
      ip_allocation: 'static_manual',
      ip_address: '10.239.250.10AAA'
    }

    // Update interface
    cy.get('#cy').then((el: any) => {
      const cytoscape = el[0]._cyreg.cy
      cytoscape.nodes().unselect()
      cytoscape.edges().unselect()
    })
    cy.wait(4000)

    // check update netmask
    cy.get('canvas.expand-collapse-canvas').rightclick(400, 300, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#edit').should('exist').click({ force: true });
      cy.getByFormControlName('netMaskCtr').click({ force: true })
      cy.get('.option-text').contains('255.192.0.0').first().click()
      cy.get('mat-error').should('not.exist')
      cy.getByDataCy('interfaceAddForm').submit()
      cy.wait(2000)

    })
    
    cy.wait(2000)
    cy.get('canvas.expand-collapse-canvas').rightclick(400, 300, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#edit').should('exist').click({ force: true });
      cy.getByFormControlName('ipAllocationCtr').children(`mat-radio-button[value="${editEdgeData.ip_allocation}"]`).click()
      // check Validation for ip_address duplication
      cy.getByFormControlName('ipCtr').clear().type(editEdgeData.ip_address)
      cy.getByFormControlName('dnsServerCtr').clear().type('1.2.3.4')
      cy.get('mat-error').should('exist')
      cy.wait(2000)

      // check Validation for ip_address duplication
      cy.getByFormControlName('ipCtr').clear().type(ipInvalid.ip_address)
      cy.getByFormControlName('dnsServerCtr').clear().type('1.2.3.4')
      cy.get('mat-error').should('exist')
      cy.wait(2000)

      // check Validation for ip_address invalid
      cy.getByFormControlName('ipCtr').clear().type(ipInSubnet.ip_address)
      cy.getByFormControlName('dnsServerCtr').clear().type('1.2.3.4')
      cy.getByDataCy('cy-interface-btn').click()
      cy.get('mat-error').should('exist')
      cy.wait(2000)

    })
  });
})
