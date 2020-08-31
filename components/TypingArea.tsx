/** @jsx jsx */
import { jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'
import { Word } from './Word'
import React, { useEffect } from 'react'

const s = {
  typingArea: tw`
    text-xl
    antialiased
  `,
  template: tw`
    my-1
    break-words
  `,
  user: tw`
    my-1
    break-words
  `,
}

export enum Mode {
  typealong = 'typealong',
}

export interface TypingAreaProps {
  words: Array<string>
  userWords: Array<string>
  showCaret: boolean
  mode?: Mode
  onStatsUpdate?: (stats: { correct: number }) => void
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  words,
  userWords,
  showCaret,
  mode,
  onStatsUpdate,
}) => {
  useEffect(() => {
    if (onStatsUpdate) {
      const stats = {
        correct: 0,
        wrong: 0,
      }

      // TODO: Optimize so that userWords are not iterate every time
      userWords.forEach((text, i) => {
        if (text == words[i]) {
          stats.correct += 1
        } else {
          stats.wrong += 1
        }
      })

      onStatsUpdate(stats)
    }
  }, [userWords.length, (userWords[words.length - 1] || []).length])

  if (mode == 'typealong') {
    const remainingWords = words.slice(userWords.length)

    return (
      <div css={s.typingArea}>
        <span css={s.user} data-testid="user">
          {userWords.map((text, i) => {
            return (
              <React.Fragment key={i}>
                <Word
                  template={words[i]}
                  userInput={text}
                  showCaret={showCaret && i == userWords.length - 1}
                  mode={mode}
                />
                <span>&nbsp;</span>
              </React.Fragment>
            )
          })}
        </span>
        <span css={s.template} data-testid="template">
          {remainingWords.join(' ')}
        </span>
      </div>
    )
  }

  return (
    <div css={s.typingArea}>
      <p css={s.template} data-testid="template">
        {words.join(' ')}
      </p>
      <p css={s.user} data-testid="user">
        {userWords.map((text, i) => {
          return (
            <React.Fragment key={i}>
              <Word
                template={words[i]}
                userInput={text}
                showCaret={showCaret && i == userWords.length - 1}
              />
              <span>&nbsp;</span>
            </React.Fragment>
          )
        })}
      </p>
    </div>
  )
}
