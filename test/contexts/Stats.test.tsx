import React from 'react'
import { render } from '../testUtils'
import { StatsContext } from '@/contexts/Stats'

const renderWithProvider = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <StatsContext.Provider {...providerProps}>{ui}</StatsContext.Provider>,
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
    <StatsContext.Consumer>
      {({ correct, wrong, total }) => (
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
