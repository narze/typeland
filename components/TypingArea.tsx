/** @jsx jsx */
import { jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'
import { Word } from './Word'
import React from 'react'

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
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  words,
  userWords,
  showCaret,
  mode,
}) => {
  if (mode == 'typealong') {
    const remainingWords = words.slice(userWords.length)

    return (
      <div css={s.typingArea}>
        <span data-testid="user">
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
        <span data-testid="template">{remainingWords.join(' ')}</span>
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
