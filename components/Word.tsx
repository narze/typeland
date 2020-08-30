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
  pending: tw`
    text-gray-300
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
  word: tw`
    break-normal
  `,
}

export enum Mode {
  typealong = 'typealong',
}

export interface WordProps {
  template: string
  userInput: string
  showCaret: boolean
  mode?: Mode
}

export const Word: React.FC<WordProps> = ({
  template,
  userInput,
  showCaret,
  mode,
}) => {
  return (
    <span css={s.word}>
      {showCaret && userInput.length == 0 ? (
        <span css={s.caret} data-testid="caret"></span>
      ) : null}

      {Array.from(
        Array(Math.max(template.length, userInput.length)).keys()
      ).map((i) => {
        const templateChar = template[i]
        const userInputChar = userInput[i]
        const displayChar = userInputChar || templateChar

        let charElement
        if (templateChar && userInputChar) {
          charElement =
            templateChar == userInputChar ? (
              <span css={s.correct} className="correct" data-testid="correct">
                {displayChar}
              </span>
            ) : (
              <span css={s.wrong} className="wrong" data-testid="wrong">
                {displayChar}
              </span>
            )
        } else if (userInputChar) {
          charElement = (
            <span css={s.wrong} className="wrong" data-testid="wrong">
              {displayChar}
            </span>
          )
        } else if (mode == Mode.typealong) {
          charElement = (
            <span css={s.pending} className="pending" data-testid="pending">
              {displayChar}
            </span>
          )
        }

        return (
          <React.Fragment key={i}>
            {charElement}
            {showCaret && userInput.length && userInput.length == i + 1 ? (
              <span css={s.caret} data-testid="caret"></span>
            ) : null}
          </React.Fragment>
        )
      })}
    </span>
  )
}
