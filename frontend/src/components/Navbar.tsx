import { useState, useEffect } from "react";
import { ModeToggle } from "./ModeToggle";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import axios from "@/api/axios";
import { useStore } from '@nanostores/react'
import { isLoggedIn } from "@/store/userStore";
import { deleteCookie } from "@/util/cookies";
import { checkAuth } from "@/util/CheckAuth";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

function Navbar() {
    const [toggled, setToggled] = useState<boolean>(false)
    const handleClick = () => setToggled(t => !t)
    const $isLoggedIn = useStore(isLoggedIn)

    useEffect(() => {
        const checkAuthenticated = async () => await checkAuth()
        checkAuthenticated()
    }, [$isLoggedIn])

    const clearAllCookies = async () => {
        isLoggedIn.set(false)
        deleteCookie('username')
        deleteCookie('user_id')
        await axios.get('/auth/clear-cookies')
    }

    const handleLogout = async () => {
        await axios.post('/auth/logout', {}, { withCredentials: true })
        clearAllCookies()
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
                    {$isLoggedIn ?
                        <Popover>
                            <PopoverTrigger>
                                <div className="my-auto border-2 border hover:bg-accent p-2 rounded-full transition-all">
                                    <User />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="flex flex-col w-full w-[160px] mr-3 p-0">
                                <a className="p-3 w-full cursor-pointer hover:bg-accent" href="/profile">Profile</a>
                                <div className="p-3 w-full cursor-pointer hover:bg-accent flex items-center justify-between" onClick={handleLogout}>
                                    Logout
                                    <LogOut className="h-4 w-4" />
                                </div>
                                <hr></hr>
                                <ModeToggle />
                            </PopoverContent>
                        </Popover>
                        :
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
                    <>
                        <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" onClick={handleLogout} href="/">Logout</a>
                        <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" href="/profile">Profile</a>
                    </>
                    :
                    <>
                        <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" href="/login">Login</a>
                        <a className="hover:text-blue-800 mt-auto py-3.5 w-full h-full border-b background text-center cursor-pointer" href="/register">Register</a>
                    </>
                }
                <div className="flex gap-3 mx-auto py-3">
                    <ModeToggle />
                </div>
            </div>
            {toggled && <div className="absolute top-0 h-svh w-full bg-black opacity-20 z-30"
                onClick={handleClick}></div>}
        </header >
    )
}


export default Navbar