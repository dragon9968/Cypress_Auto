describe('E2E - Test for the edges issues.', {testIsolation: true}, () => {
  let node: any = {}
  let portGroup:any = {};
  let pgX: number;
  let pgY: number;
  let nodeX: number;
  let nodeY: number;
  let project:any = {};
  let node2: any = {};
  let nodeX2: number;
  let nodeY2: number;
  let pgX2: number;
  let pgY2: number;
  const random = (Math.random() + 1).toString(36).substring(5);
  beforeEach(() => {
    cy.viewport(window.screen.width, window.screen.height)
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
      pgX2 = pgX
      pgY2 = pgY - 200
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

  it('Test - KR-2902, KR-2860',() => {
    /*
    * Preparing data for testing edge
    * */
    cy.visit('/');
    cy.waitingLoadingFinish();
    cy.getByDataCy('btn-create-new').click();
    cy.addNewProject(project, true);
    cy.openProjectByName(project.name);
    cy.addNewNodeOnMap(node, nodeX, nodeY, false);
    cy.addNewPortGroupOnMap(portGroup, pgX, pgY, false);
    cy.addNewPortGroupOnMap(portGroup, pgX2, pgY2, true);
    cy.addNewInterface(undefined, nodeX, nodeY, pgX, pgY, false);
    cy.unSelectAllElementOnMap();

    /*---------------------------*/
    /* START: KR-2860 [Regression Issue] Unable to delete the interface on the map */
    cy.log('START: KR-2860 [Regression Issue] Unable to delete the interface on the map');
    cy.deleteInterfaceOnMap(500, 300);
    cy.log('END: KR-2860 [Regression Issue] Unable to delete the interface on the map');
    /* END: KR-2860 */

    /*---------------------------*/
    /* START: KR-2902 [Map Editor] Value as default of Direction is cleared when user clones  Nodes */
    cy.log('START: KR-2902 [Map Editor] Value as default of Direction is cleared when user clones  Nodes')
    cy.addNewInterface(undefined, nodeX, nodeY, pgX, pgY, false);

    cy.cloneNode(node.logical_map.position.x, node.logical_map.position.y);
    cy.unSelectAllElementOnMap();

    cy.get('canvas.expand-collapse-canvas').rightclick(500, 300, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#view_details').should('exist').click({ force: true });
      cy.get('#interface-direction').invoke('val').should('equal', 'Both');
    });

    cy.getButtonByTypeAndContent('button', 'Close').click();
    cy.wait(1000);
    cy.log('END: KR-2902 [Map Editor] Value as default of Direction is cleared when user clones  Nodes')
    /* END: KR-2902 */

    /*---------------------------*/
    /* START: KR-2930 [Map Editor] The port group doesn't update correctly on Map */
    cy.log('START: KR-2930 [Map Editor] The port group doesn\'t update correctly on Map');
    cy.get('canvas.expand-collapse-canvas').rightclick(500, 300, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist');
      cy.get('#edit').should('exist').click({ force: true });
      cy.getByFormControlName('portGroupCtr').click();
      cy.getByDataCy('port-group-subnet').contains(portGroup.subnet).click();
      cy.getButtonByTypeAndContent('submit', 'Update').click();
      cy.checkingToastSuccess();
    })
    cy.wait(2000);
    cy.get('canvas.expand-collapse-canvas').rightclick(500, 300, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist');
      cy.get('#view_details').should('exist').click({ force: true });

      cy.get('#cy').then((cyElement: any) => {
        const cytoscape = cyElement[0]._cyreg.cy;
        const targetPGName = cytoscape.edges()[0].target()[0].data('name');
        cy.getByFormControlName('portGroupCtr').invoke('val').should('equal', targetPGName);
        cy.wait(1000);
        cy.getButtonByTypeAndContent('button', 'Close').first().click();
      });
    });
    cy.log('END: KR-2930 [Map Editor] The port group doesn\'t update correctly on Map');
    /* END: KR-2930 */

    /*---------------------------*/
    /* START: KR-2805 [Interfaces] Need to make a validation for IP Address fields / Duplicate IP Address */
    cy.log('START: KR-2805 [Interfaces] Need to make a validation for IP Address fields / Duplicate IP Address')
    cy.addNewNodeOnMap(node2, nodeX2, nodeY2, false);
    const edgeData = {
      ip_allocation: 'static_manual',
      ip_address: '192.168.229.1'
    }
    cy.addNewInterface(edgeData, nodeX, nodeY, pgX2, pgY2, false);
    cy.unSelectAllElementOnMap();
    cy.wait(1000);
    cy.addNewInterface(edgeData, nodeX2, nodeY2, pgX2, pgY2, true);
    cy.getButtonByTypeAndContent('button', 'Cancel').first().click();
    cy.wait(1000);
    cy.getButtonByTypeAndContent('button', 'Cancel').first().click();
    cy.log('END: KR-2805 [Interfaces] Need to make a validation for IP Address fields / Duplicate IP Address')
    /* END: KR-2860 */

  });

  it('Delete the project after the e2e test run is completed without any errors', () => {
    cy.visit('/')
    cy.deleteProject(project.name, false);
    cy.deletePermanentlyProject(project.name, false);
  })
})
