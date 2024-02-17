import { Trash, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import Hero from "../images/hero.png"
import AstroJS from "@/images/astrojs.png"
import NodeJS from "@/images/nodejs.png"
import Prisma from "@/images/prisma.png"
import ReactJS from "@/images/react.png"
import TypeScript from "@/images/ts.png"

function LandingPage() {
    const icons = [AstroJS.src, NodeJS.src, Prisma.src, ReactJS.src, TypeScript.src]

    return (
        <>
            <section className="flex flex-col items-center justify-center text-center gap-6 mt-12">
                <div className="px-6 py-[0.25rem] border rounded-full flex items-center justify-center gap-3">
                    <Trash className="w-4 h-4" /> Budget App
                </div>
                <h1 className="text-[3.75rem] font-bold flex flex-col leading-none">
                    <span>The world's worst budget app</span>
                    <span>ever created.</span>
                </h1>
                <Button className="flex items-center justify-between" variant="secondary">
                    Get started <ChevronRight className="ml-3 w-4 h-4" />
                </Button>
                <div className="">
                    <img src={Hero.src} />
                </div>
            </section>
            <section className="flex gap-12 items-center justify-center w-full mt-12 bg-accent p-3">
                {icons.map(icon => (
                    <img src={icon} className="max-h-[3rem]" />
                ))}
            </section>
        </>
    )
}

export default LandingPage