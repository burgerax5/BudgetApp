import Dashboard from "@/components/Dashboard";
import LandingPage from "@/components/LandingPage";
import { useStore } from '@nanostores/react';
import { isLoggedIn } from '@/store/userStore';

interface Props {
    month: string | null,
    year: string | null
}

const RenderHome: React.FC<Props> = ({ month, year }) => {
    const $isLoggedIn = useStore(isLoggedIn)
    return (
        <main className="p-3 h-full max-w-screen-lg mx-auto">
            {$isLoggedIn ?
                <Dashboard month={month} year={year} />
                :
                <LandingPage />}
        </main>
    )
}

export default RenderHome