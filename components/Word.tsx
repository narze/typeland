/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'
import React from 'react'

const s = {
  correct: tw`
    text-green-600
  `,
  wrong: tw`
    text-red-400
  `,
  caret: [
    tw`
      h-4
      border border-blue-500
    `,
    css`
      width: 1px;
    `,
  ],
}

export interface WordProps {
  template: string
  userInput: string
  showCaret: boolean
}

export const Word: React.FC<WordProps> = ({
  template,
  userInput,
  showCaret,
}) => {
  return (
    <span>
      {showCaret && userInput.length == 0 ? (
        <span css={s.caret} data-testid="caret"></span>
      ) : null}

      {Array.from(
        Array(Math.min(template.length, userInput.length)).keys()
      ).map((i) => {
        const templateChar = template[i]
        const userInputChar = userInput[i]
        const displayChar = userInputChar || templateChar

        return (
          <React.Fragment key={i}>
            {templateChar == userInputChar ? (
              <span css={s.correct} className="correct" data-testid="correct">
                {displayChar}
              </span>
            ) : (
              <span css={s.wrong} className="wrong" data-testid="wrong">
                {displayChar}
              </span>
            )}
          </React.Fragment>
        )
      })}

      {showCaret && userInput.length != 0 ? (
        <span css={s.caret} data-testid="caret"></span>
      ) : null}
    </span>
  )
}
