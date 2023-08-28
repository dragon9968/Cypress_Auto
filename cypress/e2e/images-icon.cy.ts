describe('Test Images/Icon', {testIsolation: true}, () => {

  const imagesData = {
    name: 'E2E - Test new Images',
    filePath: 'cypress/fixtures/images-icon/images-test.jpeg'
  }
  const imagesEditData = {
    name: 'E2E - Test Images',
    filePath: 'cypress/fixtures/images-icon/images-edit.jpg'
  }

  const iconData = {
    name: 'E2E - Test new Icon',
    filePath: 'cypress/fixtures/images-icon/images-test.jpeg'
  }
  const iconEditData = {
    name: 'E2E - Test Icon',
    filePath: 'cypress/fixtures/images-icon/images-test.jpeg'
  }

  const importImagesData = {
    name: 'E2E - Test Import',
    filePath: 'cypress/fixtures/images-icon/images-import.json'
  }

  const importIconData = {
    name: 'E2E - Test Import',
    filePath: 'cypress/fixtures/images-icon/icon.json'
  }

  const validaitonSizeImages = {
    name: 'E2E - Test Images',
    filePath: 'cypress/fixtures/images-icon/images-size-gt-5mb.png'
  }

  beforeEach(() => {
    cy.viewport(1920, 1080)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
  })

  it ('Test - Check validation', () => {
    cy.visit('/libraries/image')
    cy.wait(1000)
    cy.getByMatToolTip('Add').click( {force: true} )
    cy.wait(1000)
    // validation format file
    cy.actionImages(importImagesData, 'add', 'images', true);
    cy.wait(2000)

    //  validaiton maxsize file
    cy.actionImages(validaitonSizeImages, 'add', 'images', true);
    cy.wait(2000)
  })

  it ('Test - add/update images', () => {
    cy.visit('/libraries/image')
    cy.wait(1000)
    // Test add new images
    cy.getByMatToolTip('Add').click( {force: true} )
    cy.wait(1000)
    cy.actionImages(imagesData, 'add', 'images', false);
    cy.wait(2000)
    // Test edit images
    cy.getSelectImagesByName(imagesData.name).check({force: true})
    cy.wait(2000)
    cy.getByMatToolTip('Edit').click( {force: true} )
    cy.wait(1000)
    cy.actionImages(imagesEditData, 'edit', 'images', false);
    cy.wait(2000)
    // Delete image by name
    cy.getSelectImagesByName(imagesEditData.name).check({force: true})
    cy.deleteRecordByName(imagesEditData.name, 'Delete', true)
    cy.wait(2000)
    // Test import images
    cy.getByMatToolTip('Import').click( {force: true} );
    cy.actionImages(importImagesData, 'import', 'import', false);
    cy.wait(3000)
  })

  it ('Test - add/update icon', () => {
    cy.visit('/libraries/icon')
    cy.wait(1000)
    // Test add new Icon
    cy.getByMatToolTip('Add').click( {force: true} )
    cy.wait(1000)
    cy.actionImages(iconData, 'add', 'icon', false);
    cy.wait(2000)
    // Test edit icon
    cy.getSelectImagesByName(iconData.name).check({force: true})
    cy.wait(2000)
    cy.getByMatToolTip('Edit').click( {force: true} )
    cy.wait(1000)
    cy.actionImages(iconEditData, 'edit', 'icon', false);
    cy.wait(2000)
    // Delete image by name
    cy.getSelectImagesByName(iconEditData.name).check({force: true})
    cy.deleteRecordByName(iconEditData.name, 'Delete', true)
    cy.wait(2000)
    // Test import icon
    cy.getByMatToolTip('Import').click( {force: true} );
    cy.actionImages(importIconData, 'import', 'import', false);
    cy.wait(2000)
  })
})
