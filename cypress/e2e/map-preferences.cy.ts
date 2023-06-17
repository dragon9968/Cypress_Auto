describe('Map Preferences e2e testing', {testIsolation: true}, () => {
  let mapPreferences: any = [];
  const addDeleteMapPref = {
    name: 'Add Delete Test'
  }

  const addDeleteMultiMapPref = {
    name_multi1: 'Multi Delete 1',
    name_multi2: 'Multi Delete 2',
  }
  beforeEach(() => {
    cy.viewport(1366, 768)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
    cy.fixture('map-preferences/map-preferences.json').then(
      mapPrefData => mapPreferences = mapPrefData
    )
  })

  it('Test - Add new map preferences', () => {
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.get('button>span').contains('Map Preferences').click()
    cy.waitingLoadingFinish()
    cy.showFormAddByMatTooltip('Add')
    cy.addUpdateMapPreferences(mapPreferences.mapPrefAdd[0])
  })

  it('Test - Edit map preferences', () => {
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.waitingLoadingFinish()
    cy.get('button>span').contains('Map Preferences').click()
    cy.waitingLoadingFinish()
    cy.showFormEditByName(mapPreferences.mapPrefAdd[0].name)
    cy.addUpdateMapPreferences(mapPreferences.mapPrefEdit[0])
  })

  it('Test - Export as Json with single map preferences', () => {
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.waitingLoadingFinish()
    cy.get('button>span').contains('Map Preferences').click({force: true})
    cy.waitingLoadingFinish()
    // Export as Json with single
    cy.selectRowByName(mapPreferences.mapPrefEdit[0].name)
    cy.getByMatToolTip('Export as JSON').click()
    cy.checkingToastSuccess()
  })

  it('Test - Export as Json with Select All map preferences', () => {
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.get('button>span').contains('Map Preferences').click()
    cy.waitingLoadingFinish()
    // Export With Select All
    cy.selectAllRow()
    cy.waitingLoadingFinish()
    cy.getByMatToolTip('Export as JSON').click()
    cy.checkingToastSuccess()
    cy.unSelectAllRow()
  })

  it('Test - Add multi map preferences', () => {
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.get('button>span').contains('Map Preferences').click()
    cy.waitingLoadingFinish()
    // Add-delete pref
    cy.showFormAddByMatTooltip('Add')
    cy.getByFormControlName('name').as('name').invoke('val').then(val => {
      cy.get('@name').clear().type(addDeleteMapPref.name)
    })
    cy.checkingMatErrorIsExistOrNot(false)
    cy.getByDataCy('mapPrefForm').submit()
    cy.checkingToastSuccess()

    // Add-delete multi map-pref
    cy.showFormAddByMatTooltip('Add')
    cy.getByFormControlName('name').as('name').invoke('val').then(val => {
      cy.get('@name').clear().type(addDeleteMultiMapPref.name_multi1)
    })
    cy.checkingMatErrorIsExistOrNot(false)
    cy.getByDataCy('mapPrefForm').submit()
    cy.checkingToastSuccess()

    cy.showFormAddByMatTooltip('Add')
    cy.getByFormControlName('name').as('name').invoke('val').then(val => {
      cy.get('@name').clear().type(addDeleteMultiMapPref.name_multi2)
    })
    cy.checkingMatErrorIsExistOrNot(false)
    cy.getByDataCy('mapPrefForm').submit()
    cy.checkingToastSuccess()
  })

  it('Test - Delete single map preferences', () => {
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.waitingLoadingFinish()
    cy.get('button>span').contains('Map Preferences').click()
    cy.log(`START: Delete Map Pref`)
    // Delete single Map-Pref
    cy.waitingLoadingFinish()
    cy.selectRowByName(addDeleteMapPref.name)
    cy.getByMatToolTip('Delete').click()
    cy.get('mat-dialog-container').should('exist')
    cy.getButtonByTypeAndContent('submit', 'OK').click()
    cy.checkingToastSuccess()
  })

  it('Test - Delete multi map preferences', () => {
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.waitingLoadingFinish()
    cy.get('button>span').contains('Map Preferences').click()
    cy.log(`START: Delete Map Pref`)
    // Delete Multi Map-Pref
    cy.waitingLoadingFinish()
    cy.selectRowByName(addDeleteMultiMapPref.name_multi1)
    cy.selectRowByName(addDeleteMultiMapPref.name_multi2)
    cy.selectRowByName(mapPreferences.mapPrefEdit[0].name)
    cy.getByMatToolTip('Delete').click()
    cy.get('mat-dialog-container').should('exist')
    cy.getButtonByTypeAndContent('submit', 'OK').click()
    cy.checkingToastSuccess()
    cy.log(`END: Delete successfully`)
  })
})
