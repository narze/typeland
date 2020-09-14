import React from 'react'
import { render } from '../testUtils'
import { TypingArea } from '@/components/TypingArea'
import { StatsProvider } from '../../contexts/Stats'
import * as Stats from '../../contexts/Stats'

const providerValue = {
  initialState: {
    correct: 0,
    wrong: 0,
    total: 0,
    loading: false,
  },
}

const mockDispatch = jest.fn()
const mockUseStats = jest
  .spyOn(Stats, 'useStats')
  .mockReturnValue([providerValue.initialState, mockDispatch])

afterEach(() => {
  mockDispatch.mockClear()
  mockUseStats.mockClear()
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

  expect(mockDispatch).toHaveBeenCalledTimes(5)
  expect(mockDispatch).toHaveBeenNthCalledWith(1, {
    type: 'incrementCorrect',
  })
  expect(mockDispatch).toHaveBeenNthCalledWith(2, {
    type: 'incrementCorrect',
  })
  expect(mockDispatch).toHaveBeenNthCalledWith(3, {
    type: 'incrementCorrect',
  })
  expect(mockDispatch).toHaveBeenNthCalledWith(4, {
    type: 'incrementWrong',
  })
  expect(mockDispatch).toHaveBeenNthCalledWith(5, {
    type: 'incrementWrong',
  })

  mockDispatch.mockClear()
  mockUseStats.mockClear()

  props.userWords = 'the quick brown doge jum over a lazy dog'.split(' ')

  renderWithProvider(<TypingArea {...props} />, {
    providerProps: {
      value: {
        ...providerValue,
        initialState: { ...providerValue.initialState, total: 5 },
      },
    },
  })

  expect(mockDispatch).toHaveBeenCalledTimes(5 + 4)
  expect(mockDispatch).toHaveBeenNthCalledWith(6, {
    type: 'incrementCorrect',
  })
  expect(mockDispatch).toHaveBeenNthCalledWith(7, {
    type: 'incrementWrong',
  })
  expect(mockDispatch).toHaveBeenNthCalledWith(8, {
    type: 'incrementCorrect',
  })
  expect(mockDispatch).toHaveBeenNthCalledWith(9, {
    type: 'incrementCorrect',
  })
})
