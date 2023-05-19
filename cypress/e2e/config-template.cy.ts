describe('Configuration Template e2e testing', () => {
  let admin:any = {}
  let routeConfig: any = {}
  let firewallConfig: any = {}
  let domainMembershipConfig: any = {}
  let windowRolesAndServiceConfig: any = {}
  let windowRolesAndServiceEditConfig: any = {}
  let ospfConfig: any = {}

  const networksInvalid = {
    invalid_subnet: "192.168.0.0/34",
    invalid_ip: "300.168.0.0/24",
    invalid_multi_ip: "192.168.0.1 192.168.0.2",
    invalid_chars: "AAAAAAA",
  }
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
    cy.fixture('config-template/ospf-config.json').then(
      ospfConfigData => ospfConfig = ospfConfigData
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
    cy.selectRowByName(routeConfig.name)
    cy.selectRowByName(firewallConfig.name)
    cy.selectRowByName(domainMembershipConfig.name)
    cy.selectRowByName(windowRolesAndServiceConfig.name)

    cy.wait(3000)
    cy.getByMatToolTip('Export as JSON').click()

    cy.showFormEditByName(windowRolesAndServiceConfig.name)
    cy.editConfigTemplate(windowRolesAndServiceEditConfig, { role_services: windowRolesAndServiceEditConfig.role_services })

  });

  it('Test - OSPF Configuration',() => {
    cy.login(admin.username, admin.password)
    cy.getByDataCy('btn-libraries').click()
    cy.get('button>span').contains('Configuration Templates').click()

    cy.addNewConfigTemplate(ospfConfig.ospfDataEditor[0])
    cy.showFormEditByName(ospfConfig.ospfDataEditor[0].name)
    cy.editConfigTemplate(ospfConfig.ospfDataEditor[0], { ospf: ospfConfig.ospfDataEditor[0].ospf })


    cy.showFormEditByName(ospfConfig.ospfDataEditor[0].name)
    cy.get('#config-select-type').clear({force: true}).type('Add OSPF')
    cy.getOptionByContent('Add OSPF').click();
    // Validation Networks invalid IP
    cy.addOspfConfigTemplate(ospfConfig.ospfDataShowForm[0], networksInvalid.invalid_ip)

    // Validation Networks invalid Subnet
    cy.addOspfConfigTemplate(ospfConfig.ospfDataShowForm[0], networksInvalid.invalid_subnet)

    // Validation Networks multi IP
    cy.addOspfConfigTemplate(ospfConfig.ospfDataShowForm[0], networksInvalid.invalid_multi_ip)

    // Validation Networks invalid Chars
    cy.addOspfConfigTemplate(ospfConfig.ospfDataShowForm[0], networksInvalid.invalid_chars)

    cy.addOspfConfigTemplate(ospfConfig.ospfDataShowForm[0], undefined)

    cy.wait(3000)
    cy.selectRowByName(routeConfig.name)
    cy.selectRowByName(firewallConfig.name)
    cy.selectRowByName(domainMembershipConfig.name)
    cy.selectRowByName(windowRolesAndServiceEditConfig.name)
    cy.selectRowByName(ospfConfig.ospfDataShowForm[0].name)

    cy.wait(3000)
    cy.getByMatToolTip('Export as JSON').click()
  });
})
