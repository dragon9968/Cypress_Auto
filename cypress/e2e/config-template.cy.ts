describe('Configuration Template e2e testing', {testIsolation: true},  () => {
  let admin:any = {}
  let routeConfig: any = {}
  let firewallConfig: any = {}
  let domainMembershipConfig: any = {}
  let windowRolesAndServiceConfig: any = {}
  let windowRolesAndServiceEditConfig: any = {}
  let ospfConfig: any = {}
  let bgpConfig: any = {}

  const defaultConfig = {
    "bgp": [],
    "dhcp_server": {},
    "dns_zones": [],
    "firewall_rule": [],
    "join_domain": false,
    "ospf": [],
    "ou_path": "",
    "role_services": [],
    "static_routes": []
  }


  const networksInvalidOspf = {
    invalid_subnet: "192.168.0.0/34",
    invalid_ip: "300.168.0.0/24",
    invalid_multi_ip: "192.168.0.1 192.168.0.2",
    invalid_chars: "AAAAAAA",
  }

  const networksInvalidBgp = {
    invalid_ip: "300.168.0.0",
    invalid_chars: "AAAAAAA",
  }

  const metricInvalidBgp = {
    metric: 'e-',
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
    cy.fixture('config-template/bgp-config.json').then(
      bgpConfigData => bgpConfig = bgpConfigData
    )
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
  })

  it('Test - Configuration Template',() => {
    cy.visit('/')
    cy.getByDataCy('btn-libraries').click()
    cy.get('button>span').contains('Configuration Templates').click()
    cy.waitingLoadingFinish()

    cy.addNewConfigTemplate(routeConfig)
    cy.showFormEditByName(routeConfig.name)
    cy.editConfigTemplate(routeConfig, { static_routes: routeConfig.static_routes })

    cy.waitingLoadingFinish()
    cy.addNewConfigTemplate(firewallConfig)
    cy.showFormEditByName(firewallConfig.name)
    cy.editConfigTemplate(firewallConfig, { firewall_rule: firewallConfig.firewall_rule })

    cy.waitingLoadingFinish()
    cy.addNewConfigTemplate(domainMembershipConfig)
    cy.showFormEditByName(domainMembershipConfig.name)
    cy.editConfigTemplate(domainMembershipConfig, {
      join_domain: domainMembershipConfig.join_domain,
      ou_path: domainMembershipConfig.ou_path
    })

    cy.waitingLoadingFinish()
    cy.addNewConfigTemplate(windowRolesAndServiceConfig)
    cy.showFormEditByName(windowRolesAndServiceConfig.name)
    cy.editConfigTemplate(windowRolesAndServiceConfig, { role_services: windowRolesAndServiceConfig.role_services })

    cy.waitingLoadingFinish()
    cy.selectRowByName(routeConfig.name)
    cy.selectRowByName(firewallConfig.name)
    cy.selectRowByName(domainMembershipConfig.name)
    cy.selectRowByName(windowRolesAndServiceConfig.name)

    cy.waitingLoadingFinish()
    cy.getByMatToolTip('Export as JSON').click()
    cy.checkingToastSuccess()

    cy.showFormEditByName(windowRolesAndServiceConfig.name)
    cy.editConfigTemplate(windowRolesAndServiceEditConfig, { role_services: windowRolesAndServiceEditConfig.role_services })

    cy.importJsonData('cypress/fixtures/config-template/config-export.json')

  });

  it('Test - OSPF Configuration',() => {
    cy.visit('/')
    cy.getByDataCy('btn-libraries').click()
    cy.get('button>span').contains('Configuration Templates').click()
    cy.waitingLoadingFinish()

    cy.addNewConfigTemplate(ospfConfig.ospfDataEditor[0])
    cy.showFormEditByName(ospfConfig.ospfDataEditor[0].name)

    // Validation Networks invalid in json form
    cy.editOspfAndBgpConfigTemplate(ospfConfig.ospfDataEditor[0], { ospf: ospfConfig.ospfValidationJsonForm[0].ospf }, defaultConfig, true)

    // Validation State invalid in json form
    cy.editOspfAndBgpConfigTemplate(ospfConfig.ospfDataEditor[0], { ospf: ospfConfig.ospfValidationJsonForm[1].ospf }, defaultConfig, true)

    // Validation Metric Type invalid in json form
    cy.editOspfAndBgpConfigTemplate(ospfConfig.ospfDataEditor[0], { ospf: ospfConfig.ospfValidationJsonForm[2].ospf }, defaultConfig, true)

    // Validation Metric Type invalid(metric type > 2 or metric type < 1) in json form
    cy.editOspfAndBgpConfigTemplate(ospfConfig.ospfDataEditor[0], { ospf: ospfConfig.ospfValidationJsonForm[3].ospf }, defaultConfig, true)

    cy.editOspfAndBgpConfigTemplate(ospfConfig.ospfDataEditor[0], { ospf: ospfConfig.ospfDataEditor[0].ospf }, defaultConfig, false)


    cy.showFormEditByName(ospfConfig.ospfDataEditor[0].name)
    cy.waitingLoadingFinish()
    cy.get('#config-select-type').focus().clear({force: true}).type('Add OSPF')
    cy.getOptionByContent('Add OSPF').click();
    // Validation Networks invalid IP
    cy.addOspfConfigTemplate(ospfConfig.ospfDataShowForm[0], networksInvalidOspf.invalid_ip)

    // Validation Networks invalid Subnet
    cy.addOspfConfigTemplate(ospfConfig.ospfDataShowForm[0], networksInvalidOspf.invalid_subnet)

    // Validation Networks multi IP
    cy.addOspfConfigTemplate(ospfConfig.ospfDataShowForm[0], networksInvalidOspf.invalid_multi_ip)

    // Validation Networks invalid Chars
    cy.addOspfConfigTemplate(ospfConfig.ospfDataShowForm[0], networksInvalidOspf.invalid_chars)

    cy.addOspfConfigTemplate(ospfConfig.ospfDataShowForm[0], undefined)

    cy.selectRowByName(ospfConfig.ospfDataShowForm[0].name)
    cy.getByMatToolTip('Export as JSON').click()
    cy.waitingLoadingFinish()
    cy.deleteRecordByName(ospfConfig.ospfDataShowForm[0].name, 'Delete', true)

  });

  it('Test - BGP Configuration',() => {
    cy.visit('/')
    cy.getByDataCy('btn-libraries').click()
    cy.get('button>span').contains('Configuration Templates').click()
    cy.waitingLoadingFinish()
    cy.addNewConfigTemplate(bgpConfig.bgpDataEditor[0])
    cy.showFormEditByName(bgpConfig.bgpDataEditor[0].name)

    // Validation for ip_address invalid
    cy.editOspfAndBgpConfigTemplate(bgpConfig.bgpDataEditor[0], { bgp: bgpConfig.bgpValidationDataEditor[0].bgp }, defaultConfig, true)

    // Validation state field
    cy.editOspfAndBgpConfigTemplate(bgpConfig.bgpDataEditor[0], { bgp: bgpConfig.bgpValidationDataEditor[1].bgp }, defaultConfig, true)

    // Validation metric field
    cy.editOspfAndBgpConfigTemplate(bgpConfig.bgpDataEditor[0], { bgp: bgpConfig.bgpValidationDataEditor[2].bgp }, defaultConfig, true)

    cy.editOspfAndBgpConfigTemplate(bgpConfig.bgpDataEditor[0], { bgp: bgpConfig.bgpDataEditor[0].bgp }, defaultConfig, false)
    cy.showFormEditByName(bgpConfig.bgpDataEditor[0].name)
    cy.waitingLoadingFinish()
    cy.get('#config-select-type').focus().clear({force: true}).type('Add BGP')
    cy.getOptionByContent('Add BGP').click();
    // Validation IP Address field invalid IP
    cy.addBGPConfigTemplate(bgpConfig.bgpDataShowForm[0], networksInvalidBgp.invalid_ip, undefined)
    // Validation IP Address field invalid Chars
    cy.addBGPConfigTemplate(bgpConfig.bgpDataShowForm[0], networksInvalidBgp.invalid_chars, undefined)

    // Validation metric field invalid Chars
    cy.addBGPConfigTemplate(bgpConfig.bgpDataShowForm[0], undefined, metricInvalidBgp)

    cy.addBGPConfigTemplate(bgpConfig.bgpDataShowForm[0], undefined, undefined)

    cy.selectRowByName(bgpConfig.bgpDataShowForm[0].name)
    cy.getByMatToolTip('Export as JSON').click()
    cy.checkingToastSuccess()
    cy.deleteRecordByName(bgpConfig.bgpDataShowForm[0].name, 'Delete', true)
  });
})
