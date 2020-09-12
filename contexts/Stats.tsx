import React, { useContext, useReducer } from 'react'

interface State {
  correct: number
  wrong: number
  total: number
}

type Dispatch = React.Dispatch<Action>

interface StatsProviderProps {
  children: React.ReactNode
  initialState?: State
}

export type Action =
  | { type: 'incrementCorrect' }
  | { type: 'incrementWrong' }
  | { type: 'reset' }

const defaultState: State = {
  correct: 0,
  wrong: 0,
  total: 0,
}

function reducer(state: State, action: Action): State {
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
      return { ...defaultState }
    default:
      throw new Error(`Unhandled action type}`)
  }
}

const StatsStateContext = React.createContext<State | undefined>(undefined)
const StatsDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
)

StatsStateContext.displayName = 'Stats'

const StatsStateConsumer = StatsStateContext.Consumer

function useStatsState(): State {
  const context = useContext(StatsStateContext)
  if (context === undefined) {
    throw new Error('useStatsState must be used within a StatsProvider')
  }
  return context
}

function useStatsDispatch(): Dispatch {
  const context = useContext(StatsDispatchContext)
  if (context === undefined) {
    throw new Error('useStatsDispatch must be used within a StatsProvider')
  }
  return context
}

function useStats(): [State, Dispatch] {
  return [useStatsState(), useStatsDispatch()]
}

const StatsProvider: React.FC<StatsProviderProps> = ({
  children,
  initialState = defaultState,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StatsStateContext.Provider value={state}>
      <StatsDispatchContext.Provider value={dispatch}>
        {children}
      </StatsDispatchContext.Provider>
    </StatsStateContext.Provider>
  )
}

export {
  reducer,
  StatsProvider,
  StatsStateConsumer,
  useStats,
  useStatsDispatch,
  useStatsState,
}
