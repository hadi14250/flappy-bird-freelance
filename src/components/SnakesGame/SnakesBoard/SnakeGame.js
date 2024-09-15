import { addNewScore } from "@/lib/actions"
import Snake from "./Snake"
import { Games } from "@prisma/client"
import { AppContext } from "@/components/Context/Context"

export class SnakeGameEngine {
  constructor(
    context,
    boardSidesLength,
    externalScore,
    setScore,
    setIsGameOver,
    setGameEnded,
    username,
    isPlaying
  ) {
    this.context = context

    this.snake = new Snake()
    this._foodCoordinate = {
      row: -1,
      col: -1,
    }

    this.boardSidesLength = boardSidesLength
    this.numOfRowsAndCols = 26
    this._gameBoard = []
    this.externalScore = externalScore
    this.setScore = setScore
    this.setIsGameOver = setIsGameOver
    this.setGameEnded = setGameEnded
    this.username = username

    // these 2 properties set how often the re-render is
    this.currentFrameCount = 0
    this.staggerFrame = 8

    this.internalPlayState = isPlaying
  }

  get score() {
    if (this.snake.length === 0) {
      return 0
    }
    return this.snake.length * 10 - this.snake.defaultlength * 10
  }

  get gameBoard() {
    if (this._gameBoard.length === 0) {
      const nRows = this.numOfRowsAndCols
      const nCols = this.numOfRowsAndCols

      for (let i = 0; i < nRows; i++) {
        this._gameBoard.push(Array.from(Array(nCols)).fill(null))
      }
    }

    return this._gameBoard
  }

  set gameBoard(newGameBoard) {
    this._gameBoard = newGameBoard
  }

  get foodCoordinate() {
    const foodCoordInSnakeCoords = (foodRow, foodCol) => {
      const match = this.snake.bodyCoordinates.find((snakeCoord) => {
        return snakeCoord.col === foodCol && snakeCoord.row === foodRow
      })

      return match !== undefined
    }

    if (this._foodCoordinate.row < 0 || this._foodCoordinate.col < 0) {
      let randRow = Math.floor(Math.random() * this.numOfRowsAndCols)
      let randCol = Math.floor(Math.random() * this.numOfRowsAndCols)

      while (foodCoordInSnakeCoords(randRow, randCol)) {
        randRow = Math.floor(Math.random() * this.numOfRowsAndCols)
        randCol = Math.floor(Math.random() * this.numOfRowsAndCols)
      }

      this._foodCoordinate = {
        row: randRow,
        col: randCol,
      }
    }

    return this._foodCoordinate
  }

  set foodCoordinate(newCoord) {
    const foodCoordInSnakeCoords = (foodRow, foodCol) => {
      const match = this.snake.bodyCoordinates.find((snakeCoord) => {
        return snakeCoord.col === foodCol && snakeCoord.row === foodRow
      })

      return match !== undefined
    }

    if (newCoord.row < 0 || newCoord.col < 0) {
      let randRow = Math.floor(Math.random() * this.numOfRowsAndCols)
      let randCol = Math.floor(Math.random() * this.numOfRowsAndCols)

      while (foodCoordInSnakeCoords(randRow, randCol)) {
        randRow = Math.floor(Math.random() * this.numOfRowsAndCols)
        randCol = Math.floor(Math.random() * this.numOfRowsAndCols)
      }

      this._foodCoordinate = {
        row: randRow,
        col: randCol,
      }
    } else {
      this._foodCoordinate = newCoord
    }
  }

  generateGrid() {
    const cellWidth = this.boardSidesLength / this.numOfRowsAndCols
    const cellHeight = this.boardSidesLength / this.numOfRowsAndCols

    this.gameBoard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        switch (cell) {
          case "snake":
            this.context.fillStyle = "#A2C579"
            break
          case "food":
            this.context.fillStyle = "salmon"
            break
          case null:
            this.context.fillStyle = "white"
            break
        }
        this.context.fillRect(
          colIndex * cellWidth,
          rowIndex * cellHeight,
          cellWidth,
          cellHeight
        )
      })
    })
  }

  setFoodOnBoard() {
    // if snake just ate, reset food position by setting the food coords to negative
    // this will trigger the change in food position coordinate
    if (this.snake.justAte) {
      this.foodCoordinate = {
        row: -1,
        col: -1,
      }
    }

    this.gameBoard[this.foodCoordinate.row][this.foodCoordinate.col] = "food"
  }

  setSnakeOnBoard() {
    const newBoard = this.gameBoard.map((row) => row.fill(null))
    this.snake.bodyCoordinates.forEach((snakeCoord) => {
      newBoard[snakeCoord.row][snakeCoord.col] = "snake"
    })
    this.gameBoard = newBoard
  }

  renderBoard() {
    this.setSnakeOnBoard()
    this.setFoodOnBoard()
    this.generateGrid()
  }

  snakeIsOutOfBounds() {
    // check if the snake head's coord is out of bounds

    const snakeHead = this.snake.headCoordinate
    const boundingArea = {
      min: 0,
      max: this.numOfRowsAndCols - 1,
    }
    const rowOutOfBounds =
      snakeHead.row > boundingArea.max || snakeHead.row < boundingArea.min
    const columnOutOfBounds =
      snakeHead.col > boundingArea.max || snakeHead.col < boundingArea.min

    return rowOutOfBounds || columnOutOfBounds
  }

  snakeHitsBody() {
    // check if head has similar coord with existing body coords

    const snakeBody = this.snake.bodyCoordinates.slice(0, this.snake.length - 1)
    const snakeHead = this.snake.headCoordinate
    const match = snakeBody.find((bodyCoord) => {
      const matchingRow = bodyCoord.row === snakeHead.row
      const matchingCol = bodyCoord.col === snakeHead.col
      return matchingRow && matchingCol
    })

    return match !== undefined
  }

  isGameOver() {
    return this.snakeHitsBody() || this.snakeIsOutOfBounds()
  }

  animate(isPlaying) {
    this.internalPlayState = isPlaying

    if (this.currentFrameCount < this.staggerFrame) {
      this.currentFrameCount++
    } else {
      this.currentFrameCount = 0

      if (this.externalScore !== this.score) {
        this.setScore(this.score)
      }

      if (this.isGameOver()) {
        this.setIsGameOver(true)
        this.setGameEnded(true)
        addNewScore(this.score, this.username, Games.Snake)
        return
      }

      this.context.clearRect(0, 0, this.boardSidesLength, this.boardSidesLength)
      this.renderBoard()
      this.snake.move(this.foodCoordinate)
    }

    this.internalPlayState &&
      requestAnimationFrame(() => this.animate(this.internalPlayState))
  }
}
