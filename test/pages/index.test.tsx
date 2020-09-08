import React from 'react'
import { render, fireEvent } from '../testUtils'
import userEvent from '@testing-library/user-event'
import { Home } from '../../pages/index'
import { randomWords } from '../../utils/wordsDb'
import { StatsContext } from '@/contexts/Stats'

jest.mock('../../utils/wordsDb')

const mockedRandomWords = randomWords as jest.Mock<Array<string>>

const providerValue = {
  dispatch: jest.fn(),
  stats: {
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

beforeEach(() => {
  jest.clearAllMocks()
  mockedRandomWords.mockImplementationOnce((_length) =>
    'the quick brown fox jumps over the lazy dog'.split(' ')
  )
})

describe('Home page', () => {
  it('renders title', () => {
    const { asFragment, getByText } = renderWithProvider(<Home />, {})
    getByText(/Typeland/i)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders text to type', () => {
    const { getAllByTestId } = renderWithProvider(<Home />, {})

    expect(getAllByTestId('word').map((e) => e.textContent)).toEqual(['the'])

    expect(getAllByTestId('remainingWord').map((e) => e.textContent)).toEqual([
      'quick',
      'brown',
      'fox',
      'jumps',
      'over',
      'the',
      'lazy',
      'dog',
    ])
  })

  it('highlights text which is typed', () => {
    const { asFragment, getByTestId, getAllByTestId } = renderWithProvider(
      <Home />,
      {}
    )

    const typingInput = getByTestId('typingInput')

    fireEvent.keyDown(typingInput, { key: 't' })
    expect(getByTestId('correct')).toHaveTextContent('t')

    fireEvent.keyDown(typingInput, { key: 'h' })
    expect(getAllByTestId('correct')[0]).toHaveTextContent('t')
    expect(getAllByTestId('correct')[1]).toHaveTextContent('h')

    fireEvent.keyDown(typingInput, { key: 'x' })

    expect(getAllByTestId('correct')[0]).toHaveTextContent('t')
    expect(getAllByTestId('correct')[1]).toHaveTextContent('h')
    expect(getByTestId('wrong')).toHaveTextContent('e')

    expect(asFragment()).toMatchSnapshot()
  })

  it('can delete typed text with backspace', () => {
    const {
      asFragment,
      getByTestId,
      getAllByTestId,
      queryByTestId,
    } = renderWithProvider(<Home />, {})

    const typingInput = getByTestId('typingInput')

    fireEvent.keyDown(typingInput, { key: 't' })
    expect(getByTestId('correct')).toHaveTextContent('t')

    fireEvent.keyDown(typingInput, { key: 'h' })
    expect(getAllByTestId('correct')[0]).toHaveTextContent('t')
    expect(getAllByTestId('correct')[1]).toHaveTextContent('h')

    userEvent.type(typingInput, '{backspace}')
    expect(getByTestId('correct')).toHaveTextContent('t')

    fireEvent.keyDown(typingInput, { key: 'x' })
    expect(getByTestId('correct')).toHaveTextContent('t')
    expect(getByTestId('wrong')).toHaveTextContent('h')

    userEvent.type(typingInput, '{backspace}')
    expect(getByTestId('correct')).toHaveTextContent('t')
    expect(queryByTestId('wrong')).not.toBeInTheDocument()

    fireEvent.keyDown(typingInput, { key: 'h' })
    expect(getAllByTestId('correct')[0]).toHaveTextContent('t')
    expect(getAllByTestId('correct')[1]).toHaveTextContent('h')
    expect(queryByTestId('wrong')).not.toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })

  it('can delete whole incomplete word with option/ctrl/meta backspace', () => {
    pending()
  })

  it('blocks all modifiers except shift', () => {
    pending()
  })

  it('shows wpm when finished typing', () => {
    pending()
  })

  it('shows live wpm while typing', () => {
    pending()
  })
})
