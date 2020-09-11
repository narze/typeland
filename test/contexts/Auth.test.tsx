import { reducer, Action } from '@/contexts/Auth'
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
