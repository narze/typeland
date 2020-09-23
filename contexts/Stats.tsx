import React, { Reducer, useContext } from 'react'
import { useReducerAsync, AsyncActionHandlers } from 'use-reducer-async'
import { db } from '../config/firebase'

interface State {
  correct: number
  wrong: number
  total: number
  loading: boolean
}

type Dispatch = React.Dispatch<CallableAction>

interface StatsProviderProps {
  children: React.ReactNode
  initialState?: State
}

type InnerAction =
  | { type: 'START_SUBMIT_STATS' }
  | { type: 'FINISH_SUBMIT_STATS' }
  | { type: 'ERROR_SUBMIT_STATS' }

type OuterAction =
  | { type: 'incrementCorrect' }
  | { type: 'incrementWrong' }
  | { type: 'reset' }

type Action = InnerAction | OuterAction

type AsyncAction = { type: 'SUBMIT_STATS' }

export type CallableAction = OuterAction | AsyncAction

const defaultState: State = {
  correct: 0,
  wrong: 0,
  total: 0,
  loading: false,
}

const reducer: Reducer<State, Action> = (state, action) => {
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
    case 'START_SUBMIT_STATS':
      return {
        ...state,
        loading: true,
      }
    case 'FINISH_SUBMIT_STATS':
      return {
        ...state,
        loading: false,
      }
    case 'ERROR_SUBMIT_STATS':
      return {
        ...state,
        loading: false,
      }
    default:
      throw new Error('Unhandled action type')
  }
}

const asyncActionHandlers: AsyncActionHandlers<
  Reducer<State, Action>,
  AsyncAction
> = {
  SUBMIT_STATS: ({ dispatch, signal, getState }) => async (_action) => {
    dispatch({ type: 'START_SUBMIT_STATS' })

    try {
      const { correct, wrong, total } = getState()

      await db.collection('results').add({
        stats: { correct, wrong, total },
        timestamp: +new Date(),
        user: 'todo',
      })
      if (!signal.aborted) dispatch({ type: 'FINISH_SUBMIT_STATS' })
    } catch (e) {
      if (!signal.aborted) dispatch({ type: 'ERROR_SUBMIT_STATS' })
    }
  },
}

export const StatsStateContext = React.createContext<State | undefined>(
  undefined
)
export const StatsDispatchContext = React.createContext<Dispatch | undefined>(
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
  const [state, dispatch] = useReducerAsync<
    Reducer<State, Action>,
    AsyncAction,
    CallableAction
  >(reducer, initialState, asyncActionHandlers)

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
