describe('Coverage for PortGroup issue', () => {
  let node: any = {}
  let nodeX: number;
  let nodeY: number;
  let portGroup:any = {};
  let pgX: number;
  let pgY: number;
  let pgX2: number;
  let pgY2: number;
  let project: any = {};
  let blankProject:any = {};
  let template: any = {};
  let blankTemplate:any = {};
  let group: any = {};
  const random = (Math.random() + 1).toString(36).substring(5);

  beforeEach(() => {
    cy.viewport(1920, 1080)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.fixture('project/new-project.json').then(projectData => {
      project = projectData
      project.name = "Test map - East ISP"
      project.description = "East cluster representing part of the grayspace"
      project.name += ` (${random})`
      blankProject = JSON.parse(JSON.stringify(project))
      blankProject.option = 'blank'
      blankProject.name =  blankProject.name + ' blank'
      template = projectData
      template.name = "blank template"
      template.category = 'template'
      template.name += ` (${random})`
      blankTemplate = JSON.parse(JSON.stringify(template))
      blankTemplate.option = 'blank'
      blankTemplate.name =  blankTemplate.name + ' blank'
    })
    cy.fixture('map/node.json').then(nodeData => {
      node = nodeData
      nodeX = node.logical_map.position.x
      nodeY = node.logical_map.position.y
    })
    cy.fixture('map/port_group.json').then(portGroupData => {
      portGroup = portGroupData
      pgX = portGroup.logical_map.position.x
      pgY = portGroup.logical_map.position.y
      pgX2 = pgX + 100
      pgY2 = pgY + 100
    })
    cy.fixture('map/node-pg-edge.data.json').then(groupData => {
      group = groupData
      group.category = 'domain'
    })
    cy.session('login', setup)
  })

  it ('Test coverage for PortGroup issues.', () => {
    cy.viewport(1920, 1080)
    cy.visit('/', { timeout: 15000 })
    cy.getByDataCy('btn-create-new').click({force: true})
    cy.addNewProject(blankProject, true)

    cy.openProjectByName(blankProject.name)

    cy.waitingLoadingFinish()

    // Add new group
    cy.selectMatTabByLabel(new RegExp('^group$', 'gi')).click();
    cy.getByMatToolTip('Add new group').click();
    cy.addEditGroup(group.groupData, 'add')
    cy.waitingLoadingFinish()

    // Add new node
    cy.addNewNodeOnMap(node, node.logical_map.position.x, node.logical_map.position.y, false)

    // Add new port group
    cy.addNewPortGroupOnMap(portGroup, portGroup.logical_map.position.x, portGroup.logical_map.position.y, true)

    // Add new port group 2
    cy.addNewPortGroupOnMap(portGroup, pgX2, pgY2, false)

    const edgeData1 = {
      ip_allocation: 'static_manual',
      ip_address: '192.168.229.52'
    }

    // Add new interface from node
    cy.addNewInterface(edgeData1, nodeX, nodeY, pgX, pgY, false)

    cy.selectMatTabByLabel('Option').click();
    cy.getMatSliderToggleByClass('.groupboxes-toggle').check({ force: true })
    cy.get('button[matTooltip="Save"]').click()

    // [Port Group] Edit Form - generate new subnet should when category is changed
    cy.selectElementOnMap('node', 'cro_net_66gzpdrp')
    cy.get('canvas.expand-collapse-canvas').rightclick(700, 300, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#edit').should('exist').click({ force: true });
      cy.getByFormControlName('nameCtr').clear().type('cro_net')
      cy.getByFormControlName('categoryCtr').children(`mat-radio-button[value="public"]`).click()
      cy.getByFormControlName('subnetAllocationCtr').children(`mat-radio-button[value="static_auto"]`).click()
      cy.get('#pg-subnet').should('not.have.value', portGroup.subnet)
      cy.get('mat-error').should('not.exist')
      cy.getByDataCy('pgAddForm').submit()
      cy.wait(2000)
    })

    cy.unSelectAllElementOnMap()

    cy.get('canvas.expand-collapse-canvas').rightclick(800, 400, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#edit').should('exist').click({ force: true });
      cy.getByFormControlName('nameCtr').clear().type('test_delete_port_group')
      cy.get('mat-error').should('not.exist')
      cy.getByDataCy('pgAddForm').submit()
      cy.wait(2000)
    })

    cy.get(`app-info-panel-group ag-grid-angular .ag-row`).contains(group.groupEditDefaultData.name)
    .parent('.ag-cell-wrapper').parent('.ag-cell').parent('.ag-row').should('contain', "cro_net")

    cy.wait(2000)

    // [Edge Edit] The port group should be updated on Edge Edit screen when the port group is deleted
    cy.get('canvas.expand-collapse-canvas').rightclick(pgX2, pgY2, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#delete').should('exist').click({ force: true });
      cy.wait(2000)
    })
    cy.get('button[matTooltip="Save"]').click()
    cy.get('canvas.expand-collapse-canvas').rightclick(400, 300, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#edit').should('exist').click({ force: true });
      cy.getByFormControlName('portGroupCtr').click({force: true })
      cy.get('.option-text-items').should('not.contain', 'test_delete_port_group')
      cy.getButtonByTypeAndContent('button', 'Cancel').click({ force: true })
      cy.wait(2000)
    })

    cy.unSelectAllElementOnMap()

    cy.get('canvas.expand-collapse-canvas').rightclick(700, 300, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#view_details').should('exist').click({ force: true });
    })
    cy.wait(4000)
  })

  it ('Create new blank template', () => {
    cy.viewport(1920, 1080)
    cy.visit('/', { timeout: 15000 })
    cy.getByDataCy('btn-create-new').click({force: true})
    cy.addNewProject(blankTemplate, true)

    cy.visit('/projects/templates', { timeout: 15000 })
    cy.waitingLoadingFinish()
    cy.get('#search-project').type(blankTemplate.name, { timeout: 10000})
    cy.wait(2000)
    cy.get('ag-grid-angular').contains(blankTemplate.name, { timeout: 10000}).first().dblclick()
    cy.waitingLoadingFinish()
    cy.get('#cy', { timeout: 10000 }).should('exist')
    cy.url().should('include', 'map')
    cy.waitingLoadingFinish()

    cy.waitingLoadingFinish()

    // Add new node
    cy.addNewNodeOnMap(node, node.logical_map.position.x, node.logical_map.position.y, false)

    // Add new port group
    cy.addNewPortGroupOnMap(portGroup, portGroup.logical_map.position.x, portGroup.logical_map.position.y, true)

    const edgeData1 = {
      ip_allocation: 'static_manual',
      ip_address: '192.168.229.52'
    }

    // Add new interface from node
    cy.addNewInterface(edgeData1, nodeX, nodeY, pgX, pgY, false)
    cy.waitingLoadingFinish()
    cy.selectMatTabByLabel('Option').click();
    cy.getMatSliderToggleByClass('.groupboxes-toggle').check({ force: true })
    cy.get('button[matTooltip="Save"]').click()
    cy.waitingLoadingFinish()
  })

  it ("Test - [Regression Issue] Template's Port group that user linked to project is displayed incorrectly", () => {
    cy.viewport(1920, 1080)
    cy.visit('/', { timeout: 15000 })
    cy.getByDataCy('btn-create-new').click({force: true})
    blankProject.name = blankProject.name + '(1)'
    cy.addNewProject(blankProject, true)

    cy.addTemplateIntoProject(blankProject.name, false, blankTemplate.name)

    cy.selectMatTabByLabel('Option').click();
    cy.getMatSliderToggleByClass('.groupboxes-toggle').check({ force: true })
    cy.get('button[matTooltip="Save"]').click()
    cy.waitingLoadingFinish()

    cy.selectMatTabByLabel(new RegExp('^group$', 'gi')).click();
    cy.get(`app-info-panel-group ag-grid-angular .ag-row`).contains(group.groupEditDefaultData.name)
    .parent('.ag-cell-wrapper').parent('.ag-cell').parent('.ag-row').should('contain', "cro_net_66gzpdrp")
    cy.wait(2000)
  })
})
