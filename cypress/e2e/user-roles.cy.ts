describe('User/Role to Full Flow Test', {testIsolation: true}, () => {
  const newRole = {
    name: 'Test Role E2E',
    permissions: [
      'can_read on Project',
      'can_read on Devices',
      'can_read on Libraries',
      'can_write on Project',
      'can_write on Devices',
      'can_write on Libraries',
    ]
  }

  const roleEdit = {
    name: 'Test User Role E2E',
    permissions: [
      'can_read on Project',
      'can_read on Devices',
      'can_read on Libraries',
      'can_read on Settings',
      'can_read on Tasks',
      'can_read on Security',
    ]
  }
  const newUser = {
    first_name: 'Bob',
    last_name: 'Jones',
    username: 'bob.jones',
    active: false,
    email: 'bob.jones@bc.com',
    role: ['Test User Role'],
    password: 'Password',
    confirm_password: 'Password',
  }

  const userEdit = {
    first_name: 'Robert',
    last_name: 'Jones',
    username: 'robert.jones',
    active: true,
    email: 'robert.jones@bc.com',
    role: ['Test User Role', 'User'],
    password: 'Password123',
    confirm_password: 'Password123',
  }

  beforeEach(() => {
    cy.viewport(1366, 768)
    const setup = () => {
      cy.visit('/login')
      cy.login("admin", "password")
    }
    cy.session('login', setup)
  })

  it('Add new role', () => {
    cy.openPageInAdministrationNav('Roles')
    cy.showFormAddByMatTooltip('Add')
    cy.addUpdateRole(newRole)
  });

  it('Edit role', () => {
    cy.openPageInAdministrationNav('Roles')
    cy.selectRowByName(newRole.name)
    cy.showFormAddByMatTooltip('Edit')
    cy.addUpdateRole(roleEdit, 'update')
  });

  it('Add new user', () => {
    cy.openPageInAdministrationNav('Users')
    cy.showFormAddByMatTooltip('Add')
    cy.addUpdateUser(newUser)
  });

  it('Update user', () => {
    cy.openPageInAdministrationNav('Users')
    cy.selectRowByName(newUser.username)
    cy.showFormAddByMatTooltip('Edit')
    cy.addUpdateUser(userEdit, 'update')
  });

  it('Delete user', () => {
    cy.openPageInAdministrationNav('Users')
    cy.deleteRecordByName(userEdit.username, 'Delete', false)
  });

  it('Delete role', () => {
    cy.openPageInAdministrationNav('Roles')
    cy.deleteRecordByName(roleEdit.name, 'Delete', false)
  });

})
