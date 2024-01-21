import React, { useEffect, useState } from 'react'
import { useStore } from '@nanostores/react'
import { isLoggedIn } from '@/store/userStore'

interface HelpProps {
    mustBeAuthenticated: boolean
}

const Protect: React.FC<HelpProps> = ({ mustBeAuthenticated }) => {
    const $isLoggedIn = useStore(isLoggedIn)

    useEffect(() => {
        if ($isLoggedIn && !mustBeAuthenticated) location.replace('/')
        if (!$isLoggedIn && mustBeAuthenticated) location.replace('/login')
        console.log($isLoggedIn)
    }, [])

    return (
        <h1>
            {$isLoggedIn}
        </h1>
    )
}

export default Protect