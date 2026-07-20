import React, { useRef, useEffect, useState } from 'react'

const s = {
  word: 'relative mr-1',
  correct: 'text-green-600',
  wrong: 'text-red-400',
  pending: 'text-gray-300',
  caret: 'absolute h-6 w-0.5 bg-blue-500 transition-all duration-100 ease-out',
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
      left: -1,
      top: 4,
    })

    useEffect(() => {
      if (!lastInputEl.current) {
        setCaretPos((prev) => {
          return {
            ...prev,
            left: 0,
          }
        })
        return
      }

      setCaretPos((prev) => {
        return {
          ...prev,
          left:
            lastInputEl.current.offsetLeft + lastInputEl.current.offsetWidth,
        }
      })
    }, [userInput.length])

    return (
      <span className={s.word} data-testid="word">
        {Array.from(
          Array(Math.max(template.length, userInput.length)).keys(),
        ).map((i) => {
          const ref = i == userInput.length - 1 ? lastInputEl : null
          const templateChar = template[i]
          const userInputChar = userInput[i]

          let charElement
          if (templateChar && userInputChar) {
            charElement =
              templateChar == userInputChar ? (
                <span
                  className={`${s.correct} correct`}
                  data-testid="correct"
                  ref={ref}
                >
                  {templateChar}
                </span>
              ) : (
                <span
                  className={`${s.wrong} wrong`}
                  data-testid="wrong"
                  ref={ref}
                >
                  {templateChar}
                </span>
              )
          } else if (userInputChar) {
            charElement = (
              <span
                className={`${s.wrong} wrong`}
                data-testid="wrong"
                ref={ref}
              >
                {userInputChar}
              </span>
            )
          } else {
            charElement = (
              <span
                className={`${s.pending} pending`}
                data-testid="pending"
                ref={ref}
              >
                {templateChar}
              </span>
            )
          }

          return <React.Fragment key={i}>{charElement}</React.Fragment>
        })}

        {showCaret && (
          <span
            className={s.caret}
            data-testid="caret"
            style={{ left: caretPos.left + 1, top: caretPos.top }}
          ></span>
        )}
      </span>
    )
  },
)
