describe('login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('renders login page', () => {
    cy.findAllByText(/Login/i).should('exist')
    cy.get('form').findByLabelText(/Email/i).should('exist')
    cy.get('form')
      .findByLabelText(/Password/i)
      .should('exist')
  })
})
