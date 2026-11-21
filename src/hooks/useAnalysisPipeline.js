import { useCallback, useEffect, useRef, useState } from 'react'

const initialState = { isRunning: false, progress: 0, activeIndex: -1, completed: [] }

export function useAnalysisPipeline(steps) {
  const [state, setState] = useState(initialState)
  const timerRef = useRef(null)
  const completionRef = useRef(null)

  useEffect(() => () => window.clearInterval(timerRef.current), [])

  const reset = useCallback(() => {
    window.clearInterval(timerRef.current)
    timerRef.current = null
    setState(initialState)
  }, [])

  const start = useCallback(
    (onComplete) => {
      window.clearInterval(timerRef.current)
      completionRef.current = onComplete
      setState({ isRunning: true, progress: 0, activeIndex: 0, completed: [] })

      let step = 0
      timerRef.current = window.setInterval(() => {
        step += 1
        const completed = steps.slice(0, step).map((item) => item.id)

        if (step >= steps.length) {
          window.clearInterval(timerRef.current)
          timerRef.current = null
          setState({ isRunning: false, progress: 100, activeIndex: -1, completed })
          completionRef.current?.()
          return
        }

        setState({
          isRunning: true,
          progress: Math.round((step / steps.length) * 100),
          activeIndex: step,
          completed,
        })
      }, 650)
    },
    [steps],
  )

  return { ...state, start, reset }
}
