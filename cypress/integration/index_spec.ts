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
    cy.findAllByTestId('correct').contains('t')

    cy.focused().type('h')
    cy.findAllByTestId('correct').contains('t').next().contains('h')

    cy.focused().type('x')
    cy.findAllByTestId('correct').contains('t').next().contains('h')
    cy.findAllByTestId('wrong').contains('x')
  })

  it('can delete typed text with backspace', () => {
    cy.visit('/')
    cy.focused().type('t')
    cy.findAllByTestId('correct').contains('t')

    cy.focused().type('h')
    cy.findAllByTestId('correct').contains('t').next().contains('h')

    cy.focused().type('{backspace}')
    cy.findAllByTestId('correct').contains('t')

    cy.focused().type('o')
    cy.findAllByTestId('correct').contains('t')
    cy.findAllByTestId('wrong').contains('o')

    cy.focused().type('{backspace}')
    cy.findAllByTestId('correct').contains('t')
    cy.findAllByTestId('wrong').should('not.exist')

    cy.focused().type('h')
    cy.findAllByTestId('correct').contains('t').next().contains('h')
    cy.findAllByTestId('wrong').should('not.exist')
  })

  it('always focus input & show caret', () => {
    cy.visit('/')

    cy.focused().type('t')
    cy.findAllByTestId('correct').contains('t')

    cy.findAllByTestId('caret').should('exist')

    cy.focused().blur()

    cy.focused().type('h')
    cy.findAllByTestId('correct').contains('t').next().contains('h')
  })

  it('blocks all modifiers except shift', () => {
    cy.visit('/')

    cy.focused().type('{backspace}')
    cy.focused().type('T')
    cy.findAllByTestId('wrong').contains('T')

    cy.focused().type('{backspace}')
    cy.focused().type('{alt}{shift}a')
    cy.focused().type('{ctrl}{shift}b')
    cy.focused().type('{meta}{shift}c')
    cy.findAllByTestId('wrong').should('not.exist')
  })
})
