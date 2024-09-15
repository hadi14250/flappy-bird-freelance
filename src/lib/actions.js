"use server"
import prisma from "./prisma"
import { revalidatePath, unstable_noStore } from "next/cache"

export const addNewScore = async (score, username, game) => {
  try {
    const existingScore = await prisma.game.findFirst({
      where: {
        AND: [
          {
            Score: {
              username: username,
            },
          },
          {
            gameName: game,
          },
        ],
      },
    })

    if (existingScore) {
      // If a score exists, update it
      if (score < existingScore.score) return
      await prisma.game.updateMany({
        where: {
          AND: [
            {
              Score: {
                username: username,
              },
            },
            {
              gameName: game,
            },
          ],
        },
        data: {
          score: score,
        },
      })
    } else {
      // If no score exists, create a new record
      const userFound = await prisma.score.findUnique({
        where: {
          username: username,
        },
      })
      if (userFound) {
        await prisma.game.create({
          data: {
            score: score,
            gameName: game,
            Score: {
              connect: {
                username: username,
              },
            },
          },
        })
      } else {
        await prisma.score.create({
          data: {
            username: username,
            Game: {
              create: {
                gameName: game,
                score: score,
              },
            },
          },
        })
      }
    }
    revalidatePath("/leaderboard")
  } catch (err) {
    console.log(err)
  }
}

export const fetchScores = async (game) => {
  unstable_noStore()
  try {
    const scores = await prisma.game.findMany({
      skip: 0,
      take: 10,
      orderBy: {
        score: "desc",
      },
      where: {
        gameName: {
          in: [game],
        },
      },
      include: {
        Score: true,
      },
    })
    return scores
  } catch (err) {
    Promise.reject(err)
  }
}
