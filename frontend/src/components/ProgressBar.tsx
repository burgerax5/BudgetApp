import { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
    percentage: number,
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => setProgress(percentage), 500)
        return () => clearTimeout(timer)
    }, [percentage])

    return (
        <Progress value={progress} className="w-full" />
    )
}

export default ProgressBar