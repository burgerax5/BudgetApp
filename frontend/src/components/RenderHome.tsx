import Dashboard from "@/components/Dashboard";
import LandingPage from "@/components/LandingPage";
import { useStore } from '@nanostores/react';
import { isLoggedIn } from '@/store/userStore';

function RenderHome() {
    const $isLoggedIn = useStore(isLoggedIn)
    return (
        <main className="p-3 h-full max-w-screen-lg mx-auto">
            {$isLoggedIn ? <Dashboard /> : <LandingPage />}
        </main>
    )
}

export default RenderHome