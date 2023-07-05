describe('Hardware e2e testing', () => {
  const hardware = {
    device_name: 'VyOS',
    template_name: 'VyOS 1.2.4',
    serial_number: '11AA22BB33CC',
    asset_tag: '0A9B8C7D',
    firmware: 'Intel NIC firmware'
  }
  let hardwareSerialNumber = ''
  const hardwareDataPath = 'devices-data/hardware/hardware-export.json'

  beforeEach(() => {
    cy.viewport(window.screen.width, window.screen.height)
    cy.fixture(hardwareDataPath).then(hardwareImport => hardwareSerialNumber = hardwareImport.hardware[0].serial_number)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
  })

  it('Test - Hardware',() => {
    cy.openPageInDevicesNav('Hardware')
    cy.waitingLoadingFinish()

    cy.showFormAddByMatTooltip('Add')
    cy.get('#hardware-device').clear({force: true}).type(hardware.device_name)
    cy.getOptionByContent(hardware.device_name).click()
    cy.get('#hardware-template').clear({force: true}).type(hardware.template_name)
    cy.getOptionByContent(hardware.template_name).click()
    cy.getByFormControlName('serialNumberCtr').type(hardware.serial_number)
    cy.getByFormControlName('assetTagCtr').type(hardware.asset_tag)
    cy.getByFormControlName('firmwareCtr').type(hardware.firmware)

    cy.getButtonByTypeAndContent('submit', 'Create').click()
    cy.checkingToastSuccess()
    cy.get('mat-error').should('not.exist')
  });

  it('Delete hardware', function () {
    cy.openPageInDevicesNav('Hardware')
    cy.deleteRecordByName(hardware.serial_number, 'Delete', false)
    cy.get('.table__nav--search input').first().clear()
  });

  it('Import hardware', function () {
    cy.openPageInDevicesNav('Hardware')
    cy.importJsonData(`cypress/fixtures/${hardwareDataPath}`, 'Import Hardware')
  });

  it('Delete hardware just imported', function () {
    cy.openPageInDevicesNav('Hardware')
    cy.deleteRecordByName(hardwareSerialNumber, 'Delete', false)
    cy.get('.table__nav--search input').first().clear()
  });
})
