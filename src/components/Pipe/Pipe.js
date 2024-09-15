"use client"
import { useMemo } from "react"

import { BlurFilter, TextStyle } from "pixi.js"
import { Stage, Container, Sprite, Text } from "@pixi/react"

export default function Pipe(props) {
  const upperPipeHeight = props.upperPipeHeight
  const pipeX = props.x

  const lowerHeight = props.bottomPipeTop
  const bottomPipeHeight = props.bottomPipeHeight

  const color = props.isHit ? "red" : "blue"

  const topUrl = "/images/top.png"
  const bottomUrl = "/images/bottom.png"
  return (
    <>
      <Sprite
        image={topUrl}
        x={pipeX}
        y={upperPipeHeight - props.height}
        width={props.width / 8}
        height={props.height}
      />
      <Sprite
        image={bottomUrl}
        x={pipeX}
        y={lowerHeight}
        width={props.width / 8}
        height={props.height}
      />
    </>
  )
}
