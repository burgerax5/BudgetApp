import React, { useEffect, useState } from 'react'
import axios from '@/api/axios'
import { readCookie, deleteCookie } from '@/util/cookies'
import { useStore } from '@nanostores/react'
import { isLoggedIn } from '@/userStore'

interface HelpProps {
    mustBeAuthenticated: boolean
}

const Help: React.FC<HelpProps> = ({ mustBeAuthenticated }) => {
    const $isLoggedIn = useStore(isLoggedIn)

    const checkLoggedIn = async (): Promise<boolean> => {
        const res = await axios.get('/auth/', { withCredentials: true })
        return res.data ? true : false
    }

    const refreshAccessToken = async (): Promise<boolean> => {
        const refreshToken = readCookie("refreshToken")
        const res = await axios.post('/auth/refresh-token', { refreshToken })
        return res.status === 200 ? true : false
    }

    const clearCookies = async () => {
        const res = await axios.get('/auth/clear-cookies')
    }

    useEffect(() => {
        // const startUp = async () => {
        //     const loggedIn = await checkLoggedIn()
        //     if (!loggedIn && readCookie('refresh-token')) {
        //         await refreshAccessToken() ? isLoggedIn.set(true) : isLoggedIn.set(false)
        //     } else if (!loggedIn && !readCookie('refresh-token')) {
        //         await clearCookies()
        //         isLoggedIn.set(false)
        //     } else if (loggedIn) {
        //         isLoggedIn.set(true)
        //     }
        // }

        // startUp()

        console.log($isLoggedIn, mustBeAuthenticated)

        if ($isLoggedIn && !mustBeAuthenticated) location.replace('/')
        if (!$isLoggedIn && mustBeAuthenticated) location.replace('/login')
    }, [])

    return (
        <h1>
            {`$isLoggedIn: ${$isLoggedIn}`}
        </h1>
    )
}

export default Help