describe('index', () => {
  it('renders home page', () => {
    cy.visit('/')

    cy.findByText(/Typeland/i).should('exist')
    cy.findByText(/the quick brown fox jumps over the lazy dog/i).should(
      'exist'
    )
  })

  it('highlight typed text', () => {
    cy.visit('/')

    cy.focused().type('t')
    cy.findByTestId('correct').contains('t')

    cy.focused().type('h')
    cy.findByTestId('correct').contains('th')

    cy.focused().type('x')
    cy.findByTestId('correct').contains('th')
    cy.findByTestId('wrong').contains('x')
  })
})
