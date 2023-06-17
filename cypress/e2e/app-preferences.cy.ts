describe('App Preferences e2e testing', {testIsolation: true}, () =>{
  const appPreferences = {
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
  })

})
