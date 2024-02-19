import { useStore } from "@nanostores/react"
import { isDarkMode } from "@/store/userStore"

import HeroSection from "@/components/landingpage/HeroSection"
import Scroller from "./Scroller"

import '@/styles/landingpage.css'

function LandingPage() {
    const $isDarkMode = useStore(isDarkMode)

    return (
        <>
            <HeroSection isDarkMode={$isDarkMode} />
            <Scroller />
        </>
    )
}

export default LandingPage