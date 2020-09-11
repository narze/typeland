import React from 'react'
import { render } from '../testUtils'
import { TypingArea } from '@/components/TypingArea'
import { StatsContext } from '../../contexts/Stats'

const providerValue = {
  dispatch: jest.fn(),
  state: {
    correct: 0,
    wrong: 0,
    total: 0,
  },
}

afterEach(() => {
  providerValue.dispatch.mockClear()
})

const renderWithProvider = (
  ui,
  { providerProps = { value: providerValue }, ...renderOptions } = {}
) => {
  return render(
    <StatsContext.Provider {...providerProps}>{ui}</StatsContext.Provider>,
    renderOptions
  )
}

it('renders typing area', () => {
  const props = {
    words: 'the quick brown fox jumps over the lazy dog'.split(' '),
    userWords: 'the quick brown dog'.split(' '),
    showCaret: true,
  }

  const { asFragment, getAllByTestId } = renderWithProvider(
    <TypingArea {...props} />,
    {}
  )

  expect(getAllByTestId('word').map((e) => e.textContent)).toEqual([
    'the',
    'quick',
    'brown',
    'fox',
  ])

  expect(getAllByTestId('remainingWord').map((e) => e.textContent)).toEqual([
    'jumps',
    'over',
    'the',
    'lazy',
    'dog',
  ])

  expect(asFragment()).toMatchSnapshot()
})

it('renders template & user area combined', () => {
  const props = {
    words: 'the quick brown fox jumps over the lazy dog'.split(' '),
    userWords: 'the quick brown doge'.split(' '),
    showCaret: true,
  }

  const { getAllByTestId } = renderWithProvider(<TypingArea {...props} />, {})

  expect(getAllByTestId('word').map((e) => e.textContent)).toEqual([
    'the',
    'quick',
    'brown',
    'foxe',
  ])

  expect(getAllByTestId('remainingWord').map((e) => e.textContent)).toEqual([
    'jumps',
    'over',
    'the',
    'lazy',
    'dog',
  ])
})

it('renders mid-word correctly', () => {
  const props = {
    words: 'the quick brown fox jumps over the lazy dog'.split(' '),
    userWords: 'the quick brown doge jum'.split(' '),
    showCaret: true,
  }

  const { asFragment, getAllByTestId } = renderWithProvider(
    <TypingArea {...props} />,
    {}
  )

  expect(getAllByTestId('word').map((e) => e.textContent)).toEqual([
    'the',
    'quick',
    'brown',
    'foxe',
    'jumps',
  ])

  expect(getAllByTestId('remainingWord').map((e) => e.textContent)).toEqual([
    'over',
    'the',
    'lazy',
    'dog',
  ])

  expect(asFragment()).toMatchSnapshot()
})

it('exports stats via StatsContext', () => {
  const props = {
    words: 'the quick brown fox jumps over the lazy dog'.split(' '),
    userWords: 'the quick brown doge jum '.split(' '),
    showCaret: true,
  }

  renderWithProvider(<TypingArea {...props} />)

  expect(providerValue.dispatch).toHaveBeenCalledTimes(5)
  expect(providerValue.dispatch).toHaveBeenNthCalledWith(1, {
    type: 'incrementCorrect',
  })
  expect(providerValue.dispatch).toHaveBeenNthCalledWith(2, {
    type: 'incrementCorrect',
  })
  expect(providerValue.dispatch).toHaveBeenNthCalledWith(3, {
    type: 'incrementCorrect',
  })
  expect(providerValue.dispatch).toHaveBeenNthCalledWith(4, {
    type: 'incrementWrong',
  })
  expect(providerValue.dispatch).toHaveBeenNthCalledWith(5, {
    type: 'incrementWrong',
  })

  providerValue.dispatch.mockClear()

  props.userWords = 'the quick brown doge jum over a lazy dog'.split(' ')

  renderWithProvider(<TypingArea {...props} />, {
    providerProps: {
      value: {
        ...providerValue,
        state: { ...providerValue.state, total: 5 },
      },
    },
  })

  expect(providerValue.dispatch).toHaveBeenCalledTimes(4)
  expect(providerValue.dispatch).toHaveBeenNthCalledWith(1, {
    type: 'incrementCorrect',
  })
  expect(providerValue.dispatch).toHaveBeenNthCalledWith(2, {
    type: 'incrementWrong',
  })
  expect(providerValue.dispatch).toHaveBeenNthCalledWith(3, {
    type: 'incrementCorrect',
  })
  expect(providerValue.dispatch).toHaveBeenNthCalledWith(4, {
    type: 'incrementCorrect',
  })
})
