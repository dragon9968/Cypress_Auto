describe('Test for Node View', () => {
  let admin:any = {}
  let node: any = {}
  let nodeX: number;
  let nodeY: number;
  let cytoscape: any;
  let nodeName: any;
  beforeEach(() => {
    cy.viewport(1366, 768)
    cy.visit('/login')
    cy.fixture('login/admin.json').then(adminData => {
      admin = adminData
    })
    cy.fixture('map/node.json').then(nodeData => {
      node = nodeData
      nodeX = node.logical_map_position.x
      nodeY = node.logical_map_position.y
    })
  })

  it('Test - Node View', () => {
    cy.login(admin.username, admin.password)
    // Landing project page
    cy.getByDataCy('btn-open-project').click()
    // Click on the first project
    cy.get('.ag-row').first().dblclick({ force: true })
    cy.wait(2000)
    // Add new node
    cy.log('START: Add new node')
    cy.getByFormControlName('deviceCtr').click({ force: true })
    cy.get('.option-text').contains(node.device_name).first().click()
    cy.getByFormControlName('templateCtr').click()
    cy.get('.option-text').contains(node.template_name).first().click()
    cy.getByDataCy('btn-add-node').click()
    cy.wait(100)
    cy.get('canvas.expand-collapse-canvas').click(nodeX, nodeY, { force: true });
    cy.getByFormControlName('nameCtr').invoke('val').should('not.eq', '')
      .then(nodeNameInput => {
        cy.wait(100)
        nodeName = nodeNameInput ? nodeNameInput.toString() : 'None'
        cy.getByFormControlName('folderCtr').type(`${node.folder}-${nodeNameInput}`)
      })
    cy.get('mat-error').should('not.exist')
    cy.getByDataCy('nodeAddForm').submit()

    cy.wait(2000)
    cy.reload()
    cy.log('END: Added new node')
    // Show View Node
    cy.get('#cy').then((el: any) => {
      cytoscape = el[0]._cyreg.cy
      const newNode = cytoscape.nodes().filter(`[name="${nodeName}"]`)[0]

      // Select Node and check all required fields
      newNode.select()
      cy.get('canvas.expand-collapse-canvas').rightclick(newNode.position('x'), newNode.position('y'), {force: true}).then(() => {
        cy.get('.cy-context-menus-cxt-menu').first().should('exist')
        cy.get('#view_details').should('exist').click({ force: true })
        cy.getByFormControlName('nameCtr').invoke('val').should('not.be.empty')
        cy.get('#node-device').invoke('val').should('not.be.empty')
        cy.get('input[name="node-device"]').should('be.visible').invoke('val').should('not.be.empty')
        cy.getByFormControlName('domainCtr').should('be.visible').invoke('val').should('not.be.empty')
        cy.getByFormControlName('folderCtr').invoke('val').should('not.be.empty')
        cy.get('input[name="node-template"]').should('be.visible').invoke('val').should('not.be.empty')
        cy.getByFormControlName('roleCtr').should('be.visible').invoke('val').should('not.be.empty')
        cy.getByFormControlName('hostnameCtr').invoke('val').should('not.be.empty')
      })
      cy.log('Select Node and check all required fields SUCCESS')
    })
  })
})