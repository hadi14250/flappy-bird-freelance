export default class Snake {
  constructor() {
    this.movement = "to right"
    this._bodyCoordinates = []
    this.defaultlength = 3
    this._headCoordinate = {
      row: -1,
      col: -1,
    }
    this.allowMovementChange = true
    this.justAte = false
  }

  get length() {
    return this._bodyCoordinates.length
  }

  get bodyCoordinates() {
    if (this._bodyCoordinates.length === 0) {
      const initialPoint = {
        row: 1,
        col: 1,
      }
      for (let i = 1; i <= this.defaultlength; i++) {
        this._bodyCoordinates.push({
          row: initialPoint.row,
          col: initialPoint.col * i,
        })
      }
    }
    return this._bodyCoordinates
  }

  set bodyCoordinates(newSnakeCoords) {
    this._bodyCoordinates = newSnakeCoords
  }

  get headCoordinate() {
    if (this._headCoordinate.row < 0 || this._headCoordinate.col < 0) {
      this._headCoordinate = this.bodyCoordinates[this.length - 1]
    }

    return this._headCoordinate
  }

  set headCoordinate(newCoord) {
    this._headCoordinate = newCoord
  }

  changeMovement(newMove) {
    if (!this.allowMovementChange) {
      return
    }

    const rowOpposite =
      (newMove === "to bottom" && this.movement === "to top") ||
      (newMove === "to top" && this.movement === "to bottom")
    const columnOpposite =
      (newMove === "to right" && this.movement === "to left") ||
      (newMove === "to left" && this.movement === "to right")

    if (rowOpposite || columnOpposite) {
      // just ignore the oposing movement
      return
    }

    this.movement = newMove
    this.allowMovementChange = false
  }

  canEat(nextHead, foodCoord) {
    return nextHead.col === foodCoord.col && nextHead.row === foodCoord.row
  }

  move(foodCoord) {
    // TODO: Set justAte if has eaten or not

    let nextHead = { ...this.headCoordinate }

    switch (this.movement) {
      case "to right":
        nextHead = {
          ...nextHead,
          col: this.headCoordinate.col + 1,
        }
        break
      case "to left":
        nextHead = {
          ...nextHead,
          col: this.headCoordinate.col - 1,
        }
        break
      case "to top":
        nextHead = {
          ...nextHead,
          row: this.headCoordinate.row - 1,
        }
        break
      case "to bottom":
        nextHead = {
          ...nextHead,
          row: this.headCoordinate.row + 1,
        }
        break
      default:
        throw new Error(`Snake movement is invalid: ${this.movement}`)
    }
    if (this.canEat(nextHead, foodCoord)) {
      // we don't cut the snake
      const newSnakeCoordinates = [...this.bodyCoordinates]
      this.headCoordinate = nextHead
      newSnakeCoordinates.push(this.headCoordinate)
      this.bodyCoordinates = newSnakeCoordinates
      this.allowMovementChange = true
      this.justAte = true
    } else {
      const newSnakeCoordinates = this.bodyCoordinates.slice(1)
      this.headCoordinate = nextHead
      newSnakeCoordinates.push(this.headCoordinate)
      this.bodyCoordinates = newSnakeCoordinates
      this.allowMovementChange = true
      this.justAte = false
    }
  }
}
