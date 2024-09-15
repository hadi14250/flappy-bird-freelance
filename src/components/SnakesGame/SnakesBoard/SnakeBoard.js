import { useRef, useEffect, useState, useContext } from "react"
import { SnakeGameEngine } from "./SnakeGame"

import "./SnakesBoardStyles.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons"
import { AppContext } from "@/components/Context/Context"

export default function SnakeBoard({
  isPlaying,
  setIsPlaying,
  externalScore,
  setScore,
  setIsGameOver,
}) {
  const canvasRef = useRef(null)
  const context = useRef(null)
  const [snakeCurrent, setSnakeCurrent] = useState(null)
  const { setGameEnded, username } = useContext(AppContext)

  const snakes = useRef(null)

  const canvasSidesLength = 350 // 500px

  useEffect(() => {
    if (canvasRef.current === null) {
      return
    }

    canvasRef.current.width = canvasSidesLength
    canvasRef.current.height = canvasSidesLength
    context.current = canvasRef.current.getContext("2d")

    if (context.current) {
      const ctx = context.current
      snakes.current = new SnakeGameEngine(
        ctx,
        canvasSidesLength,
        externalScore,
        setScore,
        setIsGameOver,
        setGameEnded,
        username,
        isPlaying
      )
      const snakeGame = snakes.current
      setSnakeCurrent(snakeGame)
      window.onkeydown = (e) => {
        switch (e.key) {
          case "w":
          case "ArrowUp":
            snakeGame.snake.changeMovement("to top")
            break
          case "s":
          case "ArrowDown":
            snakeGame.snake.changeMovement("to bottom")
            break
          case "d":
          case "ArrowRight":
            snakeGame.snake.changeMovement("to right")
            break
          case "a":
          case "ArrowLeft":
            snakeGame.snake.changeMovement("to left")
            break
          case "Escape":
            {
              setIsPlaying((prevIsPlaying) => {
                return !prevIsPlaying
              })
              setGameEnded((prev) => !prev)
            }
            break
          default:
            break
        }
      }
    }

    return () => {
      canvasRef.current = null
      context.current = null
      snakes.current = null
    }
  }, [])

  useEffect(() => {
    if (snakes.current) {
      snakes.current.animate(isPlaying)
    }
  }, [isPlaying])
  return (
    <div className="relative">
      <canvas id="game-canvas" ref={canvasRef}></canvas>
      {snakeCurrent && (
        <div className="absolute bottom-0 right-0 opacity-30 flex gap-4 flex-col items-center justify-center">
          <button
            onClick={() => snakeCurrent.snake.changeMovement("to top")}
            className="bg-white border p-3"
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => snakeCurrent.snake.changeMovement("to left")}
              className="bg-white border p-3"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
              onClick={() => snakeCurrent.snake.changeMovement("to bottom")}
              className="bg-white border p-3"
            >
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
            <button
              onClick={() => snakeCurrent.snake.changeMovement("to right")}
              className="bg-white border p-3"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
