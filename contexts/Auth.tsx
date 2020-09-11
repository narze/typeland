import React, { useEffect, useReducer } from 'react'
import { auth as firebaseAuth } from '../config/firebase'
import firebase from 'firebase'

interface AuthState {
  user: firebase.User | null
}

interface AuthContextProps {
  state: AuthState
  dispatch: React.Dispatch<any>
}

interface AuthProviderProps {
  children: React.ReactNode
  value?: AuthContextProps
}

const defaultAuth: AuthState = {
  user: null,
}

type Action = { type: 'setUser'; user: firebase.User } | { type: 'unsetUser' }

export const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'setUser':
      return {
        ...state,
        user: action.user,
      }
    case 'unsetUser':
      return {
        ...state,
        user: null,
      }
    default:
      return state
  }
}

export const AuthContext = React.createContext({} as AuthContextProps)

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  value,
}) => {
  const [state, dispatch] = useReducer(reducer, value.state || defaultAuth)

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //The user is logged in
        dispatch({
          type: 'setUser',
          user: authUser,
        })
      } else {
        //The user is logged out
        dispatch({
          type: 'unsetUser',
        })
      }
    })
    return () => {
      // Any clean up operation goes in here
      unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
