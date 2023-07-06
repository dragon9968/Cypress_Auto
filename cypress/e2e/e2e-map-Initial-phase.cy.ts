import './images-icon.cy'
import './map-basic-features.cy'
describe('E2E Map - Initial Phase', () => {
  let node: any = {}
  let node2: any = {}
  let nodeX: number;
  let nodeY: number;
  let portGroup:any = {};
  let pgX: number;
  let pgY: number;
  let project: any = {};
  let blankProject:any = {}
  let newProjectTemplate: any = {}

  const random = (Math.random() + 1).toString(36).substring(5);
  beforeEach(() => {
    cy.viewport(1920, 1080)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.fixture('project/new-project.json').then(projectData => {
      project = projectData
      project.name += ` (${random})`
      blankProject = JSON.parse(JSON.stringify(project))
      blankProject.option = 'blank'
      blankProject.name =  blankProject.name + ' blank'
    })
    cy.fixture('project/new-project-template.json').then(projectTemplateData => {
      newProjectTemplate = projectTemplateData
      newProjectTemplate.name += ` (${random})`
      newProjectTemplate = JSON.parse(JSON.stringify(newProjectTemplate))
      // newProjectTemplate.option = 'blank'
      newProjectTemplate.name =  newProjectTemplate.name + ' blank'
    })
    cy.fixture('map/node.json').then(nodeData => {
      node = nodeData
      nodeX = node.logical_map.position.x
      nodeY = node.logical_map.position.y
      node2 = JSON.parse(JSON.stringify(node))
    })
    cy.fixture('map/port_group.json').then(portGroupData => {
      portGroup = portGroupData
      pgX = portGroup.logical_map.position.x
      pgY = portGroup.logical_map.position.y
    })
    cy.session('login', setup)
    // cy.waitingLoadingFinish()
  })

  it ('Check - Create new project template and add new images', () => {
    cy.visit('/', { timeout: 15000 })
    cy.waitingLoadingFinish()
    // Landing project page
    cy.getByDataCy('btn-create-new').click()

    // Click on the first project
    cy.addNewProject(newProjectTemplate, true)

    // Open project just created
    cy.visit('/projects/templates', { timeout: 15000 })
    cy.waitingLoadingFinish()
    cy.get('#search-project').type(newProjectTemplate.name, { timeout: 10000})
    cy.wait(2000)
    cy.get('ag-grid-angular').contains(newProjectTemplate.name, { timeout: 10000}).first().dblclick()
    cy.waitingLoadingFinish()
    cy.get('#cy', { timeout: 10000 }).should('exist')
    cy.url().should('include', 'map')
    cy.waitingLoadingFinish()

    cy.get('#toolpanel-image').click();
    cy.getOptionByContent('import-image').first().click();
    cy.getByDataCy('mapImageForm').submit();
    cy.wait(4000)
    cy.get('canvas.expand-collapse-canvas').click(450, 250, { force: true });
    cy.wait(4000)

  })

  it ('Check - E2E Map - Initial Phase', () => {
    cy.visit('/', { timeout: 15000 })
    // Landing project page
    cy.getByDataCy('btn-create-new').click()
    // Click on the first project
    cy.addNewProject(blankProject, true)

    // import link project
    cy.importProject('cypress/fixtures/project/project-export.json')

    // Open project just created
    cy.openProjectByName(blankProject.name)
    cy.waitingLoadingFinish()

    // Add new node
    cy.addNewNodeOnMap(node, node.logical_map.position.x, node.logical_map.position.y, false)

    // Add new node 2
    cy.addNewNodeOnMap(node2, 200, 200, false)

    // Add new port group
    cy.addNewPortGroupOnMap(portGroup, portGroup.logical_map.position.x, portGroup.logical_map.position.y, true)

    const edgeData1 = {
      ip_allocation: 'static_manual',
      ip_address: '192.168.229.52'
    }

    // Add new interface from node
    cy.addNewInterface(edgeData1, nodeX, nodeY, pgX, pgY, false)
    cy.wait(2000)
    cy.selectElementOnMap('edge', 'eth1')
    cy.wait(2000)
    cy.selectMatTabByLabel(new RegExp('^Interfaces$', 'gi')).click();
    cy.get('div[col-id=port_group] .ag-cell-wrapper .ag-cell-value').should('not.be.empty')

    cy.unSelectAllElementOnMap()

    // [Edge Edit] Unable to clear value the Netmask
    cy.get('canvas.expand-collapse-canvas').rightclick(500, 300, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#edit').should('exist').click({ force: true });
      cy.getByFormControlName('ipAllocationCtr').children(`mat-radio-button[value="static_manual"]`).click()
      cy.getByFormControlName('netMaskCtr').clear()
      cy.getByFormControlName('nameCtr').clear().type('test')
      cy.get('mat-error').should('exist')
      cy.getButtonByTypeAndContent('button', 'Cancel').click();
      cy.wait(2000)
    })

    cy.unSelectAllElementOnMap()

    // [Map Editor] User cannot edit any elements on the map after they expanded a Project Node
    cy.get('#toolpanel-linkproject').click();
    cy.getOptionByContent('Collection Project - 2').first().click();
    cy.getByMatToolTip('Link Project').should('be.enabled')
    cy.getByDataCy('linkProjectForm').submit();
    cy.wait(1000)
    // Change Device/Template when clicking (+) Add Node button
    cy.get('#toolpanel-linkproject').should('be.disabled');
    //
    cy.get('canvas.expand-collapse-canvas').click(450, 250, { force: true });
    cy.wait(4000)

    cy.get('canvas.expand-collapse-canvas').rightclick(450, 250, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#expand_node').should('exist').click({ force: true });
    })

    cy.unSelectAllElementOnMap()

    // cy.wait(2000)
    // cy.get('canvas.expand-collapse-canvas').rightclick(200, 200, {force: true}).then(() => {
    //   cy.get('.cy-context-menus-cxt-menu').first().should('exist')
    //   cy.get('#edit').should('exist').click({ force: true });
    //   cy.getByFormControlName('nameCtr').clear().type('test edit other node')
    //   cy.get('mat-error').should('not.exist')
    //   cy.getByDataCy('nodeAddForm').submit()
    //   cy.waitingLoadingFinish()
    // })

    // [Map editor] The system does not display images when adding a template project that contains an image
    cy.get('#toolpanel-add-template').click();
    cy.getOptionByContent(newProjectTemplate.name).first().click();
    cy.getByDataCy('addTemplateForm').submit();
    cy.get('canvas.expand-collapse-canvas').click(220, 250, { force: true });
    cy.waitingLoadingFinish()

  })
})
