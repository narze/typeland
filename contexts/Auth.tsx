import React, { useContext, useEffect, useReducer } from 'react'
import { auth as firebaseAuth } from '../config/firebase'
import firebase from 'firebase'

interface State {
  user: firebase.User | null
}

type Dispatch = React.Dispatch<Action>

interface AuthProviderProps {
  children: React.ReactNode
  initialState?: State
}

const defaultState: State = {
  user: null,
}

export type Action =
  | { type: 'setUser'; user: firebase.User }
  | { type: 'unsetUser' }

const reducer = (state: State, action: Action): State => {
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

const AuthStateContext = React.createContext<State | undefined>(undefined)
const AuthDispatchContext = React.createContext<Dispatch | undefined>(undefined)

AuthStateContext.displayName = 'Auth'

const AuthStateConsumer = AuthStateContext.Consumer

function useAuthState(): State {
  const context = useContext(AuthStateContext)
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider')
  }
  return context
}

function useAuthDispatch(): Dispatch {
  const context = useContext(AuthDispatchContext)
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider')
  }
  return context
}

function useAuth(): [State, Dispatch] {
  return [useAuthState(), useAuthDispatch()]
}

const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  initialState = defaultState,
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
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

export {
  reducer,
  AuthProvider,
  AuthStateConsumer,
  useAuth,
  useAuthDispatch,
  useAuthState,
}
