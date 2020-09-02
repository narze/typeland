describe('index', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win._seed = {
          words: 'the quick brown fox',
          disableTimer: true,
        }
      },
    })
  })

  it('renders home page', () => {
    cy.findAllByText(/Typeland/i).should('exist')
    cy.findByText(/the quick brown fox/i).should('exist')
    cy.findByText(/GitHub/i)
      .should('have.prop', 'href')
      .and('equal', 'https://github.com/narze/typeland')
  })

  it('highlight typed text', () => {
    cy.focused().type('t')
    cy.findAllByTestId('correct').contains('t')

    cy.focused().type('h')
    cy.findAllByTestId('correct').contains('t').next().contains('h')

    cy.focused().type('x')
    cy.findAllByTestId('correct').contains('t').next().contains('h')
    cy.findAllByTestId('wrong').contains('x')
  })

  it('can delete typed text with backspace', () => {
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
    cy.focused().type('t')
    cy.findAllByTestId('correct').contains('t')

    cy.findAllByTestId('caret').should('exist')

    cy.focused().blur()

    cy.focused().type('h')
    cy.findAllByTestId('correct').contains('t').next().contains('h')
  })

  it('blocks all modifiers except shift', () => {
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
    cy.focused().type('the quick brown fox')

    cy.findByText(/Good job!/i).should('exist')
  })

  it('finish typing when pressing spacebar in the last word', () => {
    cy.focused().type('the quick  brown f ')

    cy.findByText(/Good job!/i).should('exist')
  })

  it('shows wpm when finished typing', () => {
    cy.clock(new Date())

    cy.focused().type('the quick ')
    cy.tick(10 * 1000)
    cy.focused().type('brown fox')

    cy.findByText(/Good job!/i).should('exist')
    cy.findByText(/24 wpm/i).should('exist') // 4 * 60 / 10
  })

  it('can restart after finished typing', () => {
    cy.focused().type('the quick brown fox')

    cy.findByText(/Good job!/i).should('exist')
    cy.findByRole('button', { name: /Restart/i }).click()
    cy.findByText(/Good job!/i).should('not.exist')
    cy.findByText(/Restart/i).should('not.exist')
  })

  it('can restart with enter key when finished', () => {
    cy.focused().type('the quick brown fox')

    cy.findByText(/Good job!/i).should('exist')
    cy.findByRole('button', { name: /Restart/i }).should('exist')

    cy.focused().type('{enter}')

    cy.findByText(/Good job!/i).should('not.exist')
    cy.findByText(/Restart/i).should('not.exist')
  })

  it('can restart mid-session with double enter', () => {
    cy.focused().type('the quick ')

    cy.findByText(/Good job!/i).should('not.exist')
    cy.findByText(/Restart/i).should('not.exist')

    cy.focused().type('{enter}')

    cy.findByRole('button', { name: /Restart/i }).should('exist')

    // Continue typing cancels restart
    cy.focused().type('brown')

    cy.findByText(/Restart/i).should('not.exist')

    cy.focused().type('{enter}')

    cy.findByRole('button', { name: /Restart/i }).should('exist')

    // Press enter again to restart
    cy.focused().type('{enter}')
    cy.findByText(/Restart/i).should('not.exist')
  })

  it('can change to typealong mode and back to default mode', () => {
    cy.findByRole('button', { name: /default/i }).click()
    cy.findByRole('button', { name: /typealong/i }).click()
    cy.findByRole('button', { name: /default/i }).click()
  })

  it('shows live wpm on start', () => {
    cy.findByText(/wpm/i).should('not.exist')

    cy.focused().type('t')

    cy.findByText(/wpm/i).should('exist')

    cy.focused().type('he quick brown fox')

    cy.findAllByText(/wpm/i).should('have.length', 1)
  })

  it('shows stats on start', () => {
    cy.findByText('Stats (correct/wrong/total) : 0/0/0').should('not.exist')

    cy.focused().type('t')

    cy.findByText('Stats (correct/wrong/total) : 0/0/0').should('exist')

    cy.focused().type('he quick ')

    cy.findByText('Stats (correct/wrong/total) : 2/0/2').should('exist')

    cy.focused().type('blue fox')

    cy.findByText('Stats (correct/wrong/total) : 3/1/4').should('exist')
  })
})
