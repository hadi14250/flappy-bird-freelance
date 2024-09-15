"use client"
import React, { useContext } from "react"
import { AppContext } from "@/components/Context/Context"
import { EnterUsername } from "../EnterUserName/EnterUserName"

const GameLayout = ({ children }) => {
  const { username, setUsername } = useContext(AppContext)
  return (
    <>
      {username ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          {children}
        </div>
      ) : (
        <div className="w-full min-h-screen items-center justify-center flex">
          <EnterUsername setUsername={setUsername} />
        </div>
      )}
    </>
  )
}

export default GameLayout
