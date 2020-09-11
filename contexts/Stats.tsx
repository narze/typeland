import React, { useContext, useReducer } from 'react'

interface StatsState {
  correct: number
  wrong: number
  total: number
}

interface StatsContextProps {
  state: StatsState
  dispatch: React.Dispatch<any>
}

interface StatsProviderProps {
  children: React.ReactNode
  initialState?: StatsState
}

const defaultStats: StatsState = {
  correct: 0,
  wrong: 0,
  total: 0,
}

export type Action =
  | { type: 'incrementCorrect' }
  | { type: 'incrementWrong' }
  | { type: 'reset' }

export const reducer = (state: StatsState, action: Action): StatsState => {
  switch (action.type) {
    case 'incrementCorrect':
      return {
        ...state,
        correct: state.correct + 1,
        total: state.total + 1,
      }
    case 'incrementWrong':
      return {
        ...state,
        wrong: state.wrong + 1,
        total: state.total + 1,
      }
    case 'reset':
      return { ...defaultStats }
    default:
      return state
  }
}

export const StatsContext = React.createContext({} as StatsContextProps)

StatsContext.displayName = 'Stats'

export const useStats = (): [StatsState, React.Dispatch<any>] => {
  const { state, dispatch } = useContext(StatsContext)

  return [state, dispatch]
}

export const StatsProvider: React.FC<StatsProviderProps> = ({
  children,
  initialState = defaultStats,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StatsContext.Provider value={{ state, dispatch }}>
      {children}
    </StatsContext.Provider>
  )
}
