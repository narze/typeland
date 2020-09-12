import React from 'react'
import { render, fireEvent } from '../testUtils'
import { mockFirebaseAuth } from '../mockFirebase'
import { Login } from '@/pages/login'
import { AuthProvider } from '@/contexts/Auth'

mockFirebaseAuth()

const renderWithAuthProvider = (
  ui,
  { providerProps = {}, ...renderOptions } = {}
) => {
  return render(
    <AuthProvider {...providerProps}>{ui}</AuthProvider>,
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
      const user = { email: 'foo@bar.com' }
      const providerProps = { initialState: { user } }

      const { asFragment, getByText } = renderWithAuthProvider(<Login />, {
        providerProps,
      })

      fireEvent.click(getByText(new RegExp(user.email, 'i')))

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
