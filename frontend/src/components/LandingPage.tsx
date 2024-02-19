import { Trash, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import Hero from "../images/hero.png"
import HeroLight from "../images/hero-light.png"
import AstroJS from "@/images/astrojs.png"
import NodeJS from "@/images/nodejs.png"
import Prisma from "@/images/prisma.png"
import ReactJS from "@/images/react.png"
import TypeScript from "@/images/ts.png"
import { useState, useEffect } from 'react'
import { useStore } from "@nanostores/react"
import { isDarkMode } from "@/store/userStore"

import '../styles/landingpage.css'

function LandingPage() {
    const icons = [AstroJS.src, NodeJS.src, Prisma.src, ReactJS.src, TypeScript.src]
    const $isDarkMode = useStore(isDarkMode)

    useEffect(() => {
        console.log($isDarkMode)
    }, [$isDarkMode])

    return (
        <>
            <section className="flex flex-col items-center justify-center text-center gap-6 mt-12 animate-[fade-in_1.5s_ease-out]">
                <div className="px-6 py-[0.25rem] border rounded-full flex items-center justify-center gap-3">
                    <Trash className="w-4 h-4" /> Budget App
                </div>
                <h1 className="text-[2rem] sm:text-[3.75rem] font-bold flex flex-col leading-none">
                    <span>The world's worst budget app</span>
                    <span>ever created.</span>
                </h1>
                <Button variant="secondary">
                    <a className="flex items-center justify-between" href="/login">
                        Get started <ChevronRight className="ml-3 w-4 h-4" />
                    </a>
                </Button>
                <img src={$isDarkMode ? Hero.src : HeroLight.src} />
            </section>
            <section className="flex gap-12 items-center w-full overflow-hidden mt-12 py-6 relative mb-32">
                <div className="flex gap-12 absolute scroller1">
                    {icons.map(icon => (
                        <img key={icon} src={icon} className="max-h-[3.5rem]" />
                    ))}
                </div>
                <div className="flex gap-12 absolute scroller2">
                    {icons.map(icon => (
                        <img key={icon} src={icon} className="max-h-[3.5rem]" />
                    ))}
                </div>
            </section>
            <section role="article flex flex-col">
                <div className="px-6 py-[0.25rem] text-center border rounded-full gap-3 max-w-[130px]">
                    Features
                </div>
                <article className="flex flex-col gap-20">
                    <h2 className="text-[2rem] sm:text-[3.5rem] font-bold flex flex-col leading-none mt-6">
                        Simple way of keeping track of your expenses.
                    </h2>
                    <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-[40%] flex flex-col gap-2">
                            <h3 className="text-[1.5rem] font-bold">Set budgets</h3>
                            <p className="opacity-70">
                                You can set a budget for a specific month, or year as well as budgets for specific categories for the month and the year. The budgets can be modified at any time.
                            </p>
                        </div>
                        <img className="sm:w-[60%] w-full" src={Hero.src} />
                    </div>
                </article>
            </section>
        </>
    )
}

export default LandingPage