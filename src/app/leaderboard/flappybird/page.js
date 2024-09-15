import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchScores } from "@/lib/actions"
import { Games } from "@prisma/client"
import React from "react"

const page = async () => {
  const scores = await fetchScores(Games.FlappyBird)
  return (
    <div className="w-full min-h-screen flex items-center justify-center pt-20">
      <div className="space-y-8">
        <h1>Flappybird Leaderboard</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No.</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score, index) => (
              <TableRow>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{score.Score.username}</TableCell>
                <TableCell>{score.score}</TableCell>
                <TableCell className="text-right">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(score.updatedAt))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default page
