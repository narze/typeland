import React, { useState } from 'react'

interface StatsContextProps {
  correct: number
  wrong: number
  total: number
  incrementCorrect: () => void
  incrementWrong: () => void
  reset: () => void
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

export const StatsContext = React.createContext({} as StatsContextProps)

export const StatsProvider: React.FC<StatsProviderProps> = ({
  children,
  value,
}) => {
  const [stats, setStats] = useState(value || defaultStats)

  const functions = {
    incrementCorrect: () => {
      setStats((prevStats) => {
        const { correct, total } = prevStats
        return { ...prevStats, correct: correct + 1, total: total + 1 }
      })
    },
    incrementWrong: () => {
      setStats((prevStats) => {
        const { wrong, total } = prevStats
        return { ...prevStats, wrong: wrong + 1, total: total + 1 }
      })
    },
    reset: () => {
      setStats(defaultStats)
    },
  }

  return (
    <StatsContext.Provider value={{ ...stats, ...functions }}>
      {children}
    </StatsContext.Provider>
  )
}
