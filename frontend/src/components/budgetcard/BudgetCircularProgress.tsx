import React, { useState, useEffect } from 'react'

interface Budget {
    id: number,
    amount: number,
    month: number,
    year: number
}

interface Props {
    budget: Budget | null,
    spent: number,
    period: string
}

const BudgetCircularProgress: React.FC<Props> = ({ budget, spent, period }) => {
    const remainingBudget = budget ? budget?.amount - spent : 0
    const [progress, setProgress] = useState<number>(0)

    useEffect(() => {
        const percentage = budget ? ((budget.amount - spent) / budget.amount) * 100 : 0
        setProgress(percentage)
    }, [budget, spent, progress])

    const getProgress = () => {
        return `radial-gradient(closest-side,transparent 79%,transparent 80% 100%), conic-gradient(hsl(var(--primary)) ${progress}%, hsl(var(--accent)) 0)`
    }

    return (
        <div className={`rounded-full w-full h-full absolute flex items-center justify-center`}
            style={{ backgroundImage: getProgress() }} id="budget-circular-progress" >
            <div className='flex flex-col items-center justify-center'>
                <div className='bg-background w-36 h-36 absolute rounded-full'></div>
                <div className='font-bold text-2xl z-10'>$
                    {budget ? (remainingBudget).toLocaleString('default', { minimumFractionDigits: 2 }) : (spent).toLocaleString('default', { minimumFractionDigits: 2 })}
                </div>
                <div className='text-sm opacity-70'>
                    {budget ?
                        `out of ${budget?.amount.toLocaleString('default', { minimumFractionDigits: 2 })}`
                        : `spent this ${period}`}
                </div>
            </div>
        </div>
    )
}

export default BudgetCircularProgress