describe('Map Preferences e2e testing', () => {
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
    cy.viewport(1366, 768)
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.get('button>span').contains('Map Preferences').click()
    cy.wait(2000)
    // Show form add 
    cy.showFormAddByMatTooltip('Add')
    cy.addUpdateMapPreferences(mapPreferences.mapPrefAdd[0])
    cy.wait(2000)
  })

  it('Test - Edit map preferences', () => {
    cy.viewport(1366, 768)
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.get('button>span').contains('Map Preferences').click()
    cy.wait(2000)
    // Show form edit 
    cy.showFormEditByName(mapPreferences.mapPrefAdd[0].name)
    cy.addUpdateMapPreferences(mapPreferences.mapPrefEdit[0])
    cy.wait(2000)
  })

  it('Test - Export as Json with single map preferences', () => {
    cy.viewport(1366, 768)
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.get('button>span').contains('Map Preferences').click()
    cy.wait(2000)
    // Export as Json with single
    cy.selectRowByName(mapPreferences.mapPrefEdit[0].name)
    cy.getByMatToolTip('Export as JSON').click()
    cy.wait(2000)
  })

  it('Test - Export as Json with Select All map preferences', () => {
    cy.viewport(1366, 768)
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.get('button>span').contains('Map Preferences').click()
    cy.wait(2000)
    // Export With Select All
    cy.selectAllRow()
    cy.wait(2000)
    cy.getByMatToolTip('Export as JSON').click()
    cy.wait(1000)
    cy.unSelectAllRow()
    cy.wait(2000)
  })

  it('Test - Add multi map preferences', () => {
    cy.viewport(1366, 768)
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.get('button>span').contains('Map Preferences').click()
    cy.wait(2000)
    // Add-delete pref
    cy.showFormAddByMatTooltip('Add')
    cy.getByFormControlName('name').as('name').invoke('val').then(val => {
      cy.get('@name').clear().type(addDeleteMapPref.name)
    })
    cy.get('mat-error').should('not.exist')
    cy.wait(2000)
    cy.getByDataCy('mapPrefForm').submit()

    // Add-delete multi map-pref
    cy.showFormAddByMatTooltip('Add')
    cy.getByFormControlName('name').as('name').invoke('val').then(val => {
      cy.get('@name').clear().type(addDeleteMultiMapPref.name_multi1)
    })
    cy.get('mat-error').should('not.exist')
    cy.wait(2000)
    cy.getByDataCy('mapPrefForm').submit()

    cy.showFormAddByMatTooltip('Add')
    cy.getByFormControlName('name').as('name').invoke('val').then(val => {
      cy.get('@name').clear().type(addDeleteMultiMapPref.name_multi2)
    })
    cy.get('mat-error').should('not.exist')
    cy.wait(2000)
    cy.getByDataCy('mapPrefForm').submit()
    cy.wait(2000)
  })

  it('Test - Delete single map preferences', () => {
    cy.viewport(1366, 768)
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.get('button>span').contains('Map Preferences').click()
    cy.wait(2000)
    cy.log(`START: Delete Map Pref`)
    // Delete single Map-Pref
    cy.selectRowByName(addDeleteMapPref.name)
    cy.getByMatToolTip('Delete').click()
    cy.get('mat-dialog-container').should('exist')
    cy.wait(2000)
    cy.getButtonByTypeAndContent('submit', 'OK').click()
    cy.wait(2000)
    cy.get('mat-dialog-container').should('not.exist')
    cy.wait(2000)
  })

  it('Test - Delete multi map preferences', () => {
    cy.viewport(1366, 768)
    cy.visit('/')
    cy.getByDataCy('btn-nav-app-pref').click()
    cy.get('button>span').contains('Map Preferences').click()
    cy.wait(2000)
    cy.log(`START: Delete Map Pref`)
    // Delete Multi Map-Pref
    cy.selectRowByName(addDeleteMultiMapPref.name_multi1)
    cy.selectRowByName(addDeleteMultiMapPref.name_multi2)
    cy.selectRowByName(mapPreferences.mapPrefEdit[0].name)
    cy.getByMatToolTip('Delete').click()
    cy.get('mat-dialog-container').should('exist')
    cy.wait(2000)
    cy.getButtonByTypeAndContent('submit', 'OK').click()
    cy.wait(2000)
    cy.get('mat-dialog-container').should('not.exist')
    cy.log(`END: Delete successfully`)

    Cypress.session.clearAllSavedSessions()
  })

})