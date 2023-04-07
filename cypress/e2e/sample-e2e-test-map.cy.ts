describe('Testing for the login', () => {
  let admin: any = {}
  let node: any = {}
  let nodeName:string = ''
  let portGroupName:string = ''
  let interfaceIp:string = ''
  let portGroup:any = {};
  let pgX: number;
  let pgY: number;
  let nodeX: number;
  let nodeY: number;
  let cytoscape: any;
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
    })
    cy.fixture('map/port_group.json').then(portGroupData => {
      portGroup = portGroupData
      pgX = portGroup.logical_map_position.x
      pgY = portGroup.logical_map_position.y
    })
  })

  it('Sample e2e test on map',() => {
    cy.login(admin.username, admin.password)
    // Landing project page
    cy.getByDataCy('btn-open-project').click()
    // Click on the first project
    cy.get('.ag-row').first().dblclick({ force: true })

    // Add new node
    cy.getByFormControlName('deviceCtr').click()
    cy.get('.option-text').contains(node.device_name).first().click()
    cy.getByFormControlName('templateCtr').click()
    cy.get('.option-text').contains(node.template_name).first().click()
    cy.getByDataCy('btn-add-node').click()
    cy.wait(100)
    cy.get('canvas.expand-collapse-canvas').click(nodeX, nodeY, { force: true });
    cy.getByFormControlName('nameCtr').invoke('val').should('not.eq', '')
      .then(nodeNameInput => {
        cy.wait(100)
        nodeName = nodeNameInput ? nodeNameInput.toString() : 'None'
        cy.getByFormControlName('folderCtr').type(`${node.folder}-${nodeNameInput}`)
      })
    cy.get('mat-error').should('not.exist')
    cy.getByDataCy('nodeAddForm').submit()

    // Add new port group
    const portGroupCategory = portGroup.category == 'public' ? '[matTooltip="Add Public"]' : '[matTooltip="Add Private"]'
    cy.get(portGroupCategory).click()
    cy.get('canvas.expand-collapse-canvas').click(pgX, pgY, { force: true });
    cy.getByFormControlName('nameCtr').invoke('val').should('not.eq', '')
      .then(pgNameInput => {
        cy.wait(100)
        portGroupName = pgNameInput ? pgNameInput.toString() : 'None'
      })
    cy.get('mat-error').should('not.exist')
    cy.getByDataCy('pgAddForm').submit()

    // Add new interface
    cy.wait(2000)
    cy.get('canvas.expand-collapse-canvas').click(nodeX, nodeY, { force: true })
      .rightclick(nodeX, nodeY,{force: true}).then(() => {
        cy.get('.cy-context-menus-cxt-menu').first().should('exist')
        cy.get('#node_interface').should('exist').click({ force: true })
        cy.get('#add_new_interface').should('exist').click({ force: true })
        cy.get('canvas.expand-collapse-canvas').click(pgX, pgY, { force: true });
        cy.getByFormControlName('directionCtr').click().then(() => {
          cy.get('mat-option').contains('Both').click()
        })
        cy.getByFormControlName('ipCtr').invoke('val').should('not.eq', '').then(ipEdge => {
          interfaceIp = ipEdge ? ipEdge.toString() : ''
        })
        cy.get('mat-error').should('not.exist')
        cy.getByDataCy('interfaceAddForm').should('be.visible').submit()
        cy.get('button[matTooltip="Save"]').click()
    })

    // Refresh page
    cy.wait(2000)
    cy.reload()

    cy.wait(2000)
    cy.get('#cy').then((cyElement: any) => {
      cytoscape = cyElement[0]._cyreg.cy
      const newNode = cytoscape.nodes().filter(`[name="${nodeName}"]`)[0]
      const newPG = cytoscape.nodes().filter(`[name="${portGroupName}"]`)[0]
      const newEdge = cytoscape.edges().filter(`[ip="${interfaceIp}"]`)
      newPG.select()

      // Select Node and right click on mouse
      newNode.select()
      cy.get('canvas.expand-collapse-canvas').rightclick(newNode.position('x'), newNode.position('y'), {force: true})
      cy.log('Select Node and right click on mouse SUCCESS')

      // Select port group and right click on mouse
      newPG.select()
      cy.get('canvas.expand-collapse-canvas').rightclick(newPG.position('x'), newPG.position('y'), {force: true})
      cy.log('Select port group and right click on mouse SUCCESS')

      // Select interface on map, and right click.
      newEdge.select()
      cy.log('Select edge and right click on mouse SUCCESS')

    })

  });

})
