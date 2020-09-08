/** @jsx jsx */
import { jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'
import { Word } from './Word'
import React, { useContext, useEffect } from 'react'
import { StatsContext } from '../contexts/Stats'

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

export interface TypingAreaProps {
  words: Array<string>
  userWords: Array<string>
  showCaret: boolean
  finished?: boolean
}

export const TypingArea: React.FC<TypingAreaProps> = React.memo(
  ({ words, userWords, showCaret, finished }) => {
    const { stats, dispatch } = useContext(StatsContext)

    useEffect(() => {
      const offset = stats.total

      userWords.slice(offset).forEach((text, i) => {
        if (text == '') {
          return
        }

        if (text == words[offset + i]) {
          dispatch({ type: 'incrementCorrect' })
        } else {
          dispatch({ type: 'incrementWrong' })
        }
      })
    }, [userWords.length, finished])

    const remainingWords = words.slice(userWords.length)

    return (
      <div css={s.typingArea} data-testid="text">
        <span css={s.user} data-testid="user">
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
        </span>
        <span css={s.template} data-testid="template">
          {remainingWords.join(' ')}
        </span>
      </div>
    )
  }
)
