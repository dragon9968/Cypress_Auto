describe('Map features e2e testing', () => {
  let mapData: any = {};
  let mapStyleData: any = {};
  let editData: any = {};
  let project: any = {};
  const random = (Math.random() + 1).toString(36).substring(5);

  const domainData = {
    name: 'Test new domain',
    admin_user: 'admin',
    admin_password: 'password'
  }

  const editDomainData = {
    name: 'Test domain',
    admin_user: 'admin1',
    admin_password: 'password1'
  }

  const deleteDomainData = {
    name: 'Test delete domain',
    admin_user: 'admin',
    admin_password: 'password'
  }

  beforeEach(() => {
    cy.viewport(1920, 1080)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.fixture('map/map-features.json').then(data => {
      mapData = data
    })
    cy.fixture('map/map-style-data.json').then(data => {
      mapStyleData = data
    })
    cy.fixture('map/node-pg-edge.data.json').then(data => {
      editData = data
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

  it ('Create new blank project and add node, port group', () => {
    cy.visit('/')
    cy.waitingLoadingFinish()
    cy.getByDataCy('btn-create-new').click({force: true})
    cy.waitingLoadingFinish()
    cy.addNewProject(project, true)
    cy.waitingLoadingFinish()
    cy.openProjectByName(project.name)
    cy.waitingLoadingFinish()
    // Add new port group
    mapData.collection[0].port_group.forEach((element: any) => {
      cy.addNewPortGroupOnMap(element, element.map_data.logical.position.x, element.map_data.logical.position.y, true)
    });

    // Add new node
    mapData.collection[0].node.forEach((element: any) => {
      cy.addNewNodeOnMap(element, element.map_data.logical.position.x, element.map_data.logical.position.y, true)
      element.interface.forEach((interfaceData: any) => {
        let pgX: any;
        let pgY: any;
        if (interfaceData.port_group === 'EASTNET-2') {
          pgX = 1000
          pgY = 500
        } else if (interfaceData.port_group === 'EASTNET-3') {
          pgX = 800
          pgY = 400
        } else if (interfaceData.port_group === 'cro_net_pmk8310w') {
          pgX = 250
          pgY = 600
        }
        cy.addNewInterface(interfaceData,
          element.map_data.logical.position.x,
          element.map_data.logical.position.y,
          pgX,
          pgY,
          false
          )
      })
    });

    cy.waitingLoadingFinish()
    // Update node
    cy.selectElementOnMap('node', 'e-dns-1')
    cy.get('canvas.expand-collapse-canvas').rightclick(300, 500, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#edit').should('exist').click({ force: true });
      cy.getByFormControlName('nameCtr').clear().type(editData.nodeData.name)
      cy.getByFormControlName('parentFolderCtr').clear().type(editData.nodeData.parent_folder)
      cy.getByFormControlName('iconCtr').click()
      cy.get('.option-text').contains(editData.nodeData.icon_name).first().click()
      cy.get('#node-device').click()
      cy.get('.option-text').contains(editData.nodeData.device_name).first().click()
      cy.getByFormControlName('folderCtr').clear().type(editData.nodeData.folder)
      cy.getByFormControlName('roleCtr').click()
      cy.get('.option-text').contains(editData.nodeData.role).first().click()
      cy.get('#node-template').click()
      cy.get('.option-text').contains(editData.nodeData.template_name).first().click()
      cy.getByFormControlName('hostnameCtr').clear().type(editData.nodeData.hostname)
      cy.get('mat-error').should('not.exist')
      cy.getByDataCy('nodeAddForm').submit()
      cy.checkingToastSuccess()
      cy.waitingLoadingFinish()
    })

    // Update port group
    cy.selectElementOnMap('node', 'EASTNET-2')
    cy.get('canvas.expand-collapse-canvas').rightclick(1000, 500, {force: true}).then(() => {
      cy.get('.cy-context-menus-cxt-menu').first().should('exist')
      cy.get('#edit').should('exist').click({ force: true });
      cy.getByFormControlName('nameCtr').clear().type(editData.portGroupData.name)
      cy.getByFormControlName('vlanCtr').clear().type(editData.portGroupData.vlan)
      cy.getByFormControlName('categoryCtr').children(`mat-radio-button[value="${editData.portGroupData.category}"]`).click()
      cy.getByFormControlName('subnetAllocationCtr').children(`mat-radio-button[value="${editData.portGroupData.subnet_allocation}"]`).click()
      cy.get('mat-error').should('not.exist')
      cy.getByDataCy('pgAddForm').submit()
      cy.checkingToastSuccess()
      cy.waitingLoadingFinish()
    })

    //  Test clone node
    cy.selectElementOnMap('node', editData.nodeData.name)
    cy.getByMatToolTip('Clone').click();
    cy.waitingLoadingFinish()
    cy.getButtonByTypeAndContent('submit', 'OK').click()
    cy.checkingToastSuccess()
    cy.exportProject(project.name, true)
    cy.waitingLoadingFinish()
    cy.importProject('cypress/fixtures/project/West_ISP.json')
    cy.waitingLoadingFinish()
  });

  it ('Test Table Filter', () => {
    cy.visit('/projects')
    cy.waitingLoadingFinish()
    cy.openProjectByName(project.name)
    cy.url().should('include', 'map')
    cy.waitingLoadingFinish()

    cy.getByMatToolTip('Filter Table').click( {force: true} )
    cy.getByFormControlName('filterOptionCtr').click()
    cy.get(`mat-option[value="all"]`).click()
    cy.get('body').click(0,0);

    cy.selectInfoPanelRowByLabelAndContent('node', 'lc-1').click()
    cy.wait(1000)
    cy.selectInfoPanelRowByLabelAndContent('node', 'wc-1').click()
    cy.wait(1000)

    cy.getByMatToolTip('Filter Table').click( {force: true} )
    cy.getByFormControlName('filterOptionCtr').click()
    cy.get(`mat-option[value="selected"]`).click()
    cy.get('body').click(0,0);
    cy.selectElementOnMap('node', 'wr-1')
    cy.selectElementOnMap('node', 'er-3')
    cy.getByMatToolTip('Filter Table').click( {force: true} )
    cy.getByFormControlName('filterOptionCtr').click()
    cy.get(`mat-option[value="all"]`).click()

    cy.wait(2000)
    cy.selectMatTabByLabel('Port Groups').click()
    cy.selectInfoPanelRowByLabelAndContent('port-group', 'Test edit port group').click()
    cy.wait(1000)
    cy.selectInfoPanelRowByLabelAndContent('port-group', 'EASTNET-3').click()
    cy.wait(1000)
    cy.selectInfoPanelRowByLabelAndContent('port-group', 'Test edit port group').click()
    cy.getByMatToolTip('Filter Table').click( {force: true} )
    cy.getByFormControlName('filterOptionCtr').click()
    cy.get(`mat-option[value="selected"]`).click()
    cy.selectElementOnMap('node', 'cro_net_pmk8310w')

    cy.getByMatToolTip('Filter Table').click({force: true})
    cy.getByFormControlName('filterOptionCtr').click()
    cy.get(`mat-option[value="management"]`).click()
    cy.get('body').click(0,0);
    cy.wait(1000)
    cy.get(`app-info-panel-port-group ag-grid-angular .ag-row`).contains('management')
      .parent('.ag-cell-wrapper').parent('.ag-cell').parent('.ag-row').dblclick()
    cy.getByMatToolTip('Edit Port Group').click()
    cy.getByFormControlName('nameCtr').focus().clear().type('Port Group Management Test Edit')
    cy.getByFormControlName('domainCtr').click()
    cy.get('.mat-option-text').contains('management').click()
    cy.getButtonByTypeAndContent('submit', 'Update').click()
    cy.checkingToastSuccess()
    cy.waitingLoadingFinish()
    cy.selectMatTabByLabel('Interfaces').click()
    cy.selectInfoPanelRowByLabelAndContent('interface', 'eth1').click()
    cy.wait(1000)
    cy.getByMatToolTip('Filter Table').click( {force: true} )
    cy.getByFormControlName('filterOptionCtr').click()
    cy.get(`mat-option[value="selected"]`).click()
    cy.selectElementOnMap('edge', 'lan')
    cy.selectInfoPanelRowByLabelAndContent('interface', 'lan').click()
    cy.getByMatToolTip('Filter Table').click( {force: true} )
    cy.getByFormControlName('filterOptionCtr').click()
    cy.get(`mat-option[value="all"]`).click()
    cy.getByMatToolTip('Filter Table').click({force: true})
    cy.getByFormControlName('filterOptionCtr').click()
    cy.get(`mat-option[value="management"]`).click()
    cy.get('body').click(0,0);
    cy.wait(1000)
    cy.get(`app-info-panel-interface ag-grid-angular .ag-row`).contains('management')
      .parent('.ag-cell-wrapper').parent('.ag-cell').parent('.ag-row').first().dblclick()
    cy.getByMatToolTip('Edit Edge').click()
    cy.getByFormControlName('nameCtr').focus().clear().type('Edge Management Test Edit')
    cy.getButtonByTypeAndContent('submit', 'Update').click()
    cy.checkingToastSuccess()
    cy.waitingLoadingFinish()
  })

  it ('Test Link project', () => {
    cy.visit('/projects')
    cy.openProjectByName(project.name)
    cy.waitingLoadingFinish()
    cy.selectMatTabByLabel('Option').click();
    cy.getMatSliderToggleByClass('.direction-toggle').check({ force: true })
    cy.wait(2000)
    cy.getMatSliderToggleByClass('.groupboxes-toggle').check({ force: true })
    cy.wait(2000)
    cy.getMatSliderToggleByClass('.matgrid-toggle').check({ force: true })
    cy.wait(2000)
    cy.getMatSliderToggleByClass('.mapoverview-toggle').check({ force: true })
    cy.getByMatToolTip('Save').click()
    cy.checkingToastSuccess()
  });

  it ('Test map - Test domain info panel', () => {
    cy.visit('/projects')
    cy.openProjectByName(project.name)
    cy.waitingLoadingFinish()
    cy.selectMatTabByLabel('Option').click();
    cy.getMatSliderToggleByClass('.direction-toggle').uncheck({ force: true })
    cy.wait(1000)
    cy.get('canvas.expand-collapse-canvas').click(100, 100, { force: true });
    cy.wait(2000)
  });

  it ('Test map style', () => {
    cy.visit('/projects')
    cy.waitingLoadingFinish()
    cy.openProjectByName(project.name)
    cy.waitingLoadingFinish()

    cy.selectElementOnMap('node', editData.nodeData.name)
    cy.selectMatTabByLabel('Style').click();
    cy.wait(1000)
    cy.updateMapStyle(mapStyleData, 'node')
    cy.wait(2000)
    cy.selectElementOnMap('port-group', editData.portGroupData.name)
    cy.selectMatTabByLabel('Style').click();
    cy.updateMapStyle(mapStyleData, 'port-group')
    cy.wait(2000)
    cy.selectElementOnMap('edge', 'lan')
    cy.selectMatTabByLabel('Style').click();
    cy.updateMapStyle(mapStyleData, 'edge')

    // save map
    cy.getByMatToolTip('Save').click();
    cy.wait(4000)
  });

  it ('Test map style - Change Map Preferences', () => {
    cy.visit('/projects')
    cy.openProjectByName(project.name)
    cy.waitingLoadingFinish()
    cy.selectMatTabByLabel('Style').click();
    cy.selectElementOnMap('node', editData.nodeData.name)
    cy.get('#toolpanel-style-mappref').click();
    cy.getOptionByContent('Default').click();
    cy.getByMatToolTip('Apply').click();
    cy.wait(3000)

    cy.selectElementOnMap('port-group', editData.portGroupData.name)
    cy.get('#toolpanel-style-mappref').click();
    cy.getOptionByContent('Default').click();
    cy.getByMatToolTip('Apply').click();
    // save map
    cy.getByMatToolTip('Save').click()
    cy.wait(4000)
  });

  it ('Test map - Test tool panel Option', () => {
    cy.visit('/projects')
    cy.openProjectByName(project.name)
    cy.url().should('include', 'map')
    cy.waitingLoadingFinish()
    cy.selectMatTabByLabel('Option').click();
    cy.getMatSliderToggleByClass('.direction-toggle').check({ force: true })
    cy.wait(2000)
    cy.getMatSliderToggleByClass('.groupboxes-toggle').check({ force: true })
    cy.wait(2000)
    cy.getMatSliderToggleByClass('.matgrid-toggle').check({ force: true })
    cy.wait(2000)
    cy.getMatSliderToggleByClass('.mapoverview-toggle').check({ force: true })
    // save map
    cy.getByMatToolTip('Save').click()
    cy.wait(4000)
  });

  it ('Test map - Test domain info panel', () => {
    cy.visit('/projects')
    cy.openProjectByName(project.name)
    cy.waitingLoadingFinish()
    cy.selectMatTabByLabel('Option').click();
    cy.getMatSliderToggleByClass('.direction-toggle').uncheck({ force: true })
    cy.wait(1000)
    cy.getMatSliderToggleByClass('.mapoverview-toggle').uncheck({ force: true })
    // save map
    cy.getByMatToolTip('Save').click()

    // Add new domain
    cy.selectMatTabByLabel('Domains').click();
    cy.getByMatToolTip('Add new domain').click({ force: true });
    cy.addEditDomain(domainData, 'add')
    cy.wait(2000)

    // Create User domain
    cy.selectInfoPanelRowByLabelAndContent('domain', domainData.name).check({force: true})
    cy.getByMatToolTip('Create Users').click();
    cy.createUsersDomain(2);

    // Edit domain
    cy.getByMatToolTip('Edit').click();
    cy.addEditDomain(editDomainData, 'edit')
    cy.wait(2000)

    // Validate
    cy.getByMatToolTip('Validate').click();
    cy.wait(1000)

    // Delete domain
    cy.getByMatToolTip('Add new domain').click();
    cy.addEditDomain(deleteDomainData, 'add')
    cy.wait(2000)

    cy.selectInfoPanelRowByLabelAndContent('domain', editDomainData.name).uncheck({force: true})
    cy.wait(1000)
    cy.selectInfoPanelRowByLabelAndContent('domain', deleteDomainData.name).check({force: true})
    cy.deleteRecordByName(deleteDomainData.name, 'Delete', true)
    cy.wait(3000)

  });

  it ('Test map - Test group info panel', () => {
    cy.visit('/')
    cy.openProjectByName(project.name)
    cy.url().should('include', 'map')
    cy.waitingLoadingFinish()

    // Add new group
    cy.selectMatTabByLabel(new RegExp('^group$', 'gi')).click();
    cy.getByMatToolTip('Add new group').click();
    cy.addEditGroup(editData.groupData, 'add')
    cy.checkingToastSuccess()
    cy.waitingLoadingFinish()

    // Edit group
    cy.selectInfoPanelRowByLabelAndContent('group', editData.groupEditDefaultData.name).check({force: true})
    cy.getByMatToolTip('Edit').click();
    cy.addEditGroup(editData.groupEditDefaultData, 'edit')
    cy.checkingToastSuccess()
    cy.waitingLoadingFinish()

    // Edit group
    cy.selectInfoPanelRowByLabelAndContent('group', editData.groupEditDefaultData.name).uncheck({force: true})
    cy.wait(1000)
    cy.selectInfoPanelRowByLabelAndContent('group', editData.groupData.name).check({force: true})
    cy.getByMatToolTip('Edit').click();
    cy.addEditGroup(editData.groupEditData, 'edit')
    cy.checkingToastSuccess()
    cy.waitingLoadingFinish()

  });

})
