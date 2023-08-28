describe('App Preferences e2e testing', {testIsolation: true}, () =>{
  let mapPreferences: any = [];
  let project: any = {};
  let randomProject:any = {};
  let randomMapPref: any = {};
  const random = (Math.random() + 1).toString(36).substring(5);
  const appPreferences = {
    map_pref: 'Default',
    public_network: "10.0.0.0/8",
    private_network: "192.168.0.0/16",
    private_network_ips: "192.168.0.1",
    management_network: "172.16.0.0/22",
    dhcp_server: "dhcpd/dhcpd"
  }

  const privateNetwork = {
    invalid_subnet: "192.168.0.0/34",
    invalid_ip: "300.168.0.0/24",
    out_of_band_network: "64.0.0.2",
    invalid_multi_ip: "192.168.0.1 192.168.0.2",
    invalid_chars: "AAAAAAA",
    invalid_reserved_ip: '192.168.110.0/24'
  }

  const dhcpServerInvalid = {
    dhcp_server_ip: "10.12.23.100:8443",
    dhcp_server_special_char: "bash/tmp/filepath>&*@#%$",
  }

  beforeEach(() => {
    cy.viewport(1366, 768)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
    cy.fixture('map-preferences/map-preferences.json').then(
      mapPrefData => {
        mapPreferences = mapPrefData
        let mapPreferencesAdd = mapPreferences.mapPrefAdd[0]
        mapPreferencesAdd.name += ` (${random})`
        randomMapPref = JSON.parse(JSON.stringify(mapPreferencesAdd))
        randomMapPref.name =  randomMapPref.name + ' random'
      }
    )
    cy.fixture('project/new-project.json').then(projectData => {
      project = projectData
      project.name = "Test new project"
      project.description = "East cluster representing part of the grayspace"
      project.option = "random"
      project.name += ` (${random})`
      randomProject = JSON.parse(JSON.stringify(project))
      randomProject.option = 'random'
      randomProject.name =  randomProject.name + ' random'
  })
})

  context('Validation - Section', () => {
    it ('Check Validation of the private network field with invalid subnet', () => {
      cy.visit('/')
      cy.getByDataCy('btn-nav-app-pref').click()
      cy.get('button>span').contains('App Preferences').click()
      cy.waitingLoadingFinish()
      cy.updateAppPreferences(appPreferences, privateNetwork.invalid_subnet, appPreferences.private_network_ips);
      cy.get('mat-error').should('exist')
      cy.getByDataCy('btn-save-app-pref').should("be.disabled")
    });

    it ('Check Validation of the private network field with invalid IP', () => {
      cy.visit('/')
      cy.getByDataCy('btn-nav-app-pref').click()
      cy.get('button>span').contains('App Preferences').click()
      cy.waitingLoadingFinish()
      cy.updateAppPreferences(appPreferences, privateNetwork.invalid_ip, appPreferences.private_network_ips);
      cy.get('mat-error').should('exist')
      cy.getByDataCy('btn-save-app-pref').should("be.disabled")
    });

    it ('Check Validation of the private network reserved IPs field with multiple IP address', () => {
      cy.visit('/')
      cy.getByDataCy('btn-nav-app-pref').click()
      cy.get('button>span').contains('App Preferences').click()
      cy.waitingLoadingFinish()
      cy.updateAppPreferences(appPreferences, appPreferences.private_network, privateNetwork.invalid_multi_ip);
      cy.get('mat-error').should('exist')
      cy.getByDataCy('btn-save-app-pref').should("be.disabled")
    });

    it ('Check Validation of the private network reserved IPs field', () => {
      cy.visit('/')
      cy.getByDataCy('btn-nav-app-pref').click()
      cy.get('button>span').contains('App Preferences').click()
      cy.waitingLoadingFinish()
      cy.updateAppPreferences(appPreferences, appPreferences.private_network, privateNetwork.invalid_reserved_ip);
      cy.get('mat-error').should('exist')
      cy.getByDataCy('btn-save-app-pref').should("be.disabled")
    });

    it ('Check Validation of the private network reserved IPs field with Out of band network', () => {
      cy.visit('/')
      cy.getByDataCy('btn-nav-app-pref').click()
      cy.get('button>span').contains('App Preferences').click()
      cy.waitingLoadingFinish()
      cy.updateAppPreferences(appPreferences, appPreferences.private_network, privateNetwork.out_of_band_network);
      cy.get('mat-error').should('exist')
      cy.getByDataCy('btn-save-app-pref').should("be.disabled")
    });

    it ('Check Validation of the private network reserved IPs field with invalid chars', () => {
      cy.visit('/')
      cy.getByDataCy('btn-nav-app-pref').click()
      cy.get('button>span').contains('App Preferences').click()
      cy.waitingLoadingFinish()
      cy.updateAppPreferences(appPreferences, appPreferences.private_network, privateNetwork.invalid_chars);
      cy.get('mat-error').should('exist')
      cy.getByDataCy('btn-save-app-pref').should("be.disabled")
    });

    it ('Check Validation of the DHCP Server field', () => {
      cy.visit('/')
      cy.getByDataCy('btn-nav-app-pref').click()
      cy.get('button>span').contains('App Preferences').click()
      cy.waitingLoadingFinish()
      cy.updateAppPreferences(appPreferences, appPreferences.private_network, appPreferences.private_network_ips);
      // Check validation with value is IP address:port
      cy.getByFormControlName('dhcpServerCtr').as('dhcpServerCtr').invoke('val').then(value => {
        cy.get('@dhcpServerCtr').clear().type(dhcpServerInvalid.dhcp_server_ip)
      })
      cy.get('body').click(0,0);
      cy.get('mat-error').should('exist')
      cy.getByDataCy('btn-save-app-pref').should("be.disabled")
      // Check validation with invalid char
      cy.getByFormControlName('dhcpServerCtr').as('dhcpServerCtr').invoke('val').then(value => {
        cy.get('@dhcpServerCtr').clear().type(dhcpServerInvalid.dhcp_server_special_char)
      })
      cy.get('body').click(0,0);
      cy.checkingMatErrorIsExistOrNot(true)
      cy.getByDataCy('btn-save-app-pref').should("be.disabled")
    });
  });

  context('Apply App Preferences - Section', () => {  
    it('Test - Add new map preferences', () => {
      cy.visit('/')
      cy.getByDataCy('btn-nav-app-pref').click()
      cy.get('button>span').contains('Map Preferences').click()
      cy.waitingLoadingFinish()
      cy.showFormAddByMatTooltip('Add')
      cy.addUpdateMapPreferences(randomMapPref)
    })

    it ('Update app preferences', () => {
      cy.visit('/')
      cy.getByDataCy('btn-nav-app-pref').click()
      cy.get('button>span').contains('App Preferences').click()
      cy.waitingLoadingFinish()
      appPreferences.map_pref = randomMapPref.name
      cy.updateAppPreferences(appPreferences, appPreferences.private_network, appPreferences.private_network_ips);
      cy.get('mat-error').should('not.exist')
      cy.getByDataCy('appPrefForm').submit()
    });

    it ('Verify App settings are applied to the new project.', () => {
      cy.visit('/', { timeout: 15000 })
      cy.getByDataCy('btn-create-new').click({force: true})
      cy.addNewProject(randomProject, true)
      cy.openProjectByName(randomProject.name)
      cy.waitingLoadingFinish()
      cy.selectMatTabByLabel('Style').click();
      cy.get('#toolpanel-style-mappref').invoke('val').should('contain', randomMapPref.name)
    });
  })

})
