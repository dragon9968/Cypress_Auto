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

  it ('Test update interface form.', () => {
    cy.viewport(1920, 1080)
    cy.visit('/', { timeout: 15000 })
    cy.getByDataCy('btn-create-new').click({force: true})
    cy.addNewProject(blankProject, true)

    cy.openProjectByName(blankProject.name)

    cy.waitingLoadingFinish()

    // Add new node
    cy.addNewNodeOnMap(node, node.logical_map.position.x, node.logical_map.position.y, false)

    // Add new port group
    cy.addNewPortGroupOnMap(portGroup, portGroup.logical_map.position.x, portGroup.logical_map.position.y, true)

    const edgeData1 = {
      ip_allocation: 'static_manual',
      ip_address: '192.168.229.52'
    }

    const vlanIdInvalid= {
      invalidChar: "AAA",
      invalidRange: "4096",
      invalidMinVlanGreaterThanMaxVlan: "400-300",
      invalidRangeVlan: "-300",
      invalidMultiVlan: "1,2,3,-100",
      invalidCharMultiVlan: "1,2,3,AAA",
      invalidMinVlanGreaterThanMaxVlanMultiVlan: "1,2,3,400-300",
      invalidVlanIdIncludesComma:  "23,24-45,345-4000,455555",
      vlanIdMessageDuplicatied:  "0,1,2,3,4,5,6,77-344-n",
      validValue: "1,2,3,300-400"
    }
    
    // Add new interface from node
    cy.addNewInterface(edgeData1, nodeX, nodeY, pgX, pgY, false)
  
    // [Port Group] Edit Form - generate new subnet should when category is changed
    cy.selectElementOnMap('edge', 'eth1')
    cy.get('canvas.expand-collapse-canvas').rightclick(400, 300, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#edit').should('exist').click({ force: true });
      cy.getByFormControlName('vlanIdCtr').clear().type(vlanIdInvalid.invalidChar)
      cy.getByFormControlName('vlanModeCtr').click({ force: true });
      cy.get(`mat-option[value="access"]`).click()
      cy.get('mat-error').should('exist')
      cy.wait(2000)
      // 
      cy.getByFormControlName('vlanIdCtr').clear().type(vlanIdInvalid.invalidRange)
      cy.getByFormControlName('vlanModeCtr').click({ force: true });
      cy.get(`mat-option[value="access"]`).click()
      cy.get('mat-error').should('exist')
      cy.wait(2000)
      // 
      cy.getByFormControlName('vlanIdCtr').clear().type(vlanIdInvalid.invalidMinVlanGreaterThanMaxVlan)
      cy.getByFormControlName('vlanModeCtr').click({ force: true });
      cy.get(`mat-option[value="access"]`).click()
      cy.get('mat-error').should('exist')
      cy.wait(2000)
      // 
      cy.getByFormControlName('vlanIdCtr').clear().type(vlanIdInvalid.invalidRangeVlan)
      cy.getByFormControlName('vlanModeCtr').click({ force: true });
      cy.get(`mat-option[value="access"]`).click()
      cy.get('mat-error').should('exist')
      cy.wait(2000)
      // 
      cy.getByFormControlName('vlanIdCtr').clear().type(vlanIdInvalid.invalidMultiVlan)
      cy.getByFormControlName('vlanModeCtr').click({ force: true });
      cy.get(`mat-option[value="access"]`).click()
      cy.get('mat-error').should('exist')
      cy.wait(2000)
      // 
      cy.getByFormControlName('vlanIdCtr').clear().type(vlanIdInvalid.invalidCharMultiVlan)
      cy.getByFormControlName('vlanModeCtr').click({ force: true });
      cy.get(`mat-option[value="access"]`).click()
      cy.get('mat-error').should('exist')
      cy.wait(2000)
      // 
      cy.getByFormControlName('vlanIdCtr').clear().type(vlanIdInvalid.invalidMinVlanGreaterThanMaxVlanMultiVlan)
      cy.getByFormControlName('vlanModeCtr').click({ force: true });
      cy.get(`mat-option[value="access"]`).click()
      cy.get('mat-error').should('exist')
      cy.wait(2000)

      // 
      cy.getByFormControlName('vlanIdCtr').clear().type(vlanIdInvalid.invalidVlanIdIncludesComma)
      cy.getByFormControlName('vlanModeCtr').click({ force: true });
      cy.get(`mat-option[value="access"]`).click()
      cy.get('mat-error').should('exist')
      cy.wait(2000)

      // 
      cy.getByFormControlName('vlanIdCtr').clear().type(vlanIdInvalid.vlanIdMessageDuplicatied)
      cy.getByFormControlName('vlanModeCtr').click({ force: true });
      cy.get(`mat-option[value="access"]`).click()
      cy.get('mat-error').should('exist')
      cy.wait(2000)
      // 
      cy.getByFormControlName('vlanIdCtr').clear().type(vlanIdInvalid.validValue)
      cy.getByFormControlName('vlanModeCtr').click({ force: true });
      cy.get(`mat-option[value="access"]`).click()
      cy.get('mat-error').should('not.exist')
      cy.getByDataCy('interfaceAddForm').submit()

      cy.wait(2000)
    })
    cy.waitingLoadingFinish()

    cy.get('canvas.expand-collapse-canvas').rightclick(400, 300, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#view_details').should('exist').click({ force: true });
      cy.getByDataCy('select-vlanmode').invoke('attr', 'class').should('contain', 'mat-select-disabled')
    })
    cy.wait(4000)
  })
})