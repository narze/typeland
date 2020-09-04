import React, { useReducer } from 'react'

interface StatsContextProps {
  stats: {
    correct: number
    wrong: number
    total: number
  }
  dispatch: React.Dispatch<any>
}

interface StatsProviderProps {
  children: React.ReactNode
  value?: StatsContextProps
}

const defaultStats = {
  correct: 0,
  wrong: 0,
  total: 0,
}

const reducer = (state, action) => {
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

export const StatsProvider: React.FC<StatsProviderProps> = ({
  children,
  value,
}) => {
  const [stats, dispatch] = useReducer(reducer, value || defaultStats)

  return (
    <StatsContext.Provider value={{ stats, dispatch }}>
      {children}
    </StatsContext.Provider>
  )
}
