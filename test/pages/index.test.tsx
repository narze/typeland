import React from 'react'
import { render } from '../testUtils'
import { Home } from '../../pages/index'

describe('Home page', () => {
  it('renders title', () => {
    const { asFragment, getByText } = render(<Home />, {})
    getByText(/Typeland/i)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders text to type', () => {
    const { getByText } = render(<Home />, {})

    getByText(/The quick brown fox jumps over the lazy dog/i)
  })
})
