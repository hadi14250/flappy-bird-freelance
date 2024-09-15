"use client"
import { AppContext } from "@/components/Context/Context"
import Game from "@/components/Game/Game"
import React, { useContext } from "react"

const page = () => {
  const { username } = useContext(AppContext)
  return <Game username={username} />
}

export default page
