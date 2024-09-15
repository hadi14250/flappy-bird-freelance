import { Button } from "../ui/button"
import { HIGH_SCORE_KEY } from "./SnakesGame"
import Link from "next/link"

export default function GameOverModal({
  finalScore,
  setIsGameOver,
  setIsPlaying,
  setJustStarted,
  setScore,
}) {
  const handleGameReset = () => {
    // restart the game
    setIsGameOver(false)
    setIsPlaying(true)
    setJustStarted(true)
    setScore(0)
  }

  const currentHighScore = Number(localStorage.getItem(HIGH_SCORE_KEY))
  const highScoreBeaten = finalScore > currentHighScore
  if (highScoreBeaten) {
    localStorage.setItem(HIGH_SCORE_KEY, finalScore.toString())
  }

  return (
    <div id="game-over-modal-container">
      <div id="game-over-modal" className="space-y-8">
        <h2>Game Over</h2>
        <p className="final-score">
          Your Final Score: <span>{finalScore}</span>
        </p>
        {highScoreBeaten && finalScore > 0 && (
          <p className="congratulate">🏆 You beat the high score! 🏆</p>
        )}
        <div className="flex items-center gap-10">
          <Link href="/leaderboard/snake">
            <Button>Go to leaderboard</Button>
          </Link>
          <Button onClick={handleGameReset}>Play again</Button>
        </div>
      </div>
    </div>
  )
}
