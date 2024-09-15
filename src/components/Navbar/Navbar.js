"use client"
import { faBars, faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useContext, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AppContext } from "../Context/Context"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [darkNav, setDarkNav] = useState(false)
  const { gameEnded } = useContext(AppContext)

  const dropdown = useRef(null)
  const trigger = useRef(null)

  const clickHandler = ({ target }) => {
    if (!dropdown.current) return
    if (dropdown.current.contains(target) || trigger.current.contains(target))
      return
    setIsMobileMenuOpen(false)
  }

  const onScroll = () => {
    if (window.scrollY > 80) {
      setDarkNav(true)
    } else {
      setDarkNav(false)
    }
  }

  useEffect(() => {
    if (window.scrollY > 80) {
      setDarkNav(true)
    } else {
      setDarkNav(false)
    }
    document.addEventListener("click", clickHandler)
    window.addEventListener("scroll", onScroll)
    return () => {
      document.removeEventListener("click", clickHandler)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const links = [
    { name: "Play Flappybird", path: "/games/flappybird" },
    { name: "Play Snake", path: "/games/snake" },
  ]

  const components = [
    {
      title: "Flappybird",
      href: "/leaderboard/flappybird",
      description:
        "Leaderboard for the Flappybird game. Compete with other players to get the highest score.",
    },
    {
      title: "Snake",
      href: "/leaderboard/snake",
      description:
        "Leaderboard for the Snake game. Compete with other players to get the highest score.",
    },
  ]

  return (
    <div className="!pointer-events-auto">
      <nav
        style={{
          transition: "background 0.5s ease-in-out",
        }}
        className="text-white fixed flex z-[9999] w-full bg-blue-600 items-center justify-center px-10 py-4"
      >
        <div className="max-w-[1300px] w-full rounded-full flex justify-between items-center">
          <Link href="/">
            <Image
              src="/images/flappy_bird.png"
              width={100}
              height={100}
              alt="Flappy bird"
            />
          </Link>
          <ul className="hidden md:flex space-x-10">
            {links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <Link className="text-[16px]" href={link.path}>
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="!bg-transparent !h-auto text-[16px] !p-0">
                      Leaderboard
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink>
                        <ul className="grid w-[350px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px] ">
                          {components.map((component, componentIndex) => (
                            <ListItem
                              key={componentIndex}
                              title={component.title}
                              href={component.href}
                            >
                              {component.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </li>
          </ul>
          <button
            ref={trigger}
            className="md:hidden flex ml-5"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faBars} size="2x" color="white" />
          </button>
        </div>
      </nav>
      <nav className="md:hidden flex text-white">
        <ul
          ref={dropdown}
          style={{
            background: "rgba(21, 17, 44, 0.85)",
          }}
          className={
            `w-[240px] gap-[30px] text-center top-0 z-[9999] px-[30px] h-[100vh] flex-col flex items-center fixed transition-all duration-500 ease-in-out ` +
            (isMobileMenuOpen ? "right-0" : "-right-[240px]")
          }
        >
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-start p-5"
          >
            <FontAwesomeIcon icon={faX} className="text-[18px] text-white" />
          </button>
          {links.map((link, linkIndex) => {
            return (
              <li key={linkIndex}>
                <Link href={link.path}>{link.name}</Link>
              </li>
            )
          })}
          <li>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="!bg-transparent !h-auto !text-[30px]">
                    Leaderboard
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>
                      <ul className="grid w-[350px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px] ">
                        {components.map((component, componentIndex) => (
                          <ListItem
                            key={componentIndex}
                            title={component.title}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </li>
        </ul>
      </nav>
    </div>
  )
}

const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm text-black font-medium leading-none">
              {title}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = "ListItem"

export default Navbar
