import React from 'react'
import { render, fireEvent } from '../testUtils'
import { Login } from '../../pages/login'
import { AuthContext } from '@/contexts/Auth'

const providerValue = {
  dispatch: jest.fn(),
  state: {
    user: null,
  },
}

afterEach(() => {
  providerValue.dispatch.mockClear()
})

const renderWithAuthProvider = (
  ui,
  { providerProps = { value: providerValue }, ...renderOptions } = {}
) => {
  return render(
    <AuthContext.Provider {...providerProps}>{ui}</AuthContext.Provider>,
    renderOptions
  )
}

describe('Login page', () => {
  it('renders sign up form', () => {
    const { asFragment, getByText } = renderWithAuthProvider(<Login />, {})
    getByText(/Sign Up/i)

    expect(asFragment()).toMatchSnapshot()
  })

  describe('when clicking Sign up', () => {
    it('renders user email', () => {
      const { asFragment, getByRole } = renderWithAuthProvider(<Login />, {})
      getByRole('button', { name: /Sign Up/i })

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when user is set in state (already logged in)', () => {
    it('renders user email', () => {
      const user = {
        email: 'foo@bar.com',
      }
      const providerProps = { value: { ...providerValue, state: { user } } }
      const { asFragment, getByText } = renderWithAuthProvider(<Login />, {
        providerProps,
      })
      fireEvent.click(getByText(new RegExp(user.email, 'i')))

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
