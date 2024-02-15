import axios from '@/api/axios'
import { isLoggedIn } from '@/store/userStore'

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
