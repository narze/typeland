import React from 'react'

const stats = {
  correct: 0,
  wrong: 0,
  total: 0,
}

export const StatContext = React.createContext(stats)
