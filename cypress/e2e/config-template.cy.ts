describe('Configuration Template e2e testing', () => {
  let admin:any = {}
  let routeConfig: any = {}
  let firewallConfig: any = {}
  let domainMembershipConfig: any = {}
  let windowRolesAndServiceConfig: any = {}
  let windowRolesAndServiceEditConfig: any = {}
  beforeEach(() => {
    cy.viewport(1366, 768)
    cy.visit('/login')
    cy.fixture('login/admin.json').then(
      adminData => admin = adminData
    )
    cy.fixture('config-template/routes-config.json').then(
      routeConfigData => routeConfig = routeConfigData
    )
    cy.fixture('config-template/firewall-config.json').then(
      firewallConfigData => firewallConfig = firewallConfigData
    )
    cy.fixture('config-template/domain-membership-config.json').then(
      domainMembershipConfigData => domainMembershipConfig = domainMembershipConfigData
    )
    cy.fixture('config-template/win-roles-service-config.json').then(
      windowRolesAndServiceConfigData => windowRolesAndServiceConfig = windowRolesAndServiceConfigData
    )
    cy.fixture('config-template/win-roles-service-config-edit.json').then(
      windowRolesAndServiceEditConfigData => windowRolesAndServiceEditConfig = windowRolesAndServiceEditConfigData
    )
  })

  it('Test - Configuration Template',() => {
    cy.login(admin.username, admin.password)
    cy.getByDataCy('btn-libraries').click()
    cy.get('button>span').contains('Configuration Templates').click()
    cy.wait(3000)

    cy.addNewConfigTemplate(routeConfig)
    cy.showFormEditByName(routeConfig.name)
    cy.editConfigTemplate(routeConfig, { static_routes: routeConfig.static_routes })

    cy.wait(3000)
    cy.addNewConfigTemplate(firewallConfig)
    cy.showFormEditByName(firewallConfig.name)
    cy.editConfigTemplate(firewallConfig, { firewall_rule: firewallConfig.firewall_rule })

    cy.wait(3000)
    cy.addNewConfigTemplate(domainMembershipConfig)
    cy.showFormEditByName(domainMembershipConfig.name)
    cy.editConfigTemplate(domainMembershipConfig, {
      join_domain: domainMembershipConfig.join_domain,
      ou_path: domainMembershipConfig.ou_path
    })

    cy.wait(3000)
    cy.addNewConfigTemplate(windowRolesAndServiceConfig)
    cy.showFormEditByName(windowRolesAndServiceConfig.name)
    cy.editConfigTemplate(windowRolesAndServiceConfig, { role_services: windowRolesAndServiceConfig.role_services })

    cy.wait(3000)
    cy.get('#search-config').type("template")
    cy.wait(2000)
    cy.selectRowByName(routeConfig.name)
    cy.selectRowByName(firewallConfig.name)
    cy.selectRowByName(domainMembershipConfig.name)
    cy.selectRowByName(windowRolesAndServiceConfig.name)

    cy.wait(3000)
    cy.getByMatToolTip('Export as JSON').click()

    cy.showFormEditByName(windowRolesAndServiceConfig.name)
    cy.editConfigTemplate(windowRolesAndServiceEditConfig, { role_services: windowRolesAndServiceEditConfig.role_services })

  });
})
