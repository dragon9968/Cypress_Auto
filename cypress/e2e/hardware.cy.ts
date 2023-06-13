describe('Hardware e2e testing', () => {
  let admin:any = {}
  const hardware = {
    device_name: 'VyOS',
    template_name: 'VyOS 1.2.4',
    serial_number: '11AA22BB33CC',
    asset_tag: '0A9B8C7D'
  }
  let hardwareSerialNumber = ''
  const hardwareDataPath = 'devices-data/hardware/hardware-export.json'

  beforeEach(() => {
    cy.viewport(1366, 768)
    cy.visit('/login')
    cy.fixture('login/admin.json').then(
      adminData => admin = adminData
    )
    cy.fixture(hardwareDataPath).then(hardwareImport => hardwareSerialNumber = hardwareImport.hardware[0].serial_number)
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

  it('Delete hardware', function () {
    cy.login(admin.username, admin.password)
    cy.openPageInDevicesNav('Hardware')
    cy.get('.table__nav--search input').first().clear({force: true}).type(hardware.serial_number)
    cy.wait(1000)
    cy.deleteRecordByName(hardware.serial_number, 'Delete', false)
    cy.get('.table__nav--search input').first().clear()
  });

  it('Import hardware', function () {
    cy.login(admin.username, admin.password)
    cy.openPageInDevicesNav('Hardware')
    cy.importJsonData(`cypress/fixtures/${hardwareDataPath}`, 'Import Template')
  });

  it('Delete hardware just imported', function () {
    cy.login(admin.username, admin.password)
    cy.openPageInDevicesNav('Hardware')
    cy.get('.table__nav--search input').first().clear({force: true}).type(hardwareSerialNumber)
    cy.wait(1000)
    cy.deleteRecordByName(hardwareSerialNumber, 'Delete', false)
    cy.get('.table__nav--search input').first().clear()
  });
})
