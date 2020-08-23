import React from 'react'
import { render, fireEvent } from '../testUtils'
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
    const { getByTestId } = render(<Home />, {})

    const typingInput = getByTestId('typingInput')

    fireEvent.keyDown(typingInput, { key: 't' })
    expect(getByTestId('correct')).toHaveTextContent('t')

    fireEvent.keyDown(typingInput, { key: 'h' })
    expect(getByTestId('correct')).toHaveTextContent('th')

    fireEvent.keyDown(typingInput, { key: 'x' })
    expect(getByTestId('correct')).toHaveTextContent('th')
    expect(getByTestId('wrong')).toHaveTextContent('x')
  })
})
