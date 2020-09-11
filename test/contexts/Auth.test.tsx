import { AuthContext, AuthProvider, reducer, Action } from '@/contexts/Auth'
import { render } from '../testUtils'
import firebase from 'firebase'
import { auth } from '../../config/firebase'
jest.mock('../../config/firebase')

const mockOnAuthStateChanged = auth.onAuthStateChanged as jest.Mock

mockOnAuthStateChanged
  .mockImplementation((callback) => callback({ email: 'foo@bar.com' }))
  .mockReturnValue(() => {
    return 'Unsubscribed'
  })

afterEach(() => {
  mockOnAuthStateChanged.mockClear()
})

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
    <AuthContext.Consumer>
      {({ state: { user } }) => {
        expect(user.email).toBe('foo@bar.com')
        return <></>
      }}
    </AuthContext.Consumer>,
    { providerProps }
  )
})
