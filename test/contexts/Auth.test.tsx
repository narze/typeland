import {
  AuthStateConsumer,
  AuthProvider,
  reducer,
  Action,
} from '@/contexts/Auth'
import { render } from '../testUtils'
import type { User } from 'firebase/auth'

describe('reducer', () => {
  it('setUser sets user', () => {
    const state = {
      user: null,
    }

    const action: Action = {
      type: 'setUser',
      user: { email: 'foo@bar.com' } as unknown as User,
    }

    expect(reducer(state, action)).toEqual({ user: { email: 'foo@bar.com' } })
  })

  it('unsetUser sets user to null', () => {
    const state = {
      user: null,
    }

    const action: Action = {
      type: 'unsetUser',
    }

    expect(reducer(state, action)).toEqual({ user: null })
  })
})

const renderWithProvider = (
  ui,
  { providerProps = {}, ...renderOptions } = {},
) => {
  return render(
    <AuthProvider {...providerProps}>{ui}</AuthProvider>,
    renderOptions,
  )
}

it('expose props', () => {
  const providerProps = {
    initialState: {
      user: { email: 'foo@bar.com' } as unknown as User,
    },
  }

  renderWithProvider(
    <AuthStateConsumer>
      {({ user }) => {
        expect(user.email).toBe('foo@bar.com')
        return <></>
      }}
    </AuthStateConsumer>,
    { providerProps },
  )
})

it.todo('handles login with correct credentials')

it.todo('handles login with incorrect credentials')

it.todo('handles sign up with correct credentials')

it.todo('handles sign up with existing email')
