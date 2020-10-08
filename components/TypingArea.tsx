/** @jsx jsx */
import { jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'
import { Word } from './Word'
import React, { useEffect, useState } from 'react'
import { useStats } from '@/contexts/Stats'
import { useAuth } from '@/contexts/Auth'

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
    const [submitted, setSubmitted] = useState(false)
    const [stats, dispatch] = useStats()
    const [auth] = useAuth()

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

      if (userWords.length <= 1) {
        setSubmitted(false)
      }

      if (finished && !submitted) {
        setSubmitted(true)

        if (auth.user) {
          setTimeout(() => {
            dispatch({ type: 'SUBMIT_STATS', payload: { uid: auth.user.uid } })
          }, 200) // TODO: Delay submission for correct stats
        }
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
