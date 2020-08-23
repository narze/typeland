describe('index', () => {
  it('renders home page', () => {
    cy.visit('/')

    cy.findByText(/Typeland/i).should('exist')
    cy.findByText(/The quick brown fox jumps over the lazy dog/i).should(
      'exist'
    )
  })
})
