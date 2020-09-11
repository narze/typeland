import React, { useContext, useEffect, useReducer } from 'react'
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
  initialState?: AuthState
}

const defaultAuth: AuthState = {
  user: null,
}

export type Action =
  | { type: 'setUser'; user: firebase.User }
  | { type: 'unsetUser' }

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

AuthContext.displayName = 'Auth'

export const useAuth = (): [AuthState, React.Dispatch<any>] => {
  const { state, dispatch } = useContext(AuthContext)

  return [state, dispatch]
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  initialState = defaultAuth,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

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
