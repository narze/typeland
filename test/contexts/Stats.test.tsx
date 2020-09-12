import React from 'react'
import { render } from '../testUtils'
import {
  StatsStateConsumer,
  StatsProvider,
  reducer,
  Action,
} from '@/contexts/Stats'

describe('reducer', () => {
  const state = {
    correct: 1,
    wrong: 2,
    total: 3,
  }

  it('incrementCorrect increments correct & total', () => {
    const action: Action = {
      type: 'incrementCorrect',
    }

    expect(reducer(state, action)).toEqual({ correct: 2, wrong: 2, total: 4 })
  })

  it('incrementWrong increments wrong & total', () => {
    const action: Action = {
      type: 'incrementWrong',
    }

    expect(reducer(state, action)).toEqual({ correct: 1, wrong: 3, total: 4 })
  })

  it('reset clears all values to 0', () => {
    const action: Action = {
      type: 'reset',
    }

    expect(reducer(state, action)).toEqual({ correct: 0, wrong: 0, total: 0 })
  })
})

const renderWithProvider = (
  ui,
  { providerProps = {}, ...renderOptions } = {}
) => {
  return render(
    <StatsProvider {...providerProps}>{ui}</StatsProvider>,
    renderOptions
  )
}

it('expose props', () => {
  const providerProps = {
    initialState: {
      correct: 1,
      wrong: 2,
      total: 3,
    },
  }

  renderWithProvider(
    <StatsStateConsumer>
      {({ correct, wrong, total }) => {
        expect(correct).toBe(1)
        expect(wrong).toBe(2)
        expect(total).toBe(3)
        return <></>
      }}
    </StatsStateConsumer>,
    { providerProps }
  )
})
