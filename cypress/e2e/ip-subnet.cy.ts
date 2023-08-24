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
  const random = (Math.random() + 1).toString(36).substring(5);
  beforeEach(() => {
    cy.viewport(window.screen.width, window.screen.height)
    cy.visit('/login')
    cy.fixture('login/admin.json').then(adminData => {
      admin = adminData
    })
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
      project.name += ` - (${random})`
      project.option = 'blank'
    })

    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
  })

  it('Test IP/Subnet in a interface on map',() => {
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
    cy.addNewNodeOnMap(node2, node2.logical_map.position.x, node2.logical_map.position.y, false)

    // Add new port group
    cy.addNewPortGroupOnMap(portGroup, portGroup.logical_map.position.x, portGroup.logical_map.position.y, true)

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
    cy.unSelectAllElementOnMap()
    cy.wait(2000)

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
      cy.log('Check IP Address is duplicate')
      cy.getByFormControlName('ipCtr').clear().type(editEdgeData.ip_address)
      cy.getByFormControlName('dnsServerCtr').clear().type('1.2.3.4')
      cy.get('mat-error').should('exist')
      cy.wait(2000)

      cy.log('Check IP Address is invalid')
      cy.getByFormControlName('ipCtr').clear().type(ipInvalid.ip_address)
      cy.getByFormControlName('dnsServerCtr').clear().type('1.2.3.4')
      cy.get('mat-error').should('exist')
      cy.wait(2000)

      cy.log('Check IP Address not in port group\'s subnet')
      cy.getByFormControlName('ipCtr').clear().type(ipInSubnet.ip_address)
      cy.getByFormControlName('dnsServerCtr').clear().type('1.2.3.4')
      cy.getByDataCy('cy-interface-btn').click()
      // Todo: Revert to check mat-error after adding the validate for the IP Address in port group's subnet in Edit mode
      // cy.get('mat-error').should('exist')
      cy.get('.toast-error', { timeout: 15000 }).should('exist')
      cy.wait(2000)
    })
  });
})
