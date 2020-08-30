import React from 'react'
import { render } from '../testUtils'
import { TypingArea, Mode } from '@/components/TypingArea'

it('renders typing area', () => {
  const props = {
    words: 'the quick brown fox jumps over the lazy dog'.split(' '),
    userWords: 'the quick brown dog'.split(' '),
    showCaret: true,
    mode: '',
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
    expect(getByTestId('user')).toHaveTextContent('the quick brown doge')
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
    expect(getByTestId('user')).toHaveTextContent('the quick brown doge jumps')
    expect(getByTestId('template')).toHaveTextContent('over the lazy dog')

    expect(asFragment()).toMatchSnapshot()
  })
})