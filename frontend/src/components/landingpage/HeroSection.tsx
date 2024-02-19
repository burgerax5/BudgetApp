import { Button } from "../ui/button"
import { Trash, ChevronRight } from "lucide-react"
import Hero from "@/images/hero.png"
import HeroLight from "@/images/hero-light.png"
import { useState, useEffect } from 'react'

interface Props {
    isDarkMode: boolean
}

const HeroSection: React.FC<Props> = ({ isDarkMode }) => {
    const [src, setSrc] = useState(isDarkMode ? Hero : HeroLight)

    useEffect(() => {
        setSrc(isDarkMode ? Hero : HeroLight)
    }, [isDarkMode])

    return (
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
            <img src={src.src} />
        </section>
    )
}

export default HeroSection