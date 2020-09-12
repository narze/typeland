import {
  AuthStateConsumer,
  AuthProvider,
  reducer,
  Action,
} from '@/contexts/Auth'
import { render } from '../testUtils'
import firebase from 'firebase'

describe('reducer', () => {
  it('setUser sets user', () => {
    const state = {
      user: null,
    }

    const action: Action = {
      type: 'setUser',
      user: { email: 'foo@bar.com' } as firebase.User,
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
  { providerProps = {}, ...renderOptions } = {}
) => {
  return render(
    <AuthProvider {...providerProps}>{ui}</AuthProvider>,
    renderOptions
  )
}

it('expose props', () => {
  const providerProps = {
    initialState: {
      user: { email: 'foo@bar.com' } as firebase.User,
    },
  }

  renderWithProvider(
    <AuthStateConsumer>
      {({ user }) => {
        expect(user.email).toBe('foo@bar.com')
        return <></>
      }}
    </AuthStateConsumer>,
    { providerProps }
  )
})

it('handles login with correct credentials', () => {
  pending()
})

it('handles login with incorrect credentials', () => {
  pending()
})

it('handles sign up with correct credentials', () => {
  pending()
})

it('handles sign up with existing email', () => {
  pending()
})
