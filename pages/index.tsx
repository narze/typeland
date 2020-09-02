/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'
import { useEffect, useState, useContext } from 'react'
import { TypingArea, Mode } from '../components/TypingArea'
import { randomWords } from '../utils/wordsDb'
import { StatsContext } from '../contexts/Stats'

const s = {
  container: tw`
    h-screen min-w-full
    flex
    items-center justify-center
  `,
  main: [
    tw`
      max-w-1/2
    `,
    css`
      min-width: 640px;
    `,
  ],
  title: tw`
    text-4xl
    text-blue-600
    antialiased
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
    text-xs
  `,
  result: tw`
    mt-4
    text-center
    text-xl
  `,
  restart: tw`
    mt-2
    text-center
  `,
  restartButton: tw`
    py-2 px-4
    bg-transparent hover:bg-blue-500
    font-semibold
    hover:text-white
    border border-blue-500 hover:border-transparent
    rounded
  `,
  restartHint: tw`
    mt-1
    text-xs
  `,
  liveWpm: tw`
    text-base
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
  const [liveWpm, setLiveWpm] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [promptRestart, setPromptRestart] = useState(false)
  const [currentMode, setCurrentMode] = useState('default')
  const { correct, wrong, total, reset: resetStats } = useContext(StatsContext)
  const DEFAULT_WORD_COUNT = 30
  const TIMER_LOOP_MS = 1000

  useEffect(() => {
    if (window._seed) {
      setWords(window._seed.words.split(' '))
    } else {
      setWords(randomWords(DEFAULT_WORD_COUNT))
    }
  }, [])

  useEffect(() => {
    let timer

    if (started) {
      timer = setInterval(() => {
        setElapsedMs((ms) => ms + TIMER_LOOP_MS)
      }, TIMER_LOOP_MS)
    } else {
      setElapsedMs(0)
      clearInterval(timer)
    }

    return () => clearInterval(timer)
  }, [started])

  useEffect(() => {
    setLiveWpm(Math.round((correct * 60) / (elapsedMs / 1000.0)) || 0)
  }, [elapsedMs])

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

  const handleEnter = () => {
    if (finished || promptRestart) {
      return restart()
    }

    if (started) {
      setPromptRestart(true)
    }
  }

  const handleType = (e) => {
    const { key, altKey, ctrlKey, metaKey } = e

    if (key == 'Backspace') {
      return handleDelete({ word: altKey || ctrlKey || metaKey })
    }

    if (key == 'Enter') {
      return handleEnter()
    }

    // Filter out modifiers
    if (key.length != 1 || altKey || ctrlKey || metaKey) {
      return
    }

    if (promptRestart) {
      setPromptRestart(false)
    }

    if (key == ' ') {
      return handleSpace()
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

  const restart = () => {
    setWords(randomWords(DEFAULT_WORD_COUNT))
    setUserTypeInput([''])
    setInputIsFocused(true)
    setFinished(false)
    setStarted(false)
    setStartTime(0)
    setFinishTime(0)
    setWpm(0)
    setLiveWpm(0)
    setElapsedMs(0)
    setPromptRestart(false)
    resetStats()
  }

  const toggleMode = () => {
    if (currentMode == 'default') {
      setCurrentMode('typealong')
    } else {
      setCurrentMode('default')
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
      setWpm(Math.round((correct * 60) / ((finishTime - startTime) / 1000.0)))
    }
  }, [startTime, finishTime, wpm])

  return (
    <div
      css={s.container}
      onClick={() => document.getElementById('typingInput').focus()}
    >
      <main css={s.main}>
        <h1 css={s.title}>
          Typeland
          <span css={tw`text-xs`}>
            {` `}[Mode :{' '}
            <button css={tw`underline`} onClick={toggleMode}>
              {currentMode}
            </button>
            ]
          </span>
        </h1>

        <TypingArea
          words={words}
          userWords={userTypeInput}
          showCaret={inputIsFocused}
          mode={Mode[currentMode]}
          finished={finished}
        />

        {started && !finished && <div css={s.liveWpm}>{liveWpm} wpm</div>}

        {started && (
          <div css={s.liveWpm}>
            Stats (correct/wrong/total) : {correct}/{wrong}/{total}
          </div>
        )}

        {finished && finishTime && (
          <>
            <div css={s.result}>Good job! {wpm} wpm</div>
            <div css={s.restart}>
              <button css={s.restartButton} onClick={restart}>
                Restart
              </button>
              <div css={s.restartHint}>
                Click or press <code>Enter</code>
              </div>
            </div>
          </>
        )}

        {promptRestart && (
          <>
            <div css={s.restart}>
              <button css={s.restartButton} onClick={restart}>
                Restart
              </button>
              <div css={s.restartHint}>
                Press <code>Enter</code> again to restart typing.
              </div>
            </div>
          </>
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
