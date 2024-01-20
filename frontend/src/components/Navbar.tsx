import React, { useState, useEffect } from "react";
import { ModeToggle } from "./ModeToggle";
import { Input } from "@/components/ui/input";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import axios from "@/api/axios";
import { useStore } from '@nanostores/react'
import { isLoggedIn } from "@/userStore";
import { readCookie, deleteCookie } from "@/util/cookies";

function Navbar() {
    const [toggled, setToggled] = useState<boolean>(false)
    const handleClick = () => setToggled(t => !t)
    const $isLoggedIn = useStore(isLoggedIn)

    useEffect(() => {
        const checkLoggedIn = async () => {
            const res = await axios.get('/auth/', { withCredentials: true })
            if (res.data)
                isLoggedIn.set(true)
            else
                isLoggedIn.set(false)
        }

        checkLoggedIn()
    }, [])

    const handleLogout = async () => {
        const res = await axios.post('/auth/logout', {}, { withCredentials: true })
        if (res.status === 200) {
            isLoggedIn.set(false)
            deleteCookie('username')
            deleteCookie('user_id')
            deleteCookie('refresh-token')
            location.replace('/')
        }
        // Token expired
        else if (res.status === 401) {
            await axios.get('/auth/clear-cookies')
        }
    }

    return (
        <header className="relative">
            <nav className="flex gap-8 items-center bg-background relative px-5 py-2 justify-between border-b border-slate-400 sm:justify-normal z-50">
                <div className="flex font-bold text-lg z-1">
                    <a href="/">
                        Budget
                        <span className="font-medium text-blue-600">App</span>
                    </a>
                </div>
                <ul className="list-none flex gap-3 hidden sm:flex">
                    <li className="hover:text-blue-600">
                        <a href="/">Dashboard</a>
                    </li>
                    {$isLoggedIn && <li className="hover:text-blue-600">
                        <a href="/expenses">Expenses</a>
                    </li>}
                </ul>
                <div className="sm:hidden hover:bg-secondary rounded-sm cursor-pointer z-1" onClick={handleClick}>
                    {!toggled && <Menu />}
                    {toggled && <X />}
                </div>
                <div className="flex gap-3 ml-auto hidden sm:flex">
                    <ModeToggle />
                    <Input type="text" placeholder="Search..." />
                    {$isLoggedIn ?
                        <Button onClick={handleLogout}>
                            Logout
                        </Button> :
                        <>
                            <Button variant="outline" asChild>
                                <a href="/login">Login</a>
                            </Button>
                            <Button asChild>
                                <a href="/register">Register</a>
                            </Button>
                        </>}
                </div>
            </nav>
            <div className={`absolute top-0 w-full grid bg-background border-b background duration-200 z-40 ${toggled ? "translate-y-11 opacity-1" : "-translate-y-full opacity-0"}`}>
                <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" href="/">Dashboard</a>
                {$isLoggedIn && <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" href="/expenses">Expenses</a>}
                {$isLoggedIn ?
                    <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" onClick={handleLogout}>Logout</a>
                    :
                    <>
                        <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" href="/login">Login</a>
                        <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" href="/register">Register</a>
                    </>
                }
                <div className="flex gap-3 mx-auto py-3">
                    <Input type="text" placeholder="Search..." />
                    <ModeToggle />
                </div>
            </div>
            {toggled && <div className="absolute top-0 h-svh w-full bg-black opacity-20 z-30"
                onClick={handleClick}></div>}
        </header >
    )
}

export default Navbar