import { useEffect, useState, type JSX } from 'react'
import { TypingArea } from '../components/TypingArea'
import { randomWords } from '../utils/wordsDb'
import { useStats } from '../contexts/Stats'
import { useAuth } from '@/contexts/Auth'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { auth as firebaseAuth } from '../config/firebase'

const s = {
  container: 'h-screen min-w-full flex items-center justify-center',
  main: 'max-w-[50%] min-w-[640px]',
  title: 'text-4xl text-blue-600 antialiased',
  typingInput: 'h-0 w-0',
  footer: 'fixed bottom-0 pb-8 text-center',
  header: 'fixed top-0 right-8 pt-4 text-right',
  githubLink: 'text-xs',
  result: 'mt-4 text-center text-xl',
  restart: 'mt-2 text-center',
  restartButton:
    'py-2 px-4 bg-transparent hover:bg-blue-500 font-semibold hover:text-white border border-blue-500 hover:border-transparent rounded',
  restartHint: 'mt-1 text-xs',
  liveWpm: 'text-base',
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
  const [stats, dispatch] = useStats()
  const [auth] = useAuth()

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
    setLiveWpm(Math.round((stats.correct * 60) / (elapsedMs / 1000.0)) || 0)
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
    e.preventDefault()

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
    newUserTypeInput[newUserTypeInput.length - 1] =
      newUserTypeInput[newUserTypeInput.length - 1].concat(key)
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
    dispatch({ type: 'reset' })
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
        Math.round((stats.correct * 60) / ((finishTime - startTime) / 1000.0)),
      )
    }
  }, [startTime, finishTime, wpm])

  return (
    <div
      className={s.container}
      onClick={() => document.getElementById('typingInput')?.focus()}
    >
      <div className={s.header}>
        {auth.user ? (
          <>
            <span>{auth.user.email}</span>
            <button
              className="ml-4 cursor-pointer"
              onClick={() => signOut(firebaseAuth)}
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>

      <main className={s.main}>
        <h1 className={s.title}>Typeland</h1>

        <TypingArea
          words={words}
          userWords={userTypeInput}
          showCaret={inputIsFocused}
          finished={finished}
        />

        {started && !finished && <div className={s.liveWpm}>{liveWpm} wpm</div>}

        {started && (
          <div className={s.liveWpm}>
            Stats (correct/wrong/total) : {stats.correct}/{stats.wrong}/
            {stats.total}
          </div>
        )}

        {finished && finishTime && (
          <>
            <div className={s.result}>Good job! {wpm} wpm</div>
            <div className={s.restart}>
              <button className={s.restartButton} onClick={restart}>
                Restart
              </button>
              <div className={s.restartHint}>
                Click or press <code>Enter</code>
              </div>
            </div>
          </>
        )}

        {promptRestart && (
          <>
            <div className={s.restart}>
              <button className={s.restartButton} onClick={restart}>
                Restart
              </button>
              <div className={s.restartHint}>
                Press <code>Enter</code> again to restart typing.
              </div>
            </div>
          </>
        )}

        <input
          id="typingInput"
          data-testid="typingInput"
          className={s.typingInput}
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

      <div className={s.footer}>
        <a
          className={s.githubLink}
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
