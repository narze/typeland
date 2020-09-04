import React from 'react'
import { render } from '../testUtils'
import { StatsContext, StatsProvider } from '@/contexts/Stats'

const renderWithProvider = (
  ui,
  { providerProps = {}, ...renderOptions } = {}
) => {
  return render(
    <StatsProvider {...providerProps}>{ui}</StatsProvider>,
    renderOptions
  )
}

test('renders without props', () => {
  const { getByText } = renderWithProvider(
    <StatsContext.Consumer>
      {({ stats: { correct, wrong, total } }) => (
        <>
          <span>correct: {correct}</span>
          <span>wrong: {wrong}</span>
          <span>total: {total}</span>
        </>
      )}
    </StatsContext.Consumer>
  )

  expect(getByText(/^correct:/).textContent).toBe('correct: 0')
  expect(getByText(/^wrong:/).textContent).toBe('wrong: 0')
  expect(getByText(/^total:/).textContent).toBe('total: 0')
})

test('renders with props', () => {
  const providerProps = {
    value: {
      correct: 1,
      wrong: 2,
      total: 3,
    },
  }

  const { getByText } = renderWithProvider(
    <StatsContext.Consumer>
      {({ stats: { correct, wrong, total } }) => (
        <>
          <span>correct: {correct}</span>
          <span>wrong: {wrong}</span>
          <span>total: {total}</span>
        </>
      )}
    </StatsContext.Consumer>,
    { providerProps }
  )

  expect(getByText(/^correct:/).textContent).toBe('correct: 1')
  expect(getByText(/^wrong:/).textContent).toBe('wrong: 2')
  expect(getByText(/^total:/).textContent).toBe('total: 3')
})

test('can increment count & reset', () => {
  const providerProps = {
    value: {
      correct: 1,
      wrong: 2,
      total: 3,
    },
  }

  const { getByText } = renderWithProvider(
    <StatsContext.Consumer>
      {({ stats: { correct, wrong, total }, dispatch }) => (
        <>
          <span>correct: {correct}</span>
          <span>wrong: {wrong}</span>
          <span>total: {total}</span>
          <button onClick={() => dispatch({ type: 'incrementCorrect' })}>
            Increment Correct
          </button>
          <button onClick={() => dispatch({ type: 'incrementWrong' })}>
            Increment Wrong
          </button>
          <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
        </>
      )}
    </StatsContext.Consumer>,
    { providerProps }
  )

  expect(getByText(/^correct:/).textContent).toBe('correct: 1')
  expect(getByText(/^total:/).textContent).toBe('total: 3')

  getByText(/Increment Correct/).click()
  expect(getByText(/^correct:/).textContent).toBe('correct: 2')
  expect(getByText(/^wrong:/).textContent).toBe('wrong: 2')
  expect(getByText(/^total:/).textContent).toBe('total: 4')

  getByText(/Increment Wrong/).click()
  expect(getByText(/^correct:/).textContent).toBe('correct: 2')
  expect(getByText(/^wrong:/).textContent).toBe('wrong: 3')
  expect(getByText(/^total:/).textContent).toBe('total: 5')

  getByText(/Reset/).click()
  expect(getByText(/^correct:/).textContent).toBe('correct: 0')
  expect(getByText(/^wrong:/).textContent).toBe('wrong: 0')
  expect(getByText(/^total:/).textContent).toBe('total: 0')
})
