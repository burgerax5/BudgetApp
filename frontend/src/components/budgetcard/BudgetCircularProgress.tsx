import React from 'react'

interface Budget {
    id: number,
    amount: number,
    month: number,
    year: number
}


interface Props {
    budget: Budget | null,
    spent: number
}

const BudgetCircularProgress: React.FC<Props> = ({ budget, spent }) => {
    const remainingBudget = budget ? budget?.amount - spent : 0
    const remainingBudgetPercent = budget ? ((budget.amount - spent) / budget.amount) * 100 : 0



    const getProgress = (progress: number) => {
        return `radial-gradient(closest-side,transparent 79%,transparent 80% 100%), conic-gradient(hsl(var(--primary)) ${progress}%, hsl(var(--accent)) 0)`
    }

    return (
        <div className={`rounded-full w-full h-full absolute flex items-center justify-center`}
            style={{ backgroundImage: budget ? getProgress(remainingBudgetPercent) : getProgress(100) }}>
            <div className='flex flex-col items-center justify-center'>
                <div className='bg-background w-36 h-36 absolute rounded-full'></div>
                <div className='font-bold text-2xl z-10'>$
                    {budget ? (remainingBudget).toLocaleString('default', { minimumFractionDigits: 2 }) : (spent).toLocaleString('default', { minimumFractionDigits: 2 })}
                </div>
                {budget && <div className='text-sm opacity-70'>out of $
                    {budget?.amount.toLocaleString('default', { minimumFractionDigits: 2 })}
                </div>}
            </div>
        </div>
    )
}

export default BudgetCircularProgress