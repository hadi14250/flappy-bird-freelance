"use client"
import React, { Component, useEffect } from "react"
import Pipe from "@/components/Pipe/Pipe"
import Image from "next/image"
import { Sprite, Stage } from "@pixi/react"
import { Button } from "@/components/ui/button"
import { AppContext } from "@/components/Context/Context"
import { addNewScore } from "../../lib/actions"
import { Games } from "@prisma/client"
import Link from "next/link"
import "../SnakesGame/styles.css"

const width = 350
const height = 550

class Game extends Component {
  static contextType = AppContext
  getInitialPipes() {
    const count = 3
    const pipes = []
    const pipeHeights = [
      {
        upperPipeHeight: height / 2 - height / 4,
        bottomPipeHeight: height / 2 + height / 17,
      },
      {
        upperPipeHeight: height / 2 + height / 20,
        bottomPipeHeight: height / 2 - height / 4,
      },
      {
        upperPipeHeight: height / 2 - height / 6,
        bottomPipeHeight: height / 2 - height / 14,
      },
      {
        upperPipeHeight: height / 2 - height / 8,
        bottomPipeHeight: height / 2 - height / 8,
      },
      {
        upperPipeHeight: height / 2 + height / 13,
        bottomPipeHeight: height / 2 - height / 3,
      },
    ]
    for (let i = 1; i < count; i++) {
      const x = width + (width / 1.5) * i

      const randomIndex = Math.floor(Math.random() * 5)
      pipes.push({
        upperPipeHeight: pipeHeights[randomIndex].upperPipeHeight,
        bottomPipeHeight: pipeHeights[randomIndex].bottomPipeHeight,
        x: x,
      })
    }
    return pipes
  }

  resetGame() {
    this.setState({
      birdHeight: height / 2,
      birdRadius: width / 20,
      left: 100,
      gravity: 0.8,
      velocity: 0,
      score: 0,
      pipeHeights: [
        {
          upperPipeHeight: height / 2 - height / 4,
          bottomPipeHeight: height / 2 + height / 17,
        },
        {
          upperPipeHeight: height / 2 + height / 20,
          bottomPipeHeight: height / 2 - height / 4,
        },
        {
          upperPipeHeight: height / 2 - height / 6,
          bottomPipeHeight: height / 2 - height / 14,
        },
        {
          upperPipeHeight: height / 2 - height / 8,
          bottomPipeHeight: height / 2 - height / 8,
        },
        {
          upperPipeHeight: height / 2 + height / 13,
          bottomPipeHeight: height / 2 - height / 3,
        },
      ],
      pipes: this.getInitialPipes(),
      pipeSpeed: 4,
    })
    this.interval = setInterval(() => this.update(), 25)
  }

  constructor(props) {
    super(props)
    this.state = {
      birdHeight: height / 2,
      birdRadius: width / 20,
      left: 100,
      gravity: 0.8,
      velocity: 0,
      width: width,
      height: height,
      score: 0,
      pipeHeights: [
        {
          upperPipeHeight: height / 2 - height / 4,
          bottomPipeHeight: height / 2 + height / 17,
        },
        {
          upperPipeHeight: height / 2 + height / 20,
          bottomPipeHeight: height / 2 - height / 4,
        },
        {
          upperPipeHeight: height / 2 - height / 6,
          bottomPipeHeight: height / 2 - height / 14,
        },
        {
          upperPipeHeight: height / 2 - height / 8,
          bottomPipeHeight: height / 2 - height / 8,
        },
        {
          upperPipeHeight: height / 2 + height / 13,
          bottomPipeHeight: height / 2 - height / 3,
        },
      ],
      pipes: this.getInitialPipes(),
      pipeSpeed: 4,
    }
    this.moveUp = this.moveUp.bind(this)
    this.resetGame = this.resetGame.bind(this)
  }

  componentDidMount() {
    const { setGameEnded } = this.context
    setGameEnded(false)
    this.interval = setInterval(() => this.update(), 25)
    window.addEventListener("keydown", this.moveUp)
  }

  componentWillUnmount() {
    const { setGameEnded } = this.context
    clearInterval(this.interval)
    setGameEnded(true)
    window.removeEventListener("keydown", this.moveUp)
  }

