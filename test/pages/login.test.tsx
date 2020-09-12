import React from 'react'
import { render } from '../testUtils'
import { Login } from '@/pages/login'
import { AuthProvider } from '@/contexts/Auth'

const mockRouterPush = jest.fn()

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: mockRouterPush,
    }
  },
}))

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
    it('redirects to home page', () => {
      const user = { email: 'foo@bar.com' }
      const providerProps = { initialState: { user } }

      const { asFragment } = renderWithAuthProvider(<Login />, {
        providerProps,
      })

      expect(mockRouterPush).toBeCalledTimes(1)
      expect(mockRouterPush).toBeCalledWith('/')

      expect(asFragment()).toMatchSnapshot()

      mockRouterPush.mockClear()
    })
  })
})
