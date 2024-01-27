import { useEffect } from 'react'
import axios from '@/api/axios'
import { readCookie, deleteCookie } from '@/util/cookies'
import { useStore } from '@nanostores/react'
import { isLoggedIn } from '@/store/userStore'

const checkLoggedIn = async (): Promise<boolean> => {
    const res = await axios.get('/auth/', { withCredentials: true })
    return res.data ? true : false
}

const refreshAccessToken = async (): Promise<boolean> => {
    const res = await axios.post('/auth/refresh-token', {}, { withCredentials: true })
    return res.status === 200 ? true : false
}

const clearCookies = async () => {
    await axios.get('/auth/clear-cookies')
}

export const checkAuth = async () => {
    await refreshAccessToken() ? isLoggedIn.set(true) : () => {
        isLoggedIn.set(false)
        clearCookies()
    }
}
