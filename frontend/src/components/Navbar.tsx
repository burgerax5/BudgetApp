import React, { useState, useEffect } from "react";
import { ModeToggle } from "./ModeToggle";
import { Input } from "@/components/ui/input";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import axios from "@/api/axios";
import { useStore } from '@nanostores/react'
import { isLoggedIn } from "@/userStore";

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

    const readCookie = (cookieName: string) => {
        const name = cookieName + '='
        const decodedCookie = decodeURIComponent(document.cookie)
        const cookieArray = decodedCookie.split(';')

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }

        return null; // Cookie not found
    }

    const deleteCookie = (cookieName: string) => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }

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
            const res2 = await axios.post('/auth/refresh-token', { 'refresh-token': readCookie('refresh-token') })
            if (res2.status === 200) {
                handleLogout()
            }
            else
                console.error(res2.statusText)
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
                    {isLoggedIn && <li className="hover:text-blue-600">
                        <a href="/expenses">Expenses</a>
                    </li>}
                </ul>
                <div className="sm:hidden hover:bg-secondary rounded-sm cursor-pointer z-1" onClick={handleClick}>
                    {!toggled && <Menu />}
                    {toggled && <X />}
                </div>
                <ul className="list-none flex gap-3 ml-auto hidden sm:flex">
                    <ModeToggle />
                    <Input type="text" placeholder="Search..." />
                    {isLoggedIn ?
                        <Button onClick={handleLogout}>
                            Logout
                        </Button> :
                        <>
                            <Button variant="outline" >
                                <a href="/login">Login</a>
                            </Button>
                            <Button>
                                <a href="/register">Register</a>
                            </Button>
                        </>}
                </ul>
            </nav>
            <div className={`absolute top-0 w-full grid bg-background border-b background duration-200 z-40 ${toggled ? "translate-y-11 opacity-1" : "-translate-y-full opacity-0"}`}>
                <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" href="/">Dashboard</a>
                {isLoggedIn && <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" href="/expenses">Expenses</a>}
                {isLoggedIn ?
                    <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" onClick={handleLogout}>Logout</a>
                    :
                    <>
                        <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" href="/login">Login</a>
                        <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" href="/register">Register</a>
                    </>
                }
                <ul className="list-none flex gap-3 mx-auto py-3">
                    <Input type="text" placeholder="Search..." />
                    <ModeToggle />
                </ul>
            </div>
            {toggled && <div className="absolute top-0 h-svh w-full bg-black opacity-20 z-30"
                onClick={handleClick}></div>}
        </header >
    )
}

export default Navbar