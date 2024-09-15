"use client"
import React, { createContext, useState } from "react"

export const AppContext = createContext({
  gameEnded: false,
  setGameEnded: null,
  username: "",
  setUsername: null,
})

const Context = ({ children }) => {
  const [gameEnded, setGameEnded] = useState(true)
  const [username, setUsername] = useState("")
  return (
    <AppContext.Provider
      value={{ gameEnded, setGameEnded, username, setUsername }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default Context
