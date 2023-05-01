describe('Hardware e2e testing', () => {
  let admin:any = {}
  const hardware = {
    device_name: 'VyOS',
    template_name: 'VyOS 1.2.4',
    serial_number: '11AA22BB33CC',
    asset_tag: '0A9B8C7D'
  }

  beforeEach(() => {
    cy.viewport(1366, 768)
    cy.visit('/login')
    cy.fixture('login/admin.json').then(
      adminData => admin = adminData
    )
  })

  it('Test - Hardware',() => {
    cy.login(admin.username, admin.password)
    cy.getByDataCy('btn-devices').click()
    cy.get('button>span').contains('Hardware').click()
    cy.wait(2000)

    cy.showFormAddByMatTooltip('Add')
    cy.get('#hardware-device').clear({force: true}).type(hardware.device_name)
    cy.getOptionByContent(hardware.device_name).click()
    cy.wait(1000)
    cy.get('#hardware-template').clear({force: true}).type(hardware.template_name)
    cy.getOptionByContent(hardware.template_name).click()
    cy.wait(1000)
    cy.getByFormControlName('serialNumber').type(hardware.serial_number)
    cy.wait(1000)
    cy.getByFormControlName('assetTag').type(hardware.asset_tag)

    cy.getButtonByTypeAndContent('submit', 'Create').click()
    cy.get('mat-error').should('not.exist')
  });
})
