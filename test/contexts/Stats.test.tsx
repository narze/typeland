import React from 'react'
import { render, fireEvent } from '../testUtils'
import {
  StatsProvider,
  reducer,
  CallableAction,
  StatsDispatchContext,
  StatsStateContext,
} from '@/contexts/Stats'
import { db } from '../../config/firebase'

const mockAdd = jest.fn()

db.collection = jest.fn().mockReturnValue({
  add: mockAdd,
})

describe('reducer', () => {
  const state = {
    correct: 1,
    wrong: 2,
    total: 3,
    loading: false,
  }

  it('incrementCorrect increments correct & total', () => {
    const action: CallableAction = {
      type: 'incrementCorrect',
    }

    expect(reducer(state, action)).toEqual(
      expect.objectContaining({ correct: 2, wrong: 2, total: 4 })
    )
  })

  it('incrementWrong increments wrong & total', () => {
    const action: CallableAction = {
      type: 'incrementWrong',
    }

    expect(reducer(state, action)).toEqual(
      expect.objectContaining({ correct: 1, wrong: 3, total: 4 })
    )
  })

  it('reset clears all values to 0', () => {
    const action: CallableAction = {
      type: 'reset',
    }

    expect(reducer(state, action)).toEqual(
      expect.objectContaining({ correct: 0, wrong: 0, total: 0 })
    )
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
    <StatsStateContext.Consumer>
      {({ correct, wrong, total }) => {
        expect(correct).toBe(1)
        expect(wrong).toBe(2)
        expect(total).toBe(3)
        return <></>
      }}
    </StatsStateContext.Consumer>,
    { providerProps }
  )
})

test('can increment count & reset', () => {
  const providerProps = {
    initialState: {
      correct: 1,
      wrong: 2,
      total: 3,
    },
  }

  const { getByText } = renderWithProvider(
    <StatsStateContext.Consumer>
      {({ correct, wrong, total }) => (
        <StatsDispatchContext.Consumer>
          {(dispatch) => (
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
        </StatsDispatchContext.Consumer>
      )}
    </StatsStateContext.Consumer>,
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

test('can submit stats', async () => {
  const providerProps = {
    initialState: {
      correct: 1,
      wrong: 2,
      total: 3,
      loading: false,
    },
  }

  const { getByText, findByText } = renderWithProvider(
    <StatsStateContext.Consumer>
      {({ loading }) => (
        <StatsDispatchContext.Consumer>
          {(dispatch) => (
            <>
              <button
                onClick={() =>
                  dispatch({ type: 'SUBMIT_STATS', payload: { uid: '1' } })
                }
              >
                Submit Stats
              </button>
              <span>loading: {loading ? 'true' : 'false'}</span>
            </>
          )}
        </StatsDispatchContext.Consumer>
      )}
    </StatsStateContext.Consumer>,
    { providerProps }
  )

  expect(getByText(/^loading:/).textContent).toBe('loading: false')

  fireEvent.click(getByText(/Submit Stats/))
  expect(getByText(/^loading: true/)).toBeInTheDocument()

  expect(db.collection).toBeCalledWith('results')
  expect(db.collection).toBeCalledTimes(1)

  expect(mockAdd).toBeCalledWith(
    expect.objectContaining({
      stats: { correct: 1, wrong: 2, total: 3 },
      timestamp: expect.anything(),
      user: expect.anything(),
    })
  )

  // After FINISH_SUBMIT_STATS, loading will be false again
  expect(await findByText(/^loading: false/)).toBeInTheDocument()
})
