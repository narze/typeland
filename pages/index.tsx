/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'
import { useState } from 'react'

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
}

const TypingArea = ({ text, userText, showCaret }): JSX.Element => {
  return (
    <p css={s.typingArea}>
      {text}
      <br />
      {userText.map((text, i) => {
        return i % 2 == 0 ? (
          <span
            css={s.correct}
            key={i}
            className="correct"
            data-testid="correct"
          >
            {text}
          </span>
        ) : (
          <span css={s.wrong} key={i} className="wrong" data-testid="wrong">
            {text}
          </span>
        )
      })}
      {showCaret ? <span css={s.caret} data-testid="caret"></span> : null}
    </p>
  )
}

export const Home = (): JSX.Element => {
  const textToType = 'the quick brown fox jumps over the lazy dog'
  const [userTypeInput, setUserTypeInput] = useState([''])
  const [inputIsFocused, setInputIsFocused] = useState(true)

  const handleDelete = () => {
    let newUserTypeInput = [...userTypeInput]

    newUserTypeInput[newUserTypeInput.length - 1] = newUserTypeInput[
      newUserTypeInput.length - 1
    ].slice(0, -1)

    if (
      newUserTypeInput[newUserTypeInput.length - 1].length == 0 &&
      userTypeInput.length > 1
    ) {
      newUserTypeInput = newUserTypeInput.slice(0, -1)
    }

    setUserTypeInput(newUserTypeInput)
  }

  const handleType = (e) => {
    const { key, keyCode } = e

    if (keyCode == 8) {
      return handleDelete()
    }

    // Filter out modifiers
    if (key.length != 1) {
      return
    }

    const userTypeLength = userTypeInput.reduce((p, c) => p + c.length, 0)

    let newUserTypeInput = [...userTypeInput]

    if (textToType[userTypeLength] == key && newUserTypeInput.length % 2 == 0) {
      newUserTypeInput = newUserTypeInput.concat('')
    } else if (
      textToType[userTypeLength] != key &&
      newUserTypeInput.length % 2 == 1
    ) {
      newUserTypeInput = newUserTypeInput.concat('')
    }

    newUserTypeInput[newUserTypeInput.length - 1] = `${
      newUserTypeInput[newUserTypeInput.length - 1]
    }${key}`

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
          text={textToType}
          userText={userTypeInput}
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
    </div>
  )
}

export default Home