  update() {
    const { setGameEnded } = this.context
    const birdCrashed =
      this.state.birdHeight > height - this.state.birdRadius * 2
    if (birdCrashed) {
      setGameEnded(true)
      addNewScore(this.state.score, this.props.username, Games.FlappyBird)
      clearInterval(this.interval)
      return
    }

    const pipeWasHit = this.state.pipes.find((pipe) => pipe.isHit)

    if (pipeWasHit) {
      setGameEnded(true)
      addNewScore(this.state.score, this.props.username, Games.FlappyBird)
      clearInterval(this.interval)
      return
    }

    const newVelocity = (this.state.velocity + this.state.gravity) * 0.9
    const birdHeight = newVelocity + this.state.birdHeight
    const newPipes = this.state.pipes.map((pipe) => {
      const newX = pipe.x - this.state.pipeSpeed
      if (
        this.state.left - newX < 4 &&
        this.state.left - newX > 0 &&
        birdHeight > pipe.upperPipeHeight &&
        birdHeight + this.state.birdRadius < height - pipe.bottomPipeHeight
      ) {
        this.setState({
          score: this.state.score + 1,
        })
      }
      if (newX < 0) {
        const randomIndex = Math.floor(Math.random() * 5)
        return {
          upperPipeHeight: this.state.pipeHeights[randomIndex].upperPipeHeight,
          bottomPipeHeight:
            this.state.pipeHeights[randomIndex].bottomPipeHeight,
          x: width + width / 3,
        }
      } else {
        let isHit = false
        const xDifference = this.state.left - pipe.x
        const hitOnX = xDifference < width / 12 && xDifference > 0
        const hitOnUpperY = birdHeight < pipe.upperPipeHeight
        const hitOnLowerY =
          birdHeight + this.state.birdRadius > height - pipe.bottomPipeHeight
        if ((hitOnUpperY || hitOnLowerY) && hitOnX) {
          isHit = true
        }

        return {
          ...pipe,
          x: newX,
          isHit: isHit,
        }
      }
    })
    this.setState({
      velocity: newVelocity,
      birdHeight: birdHeight,
      pipes: newPipes,
    })
  }

  moveUp(e) {
    this.setState({
      velocity: this.state.velocity - (width < 768 ? 20 : 25),
    })
  }

  render() {
    const left = this.state.left
    const birdHeight = this.state.birdHeight
    const { gameEnded } = this.context

    return (
      <div className="relative mt-32" onMouseDown={this.moveUp}>
        <div className="absolute top-0 left-0 py-5 w-full flex justify-center items-center text-white">
          <h1 className="text-2xl">Score: {this.state.score}</h1>
        </div>
        {gameEnded && (
          <div id="game-over-modal-container">
            <div id="game-over-modal" className="space-y-8">
              <h2>Game Over</h2>
              <p className="final-score">
                Your Final Score: <span>{this.state.score}</span>
              </p>
              <div className="flex items-center gap-10">
                <Link href="/leaderboard/flappybird">
                  <Button>Go to leaderboard</Button>
                </Link>
                <Button onClick={this.resetGame}>Play again</Button>
              </div>
            </div>
          </div>
        )}
        <div style={{ left: left, top: birdHeight, position: "absolute" }}>
          <Image
            src="/images/flappy_bird.png"
            width={this.state.birdRadius * 2}
            height={this.state.birdRadius * 2}
          />
        </div>
        <Stage height={height} width={width}>
          <Sprite
            image="/images/background.png"
            x={0}
            y={0}
            width={width}
            height={height}
          />
          {this.state.pipes.map((pipe) => {
            const upperPipeHeight = pipe.upperPipeHeight
            const x = pipe.x

            const bottomPipeTop = height - pipe.bottomPipeHeight
            const bottomPipeHeight = pipe.bottomPipeHeight

            return (
              <Pipe
                key={x}
                width={width}
                height={height}
                isHit={pipe.isHit}
                upperPipeHeight={upperPipeHeight}
                bottomPipeHeight={bottomPipeHeight}
                x={x}
                bottomPipeTop={bottomPipeTop}
              />
            )
          })}
        </Stage>
      </div>
    )
  }
}

export default Game
