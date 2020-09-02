import React from 'react'
import { render } from '../testUtils'
import { TypingArea, Mode } from '@/components/TypingArea'
import { StatsContext } from '../../contexts/Stats'

const providerValue = {
  incrementCorrect: jest.fn(),
  incrementWrong: jest.fn(),
  reset: jest.fn(),
  correct: 0,
  wrong: 0,
  total: 0,
}

afterEach(() => {
  providerValue.incrementCorrect.mockClear()
  providerValue.incrementWrong.mockClear()
  providerValue.reset.mockClear()
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

  const { asFragment, getByTestId } = renderWithProvider(
    <TypingArea {...props} />,
    {}
  )
  expect(getByTestId('template')).toHaveTextContent(
    'the quick brown fox jumps over the lazy dog'
  )
  expect(getByTestId('user')).toHaveTextContent('the quick brown dog')

  expect(asFragment()).toMatchSnapshot()
})

describe('typealong mode', () => {
  it('renders template & user area combined', () => {
    const props = {
      words: 'the quick brown fox jumps over the lazy dog'.split(' '),
      userWords: 'the quick brown doge'.split(' '),
      showCaret: true,
      mode: Mode.typealong,
    }

    const { asFragment, getByTestId } = renderWithProvider(
      <TypingArea {...props} />,
      {}
    )
    expect(getByTestId('user')).toHaveTextContent('the quick brown foxe')
    expect(getByTestId('template')).toHaveTextContent('jumps over the lazy dog')

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders mid-word correctly', () => {
    const props = {
      words: 'the quick brown fox jumps over the lazy dog'.split(' '),
      userWords: 'the quick brown doge jum'.split(' '),
      showCaret: true,
      mode: Mode.typealong,
    }

    const { asFragment, getByTestId } = renderWithProvider(
      <TypingArea {...props} />,
      {}
    )
    expect(getByTestId('user')).toHaveTextContent('the quick brown foxe jumps')
    expect(getByTestId('template')).toHaveTextContent('over the lazy dog')

    expect(asFragment()).toMatchSnapshot()
  })

  it('exports stats via StatsContext', () => {
    const props = {
      words: 'the quick brown fox jumps over the lazy dog'.split(' '),
      userWords: 'the quick brown doge jum '.split(' '),
      showCaret: true,
      mode: Mode.typealong,
    }

    renderWithProvider(<TypingArea {...props} />)

    expect(providerValue.incrementCorrect).toHaveBeenCalledTimes(3)
    expect(providerValue.incrementWrong).toHaveBeenCalledTimes(2)

    providerValue.incrementCorrect.mockClear()
    providerValue.incrementWrong.mockClear()

    props.userWords = 'the quick brown doge jum over a lazy dog'.split(' ')

    renderWithProvider(<TypingArea {...props} />, {
      providerProps: { value: { ...providerValue, total: 5 } },
    })

    expect(providerValue.incrementCorrect).toHaveBeenCalledTimes(3)
    expect(providerValue.incrementWrong).toHaveBeenCalledTimes(1)
  })
})
