/** @jsx jsx */
import { jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'
import { useEffect, useState } from 'react'
import { TypingArea } from '../components/TypingArea'
import { randomWords } from '../utils/wordsDb'

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
  typingInput: tw`
    h-0
    w-0
  `,
  footer: tw`
    fixed
    bottom-0
    pb-8
    text-center
  `,
  githubLink: tw`
    text-sm
  `,
  result: tw`
    mt-4
    text-center
    text-xl
  `,
}

export const Home = (): JSX.Element => {
  const [words, setWords] = useState([''])
  const [userTypeInput, setUserTypeInput] = useState([''])
  const [inputIsFocused, setInputIsFocused] = useState(true)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [finishTime, setFinishTime] = useState(0)
  const [wpm, setWpm] = useState(0)

  useEffect(() => {
    if (window._seed) {
      setWords(window._seed.words.split(' '))
    } else {
      setWords(randomWords(10))
    }
  }, [])

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
      setFinished(true)
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

    if (!started) {
      setStarted(true)
    }

    const newUserTypeInput = [...userTypeInput]
    newUserTypeInput[newUserTypeInput.length - 1] = newUserTypeInput[
      newUserTypeInput.length - 1
    ].concat(key)
    setUserTypeInput(newUserTypeInput)

    if (userTypeInput.length == words.length) {
      if (
        newUserTypeInput[newUserTypeInput.length - 1] == words[words.length - 1]
      ) {
        setFinished(true)
      }
    }
  }

  useEffect(() => {
    if (started && !finished) {
      setStartTime(+new Date())
    }

    if (started && finished) {
      setFinishTime(+new Date())
    }
  }, [started, finished])

  useEffect(() => {
    if (startTime && finishTime && !wpm) {
      setWpm(
        Math.round((words.length * 60) / ((finishTime - startTime) / 1000.0))
      )
    }
  }, [startTime, finishTime, wpm])

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

        {finished && finishTime && (
          <div css={s.result}>Good job! {wpm} wpm</div>
        )}

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
