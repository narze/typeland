import React from 'react'
import { render } from '../testUtils'
import { Word, Mode } from '@/components/Word'

it('renders single word with caret', () => {
  const props = {
    template: 'doge',
    userInput: 'do',
    showCaret: true,
    mode: Mode.typealong,
  }

  const { asFragment, getAllByTestId } = render(<Word {...props} />, {})
  expect(
    getAllByTestId('correct')
      .map((e) => e.textContent)
      .join('')
  ).toBe('do')
  expect(
    getAllByTestId('pending')
      .map((e) => e.textContent)
      .join('')
  ).toBe('ge')

  const o = getAllByTestId('correct').slice(-1)[0]
    .nextElementSibling as HTMLElement
  expect(o.dataset.testid).toBe('caret')

  expect(asFragment()).toMatchSnapshot()
})
