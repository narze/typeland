import React from 'react'
import { render, fireEvent } from '../testUtils'
import userEvent from '@testing-library/user-event'
import { Home } from '../../pages/index'

describe('Home page', () => {
  it('renders title', () => {
    const { asFragment, getByText } = render(<Home />, {})
    getByText(/Typeland/i)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders text to type', () => {
    const { getByText } = render(<Home />, {})

    getByText(/the quick brown fox jumps over the lazy dog/i)
  })

  it('highlights text which is typed', () => {
    const { asFragment, getByTestId, getAllByTestId } = render(<Home />, {})

    const typingInput = getByTestId('typingInput')

    fireEvent.keyDown(typingInput, { key: 't' })
    expect(getByTestId('correct')).toHaveTextContent('t')

    fireEvent.keyDown(typingInput, { key: 'h' })
    expect(getAllByTestId('correct')[0]).toHaveTextContent('t')
    expect(getAllByTestId('correct')[1]).toHaveTextContent('h')

    fireEvent.keyDown(typingInput, { key: 'x' })

    expect(getAllByTestId('correct')[0]).toHaveTextContent('t')
    expect(getAllByTestId('correct')[1]).toHaveTextContent('h')
    expect(getByTestId('wrong')).toHaveTextContent('x')

    expect(asFragment()).toMatchSnapshot()
  })

  it('can delete typed text with backspace', () => {
    const { asFragment, getByTestId, getAllByTestId, queryByTestId } = render(
      <Home />,
      {}
    )

    const typingInput = getByTestId('typingInput')

    fireEvent.keyDown(typingInput, { key: 't' })
    expect(getByTestId('correct')).toHaveTextContent('t')

    fireEvent.keyDown(typingInput, { key: 'h' })
    expect(getAllByTestId('correct')[0]).toHaveTextContent('t')
    expect(getAllByTestId('correct')[1]).toHaveTextContent('h')

    userEvent.type(typingInput, '{backspace}')
    expect(getByTestId('correct')).toHaveTextContent('t')

    fireEvent.keyDown(typingInput, { key: 'o' })
    expect(getByTestId('correct')).toHaveTextContent('t')
    expect(getByTestId('wrong')).toHaveTextContent('o')

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
})
