import React from 'react'
import { render } from '../testUtils'
import { TypingArea, Mode } from '@/components/TypingArea'

it('renders typing area', () => {
  const props = {
    words: 'the quick brown fox jumps over the lazy dog'.split(' '),
    userWords: 'the quick brown dog'.split(' '),
    showCaret: true,
  }

  const { asFragment, getByTestId } = render(<TypingArea {...props} />, {})
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

    const { asFragment, getByTestId } = render(<TypingArea {...props} />, {})
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

    const { asFragment, getByTestId } = render(<TypingArea {...props} />, {})
    expect(getByTestId('user')).toHaveTextContent('the quick brown foxe jumps')
    expect(getByTestId('template')).toHaveTextContent('over the lazy dog')

    expect(asFragment()).toMatchSnapshot()
  })

  it('exports stats via onStatsUpdate prop', () => {
    const onStatsUpdate = jest.fn()

    const props = {
      words: 'the quick brown fox jumps over the lazy dog'.split(' '),
      userWords: 'the quick brown doge jum'.split(' '),
      showCaret: true,
      mode: Mode.typealong,
      onStatsUpdate,
    }

    render(<TypingArea {...props} />, {})

    expect(onStatsUpdate).toHaveBeenCalledTimes(1)
    expect(onStatsUpdate).toHaveBeenCalledWith({
      correct: 3,
      wrong: 2,
    })
  })
})
