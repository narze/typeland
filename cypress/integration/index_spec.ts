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

  it('can delete typed text with backspace', () => {
    cy.visit('/')
    cy.focused().type('t')
    cy.findByTestId('correct').contains('t')

    cy.focused().type('h')
    cy.findByTestId('correct').contains('th')

    cy.focused().type('{backspace}')
    cy.findByTestId('correct').contains('t')

    cy.focused().type('o')
    cy.findByTestId('correct').contains('t')
    cy.findByTestId('wrong').contains('o')

    cy.focused().type('{backspace}')
    cy.findByTestId('correct').contains('t')
    cy.findByTestId('wrong').should('not.exist')

    cy.focused().type('h')
    cy.findByTestId('correct').contains('th')
    cy.findByTestId('wrong').should('not.exist')
  })

  it('always focus input & show caret', () => {
    cy.visit('/')

    cy.focused().type('t')
    cy.findByTestId('correct').contains('t')

    cy.findByTestId('caret').should('exist')

    cy.focused().blur()

    cy.focused().type('h')
    cy.findByTestId('correct').contains('th')
  })
})
