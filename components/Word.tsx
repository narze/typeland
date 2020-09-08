/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'
import React, { useRef, useEffect, useState } from 'react'

const s = {
  word: tw`
    relative
    break-normal
  `,
  correct: tw`
    text-green-600
  `,
  wrong: tw`
    text-red-400
  `,
  pending: tw`
    text-gray-300
  `,
  caret: [
    tw`
      absolute
      h-6
      bg-blue-500
    `,
    css`
      transition: all 0.1s ease-out;
      width: 2px;
      margin-left: -1px;
      margin-right: -1px;
    `,
  ],
}

export interface WordProps {
  template: string
  userInput: string
  showCaret: boolean
}

export const Word: React.FC<WordProps> = React.memo(
  ({ template, userInput, showCaret }) => {
    const lastInputEl = useRef(null)
    const [caretPos, setCaretPos] = useState({
      left: 0,
      top: 0,
    })

    const caretPosCss = () => {
      return css`
        left: ${caretPos.left + 1}px;
        top: ${caretPos.top}px;
      `
    }

    useEffect(() => {
      if (!lastInputEl.current) {
        setCaretPos({
          left: 0,
          top: 0,
        })
        return
      }

      setCaretPos({
        left: lastInputEl.current.offsetLeft + lastInputEl.current.offsetWidth,
        top: lastInputEl.current.offsetTop,
      })
    }, [userInput.length])

    return (
      <span css={s.word}>
        {showCaret && (
          <span css={[s.caret, caretPosCss()]} data-testid="caret"></span>
        )}

        {Array.from(
          Array(Math.max(template.length, userInput.length)).keys()
        ).map((i) => {
          const ref = i == userInput.length - 1 ? lastInputEl : null
          const templateChar = template[i]
          const userInputChar = userInput[i]

          let charElement
          if (templateChar && userInputChar) {
            charElement =
              templateChar == userInputChar ? (
                <span
                  css={s.correct}
                  className="correct"
                  data-testid="correct"
                  ref={ref}
                >
                  {templateChar}
                </span>
              ) : (
                <span
                  css={s.wrong}
                  className="wrong"
                  data-testid="wrong"
                  ref={ref}
                >
                  {templateChar}
                </span>
              )
          } else if (userInputChar) {
            charElement = (
              <span
                css={s.wrong}
                className="wrong"
                data-testid="wrong"
                ref={ref}
              >
                {userInputChar}
              </span>
            )
          } else {
            charElement = (
              <span
                css={s.pending}
                className="pending"
                data-testid="pending"
                ref={ref}
              >
                {templateChar}
              </span>
            )
          }

          return <React.Fragment key={i}>{charElement}</React.Fragment>
        })}
      </span>
    )
  }
)
