import React, { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Input } from "@/components/ui/input";
import { Menu, X } from "lucide-react";

function Navbar() {
    const routes = ["Overview", "Expenses"];

    const [toggled, setToggled] = useState(false)

    const handleClick = () => setToggled(t => !t)

    return (
        <header class="relative">
            <nav className="flex gap-8 items-center bg-background relative px-5 py-2 justify-between border-b border-slate-400 sm:justify-normal z-50">
                <div className="flex font-bold text-lg z-1">
                    <a href="/">
                        Budget
                        <span className="font-medium text-blue-600">App</span>
                    </a>
                </div>
                <ul className="list-none flex gap-3 hidden sm:flex">
                    {
                        routes.map((route) => (
                            <li key={route} className="hover:text-blue-600">
                                <a href={`/${route.toLowerCase()}`}>{route}</a>
                            </li>
                        ))
                    }
                </ul>
                <div className="sm:hidden hover:text-sky-700 cursor-pointer z-1" onClick={handleClick}>
                    {!toggled && <Menu />}
                    {toggled && <X />}
                </div>
                <ul className="list-none flex gap-3 ml-auto hidden sm:flex">
                    <Input type="text" placeholder="Search..." />
                    <ModeToggle client="load" />
                </ul>
            </nav>
            <div className={`absolute top-0 w-full grid bg-background border-b border-slate-400 duration-200 z-40 ${toggled ? "translate-y-11 opacity-1" : "-translate-y-full opacity-0"}`}>
                {routes.map((route) => (
                    <a key={`mobile-${route}`} className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b border-slate-400 text-center" href={`/${route.toLowerCase()}`}>
                        <span>{route}</span>
                    </a>
                ))}
                <ul className="list-none flex gap-3 mx-auto py-3">
                    <Input type="text" placeholder="Search..." />
                    <ModeToggle client="load" />
                </ul>
            </div>
            {toggled && <div className="absolute top-0 h-svh w-full bg-black opacity-20 z-2"
                onClick={handleClick}></div>}
        </header >
    )
}

export default Navbar