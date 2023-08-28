describe('Physical Map features e2e testing', () => {
  let node: any = {};
  let node2: any = {};
  let node3: any = {};
  let node4: any = {};
  let project: any = {};
  let nodeX: number;
  let nodeY: number;
  let nodeX2: number;
  let nodeY2: number;
  let nodeX3: number;
  let nodeY3: number;
  let nodeX4: number;
  let nodeY4: number;
  let edge: any = {};
  const random = (Math.random() + 1).toString(36).substring(5);

  beforeEach(() => {
    cy.viewport(1920, 1080)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.fixture('physical-map/node.json').then(nodeData => {
      node = nodeData
      nodeX = node.logical_map.position.x
      nodeY = node.logical_map.position.y
      node2 = JSON.parse(JSON.stringify(node))
      node2.device_name = "WIFI Router"
      node2.template_name = "Generic WIFI Router"
      nodeX2 = nodeX
      nodeY2 = nodeY - 200
      node3 = JSON.parse(JSON.stringify(node))
      node3.device_name = "WIFI Router"
      node3.template_name = "Generic WIFI Router"
      nodeX3 = nodeX + 200
      nodeY3 = nodeY - 200
      node4 = JSON.parse(JSON.stringify(node))
      nodeX4 = nodeX + 200
      nodeY4 = nodeY
    })
    cy.fixture('physical-map/edge.json').then(edgeData => {
      edge = edgeData
    })
    cy.fixture('project/new-project.json').then(projectData => {
      project = projectData
      project.name = "Test map - East ISP"
      project.description = "East cluster representing part of the grayspace"
      project.option = 'blank'
      project.name += ` (${random})`
    })
    cy.session('login', setup)
  })

  it ('Create new blank project and add node', () => {
    cy.visit('/')
    cy.waitingLoadingFinish()
    cy.getByDataCy('btn-create-new').click({force: true})
    cy.addNewProject(project, true)
    cy.waitingLoadingFinish()
    cy.openProjectByName(project.name)
    cy.waitingLoadingFinish()

    cy.get('.switch-map').click();

    // add new node
    cy.addNewNodeOnMap(node, nodeX, nodeY, false)

    cy.addNewNodeOnMap(node2, nodeX2, nodeY2, false)

    cy.addNewNodeOnMap(node3, nodeX3, nodeY3, false)

    cy.addNewNodeOnMap(node4, nodeX4, nodeY4, false)

    cy.connectInterface(nodeX, nodeY, nodeX2, nodeY2)


    cy.addNewSourceInterfaces(edge)

    cy.addNewTargetInterfaces(edge)

    // Connect Interface
    cy.getByFormControlName('sourceInterfaceCtr').click({force: true})
    cy.get('.option-text-items').contains('eth1').first().click()

    cy.getByFormControlName('destinationInterfaceCtr').click({force: true})
    cy.get('.option-text-items').contains('eth1').first().click()
    cy.get('mat-error').should('not.exist')
    cy.getByDataCy('connectInterfacePhysicalForm').submit()
    cy.checkingToastSuccess()
    cy.waitingLoadingFinish()

    cy.connectInterface(nodeX3, nodeY3, nodeX4, nodeY4)

    cy.addNewSourceInterfaces(edge)

    cy.addNewTargetInterfaces(edge)

    // Connect Interface
    cy.getByFormControlName('sourceInterfaceCtr').click({force: true})
    cy.get('.option-text-items').contains('eth1').first().click()

    cy.getByFormControlName('destinationInterfaceCtr').click({force: true})
    cy.get('.option-text-items').contains('eth1').first().click()
    cy.get('mat-error').should('not.exist')
    cy.getByDataCy('connectInterfacePhysicalForm').submit()
    cy.checkingToastSuccess()
    cy.waitingLoadingFinish()

    cy.unSelectAllElementOnMap()
    cy.get('canvas.expand-collapse-canvas').rightclick(300, 200,{force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#delete').should('exist').click({ force: true })
      cy.waitingLoadingFinish()
      cy.checkingToastSuccess()
      })
    cy.wait(2000)
    cy.unSelectAllElementOnMap()
    cy.get('canvas.expand-collapse-canvas').click(500, 200, { force: true })
    .rightclick(500, 200,{force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#edit').should('exist').click({ force: true })
      cy.wait(1000)
      cy.getByFormControlName('destinationInterfaceCtr').click({force: true})
      cy.get('.option-text-items').contains('wifi-router').first().click()
      cy.getByDataCy('connectInterfacePhysicalForm').submit()
      cy.checkingToastSuccess()
      cy.waitingLoadingFinish()
      })
  });
    
})
