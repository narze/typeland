import React from 'react'
import { render } from '../testUtils'
import { StatContext } from '@/contexts/Stat'

const renderWithProvider = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <StatContext.Provider {...providerProps}>{ui}</StatContext.Provider>,
    renderOptions
  )
}

test('Renders correctly', () => {
  const providerProps = {
    value: {
      correct: 1,
      wrong: 2,
      total: 3,
    },
  }

  const { getByText } = renderWithProvider(
    <StatContext.Consumer>
      {({ correct, wrong, total }) => (
        <>
          <span>correct: {correct}</span>
          <span>wrong: {wrong}</span>
          <span>total: {total}</span>
        </>
      )}
    </StatContext.Consumer>,
    { providerProps }
  )

  expect(getByText(/^correct:/).textContent).toBe('correct: 1')
  expect(getByText(/^wrong:/).textContent).toBe('wrong: 2')
  expect(getByText(/^total:/).textContent).toBe('total: 3')
})
