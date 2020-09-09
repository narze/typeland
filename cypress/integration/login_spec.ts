describe('login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('renders login page with sign up form', () => {
    cy.findAllByText(/Sign Up/i).should('exist')
    cy.get('form').findByLabelText(/Email/i).should('exist')
    cy.get('form')
      .findByLabelText(/Password/i)
      .should('exist')
  })
})
