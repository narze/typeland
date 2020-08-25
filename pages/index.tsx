/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'
import React, { useState } from 'react'

const s = {
  container: tw`
    h-screen min-w-full
    flex
    items-center justify-center
  `,
  title: tw`
    text-4xl
    text-blue-600
  `,
  typingArea: tw`
    text-lg
  `,
  typingInput: tw`
    h-0
    w-0
  `,
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
  footer: tw`
    fixed
    bottom-0
    pb-8
    text-center
  `,
  githubLink: tw`
    text-sm
  `,
}

const Word = ({
  template,
  userInput,
  showCaret,
}: {
  template: string
  userInput: string
  showCaret: boolean
}): JSX.Element => {
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

const TypingArea = ({
  words,
  userWords,
  showCaret,
}: {
  words: Array<string>
  userWords: Array<string>
  showCaret: boolean
}): JSX.Element => {
  return (
    <p css={s.typingArea}>
      {words.join(' ')}
      <br />
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
  )
}

export const Home = (): JSX.Element => {
  const words: Array<string> = 'the quick brown fox jumps over the lazy dog'.split(
    ' '
  )
  const [userTypeInput, setUserTypeInput] = useState([''])
  const [inputIsFocused, setInputIsFocused] = useState(true)

  const handleDelete = ({ word = false }) => {
    const newUserTypeInput = [...userTypeInput]

    if (word) {
      newUserTypeInput[newUserTypeInput.length - 1] = ''
    } else {
      newUserTypeInput[newUserTypeInput.length - 1] = newUserTypeInput[
        newUserTypeInput.length - 1
      ].slice(0, -1)
    }

    setUserTypeInput(newUserTypeInput)
  }

  const handleSpace = () => {
    if (!userTypeInput[userTypeInput.length - 1].length) {
      return
    }
    if (userTypeInput.length == words.length) {
      return
    }

    const newUserTypeInput = [...userTypeInput]

    newUserTypeInput[newUserTypeInput.length] = ''

    setUserTypeInput(newUserTypeInput)
  }

  const handleType = (e) => {
    const { key, altKey, ctrlKey, metaKey } = e

    if (key == 'Backspace') {
      return handleDelete({ word: altKey || ctrlKey || metaKey })
    }

    if (key == ' ') {
      return handleSpace()
    }

    // Filter out modifiers
    if (key.length != 1 || altKey || ctrlKey || metaKey) {
      return
    }

    const newUserTypeInput = [...userTypeInput]
    newUserTypeInput[newUserTypeInput.length - 1] = newUserTypeInput[
      newUserTypeInput.length - 1
    ].concat(key)
    setUserTypeInput(newUserTypeInput)
  }

  return (
    <div
      css={s.container}
      onClick={() => document.getElementById('typingInput').focus()}
    >
      <main>
        <h1 css={s.title}>Typeland</h1>

        <TypingArea
          words={words}
          userWords={userTypeInput}
          showCaret={inputIsFocused}
        />

        <input
          id="typingInput"
          data-testid="typingInput"
          css={s.typingInput}
          type="text"
          ref={(i) => i && i.focus()} // Autofocus
          onKeyDown={handleType}
          onBlur={() => {
            setInputIsFocused(false)
          }}
          onFocus={() => {
            setInputIsFocused(true)
          }}
          tabIndex={0}
        />
      </main>

      <div css={s.footer}>
        <a
          css={s.githubLink}
          href="https://github.com/narze/typeland"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}

export default Home
