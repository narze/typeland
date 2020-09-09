import React from 'react'
import { render } from '../testUtils'
import { Login } from '../../pages/login'

describe('Login page', () => {
  it('renders sign up form', () => {
    const { asFragment, getByText } = render(<Login />, {})
    getByText(/Sign Up/i)

    expect(asFragment()).toMatchSnapshot()
  })
})
