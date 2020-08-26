describe('index', () => {
  it('renders home page', () => {
    cy.visit('/')

    cy.findAllByText(/Typeland/i).should('exist')
    cy.findByText(/the quick brown fox jumps over the lazy dog/i).should(
      'exist'
    )
    cy.findByText(/GitHub/i)
      .should('have.prop', 'href')
      .and('equal', 'https://github.com/narze/typeland')
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

  it('can delete whole incomplete word with option/ctrl/meta backspace', () => {
    cy.visit('/')

    cy.focused().type('t')
    cy.focused().type('h')
    cy.findAllByTestId('correct').contains('t').next().contains('h')

    cy.focused().type('{option}{backspace}')
    cy.findAllByTestId('correct').should('not.exist')

    cy.focused().type('t')
    cy.focused().type('h')
    cy.findAllByTestId('correct').contains('t').next().contains('h')

    cy.focused().type('{ctrl}{backspace}')
    cy.findAllByTestId('correct').should('not.exist')

    cy.focused().type('t')
    cy.focused().type('h')
    cy.findAllByTestId('correct').contains('t').next().contains('h')

    cy.focused().type('{meta}{backspace}')
    cy.findAllByTestId('correct').should('not.exist')
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

  it('finish typing when reached the end', () => {
    cy.visit('/')

    cy.focused().type('the quick brown fox jumps over the lazy dog')

    cy.findByText(/Good job!/i).should('exist')
  })

  it('finish typing when pressing spacebar in the last word', () => {
    cy.visit('/')

    cy.focused().type('the quick brown fox jumps over txe lazy d ')

    cy.findByText(/Good job!/i).should('exist')
  })
})
