describe('Connection Profile e2e testing', () => {
  let admin:any = {};
  let hypervisor:any = {}
  let datasource:any = {}
  let configurator:any = {};
  beforeEach(() => {
    cy.viewport(1366, 768)
    cy.visit('/login')
    cy.fixture('login/admin.json').then(
      adminData => admin = adminData
    )
    cy.fixture('connection-profile/hypervisor.json').then(
      hypervisorData => hypervisor = hypervisorData
    )
    cy.fixture('connection-profile/datasource.json').then(
      datasourceData => datasource = datasourceData
    )
    cy.fixture('connection-profile/configurator.json').then(
      configuratorData => configurator = configuratorData
    )
  })

  it('Test - Connection Profile', () => {
    cy.login(admin.username, admin.password);
    cy.getByDataCy("btn-remote").click();
    cy.get("button>span").contains('Connection Profiles').click();

    // Show Add Connection Profile form
    cy.showFormAddByMatTooltip('Add');
    // Add Connection Profile with Hypervisor
    cy.addEditConnectionProfile(hypervisor.hypervisorAdd[0], 'add')

    // Show Add Connection Profile form
    cy.showFormAddByMatTooltip('Add');
    // Add Connection Profile with Datasource
    cy.addEditConnectionProfile(datasource, 'add')

    // Show Add Connection Profile form
    cy.showFormAddByMatTooltip('Add');
    // Add Connection Profile with Configurator
    cy.addEditConnectionProfile(configurator, 'add')


    // Show Edit Connection Profile form
    cy.showFormEditByName(hypervisor.hypervisorAdd[0].name)
    // Update Connection Profile with Hypervisor
    cy.addEditConnectionProfile(hypervisor.hypervisorUpdate[0], 'update')
    cy.wait(2000)

    // // Export as Json
    cy.selectRowByName(hypervisor.hypervisorUpdate[0].name)
    cy.selectRowByName(datasource.name)
    cy.selectRowByName(configurator.name)
    cy.wait(2000)
    cy.getByMatToolTip('Export as JSON').click()

    // Import
    cy.waitingLoadingFinish()
    cy.getByDataCy("btn-remote").click();
    cy.get("button>span").contains('Connection Profiles').click();

    cy.importJsonData('cypress/fixtures/connection-profile/connection-export.json')
    cy.wait(3000)
  });

  afterEach(() => {
    cy.wait(2000)
    cy.log(`START: Delete Connection Profile`)
    // Delete Connection Profile
    cy.getByMatToolTip('Delete').click()
    cy.get('mat-dialog-container').should('exist')
    cy.wait(2000)
    cy.getButtonByTypeAndContent('submit', 'OK').click()
    cy.wait(2000)
    cy.get('mat-dialog-container').should('not.exist')
    cy.log(`END: Delete successfully`)
  })
})
