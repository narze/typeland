import React from 'react'
import { render } from '../testUtils'
import { Word, Mode } from '@/components/Word'

it('renders user character on wrong typing in default mode', () => {
  const props = {
    template: 'world',
    userInput: 'wwww',
    showCaret: true,
  }

  const { asFragment, getAllByTestId } = render(<Word {...props} />, {})
  expect(
    getAllByTestId('correct')
      .map((e) => e.textContent)
      .join('')
  ).toBe('w')
  expect(
    getAllByTestId('wrong')
      .map((e) => e.textContent)
      .join('')
  ).toBe('www')

  expect(asFragment()).toMatchSnapshot()
})

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

it('renders template character on wrong typing in typealong mode', () => {
  const props = {
    template: 'world',
    userInput: 'wwww',
    showCaret: true,
    mode: Mode.typealong,
  }

  const { asFragment, getAllByTestId } = render(<Word {...props} />, {})
  expect(
    getAllByTestId('correct')
      .map((e) => e.textContent)
      .join('')
  ).toBe('w')
  expect(
    getAllByTestId('wrong')
      .map((e) => e.textContent)
      .join('')
  ).toBe('orl')
  expect(
    getAllByTestId('pending')
      .map((e) => e.textContent)
      .join('')
  ).toBe('d')

  expect(asFragment()).toMatchSnapshot()
})

it('renders template character on wrong typing in typealong mode', () => {
  const props = {
    template: 'world',
    userInput: 'wwwwwxx',
    showCaret: true,
    mode: Mode.typealong,
  }

  const { asFragment, getAllByTestId } = render(<Word {...props} />, {})
  expect(
    getAllByTestId('correct')
      .map((e) => e.textContent)
      .join('')
  ).toBe('w')
  expect(
    getAllByTestId('wrong')
      .map((e) => e.textContent)
      .join('')
  ).toBe('orldxx')

  expect(asFragment()).toMatchSnapshot()
})
