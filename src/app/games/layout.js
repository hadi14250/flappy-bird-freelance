import GameLayout from "@/components/Layout/Layout"

export const metadata = {
  title: "Games",
  description: "Games",
}

export default function MainGameLayout({ children }) {
  return <GameLayout>{children}</GameLayout>
}
