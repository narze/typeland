import React, { useEffect, useReducer } from 'react'
import { auth as firebaseAuth } from '../config/firebase'
import firebase from 'firebase'

interface AuthContextProps {
  state: {
    user: firebase.User | null
  }
  dispatch: React.Dispatch<any>
}

interface AuthProviderProps {
  children: React.ReactNode
  value?: AuthContextProps
}

const defaultAuth = {
  user: null,
}

const reducer = (state, action) => {
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
  const [state, dispatch] = useReducer(reducer, value || defaultAuth)

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
          type: 'uesetUser',
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
