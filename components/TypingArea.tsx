/** @jsx jsx */
import { jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'
import { Word } from './Word'
import React, { useEffect } from 'react'
import { useStats } from '../contexts/Stats'

const s = {
  typingArea: tw`
    text-xl
    antialiased
  `,
  wordWrapper: tw`
    my-1
    flex flex-wrap
    w-full
  `,
  word: tw`
    mr-1
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
    const [stats, dispatch] = useStats()

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

      if (finished) {
        dispatch({ type: 'SUBMIT_STATS' })
      }
    }, [userWords.length, finished])

    const remainingWords = words.slice(userWords.length)

    return (
      <div css={s.typingArea} data-testid="text">
        <div css={s.wordWrapper}>
          {userWords.map((text, i) => {
            return (
              <React.Fragment key={i}>
                <Word
                  template={words[i]}
                  userInput={text}
                  showCaret={showCaret && i == userWords.length - 1}
                />
              </React.Fragment>
            )
          })}

          {remainingWords.map((text, i) => {
            return (
              <React.Fragment key={i}>
                <span css={s.word} data-testid="remainingWord">
                  {text}
                </span>
              </React.Fragment>
            )
          })}
        </div>
      </div>
    )
  }
)
