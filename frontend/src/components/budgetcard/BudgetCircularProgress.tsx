import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { expensesByCategory, isDarkMode } from '@/store/userStore'
import { useStore } from '@nanostores/react'

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
    const $expensesByCategory = useStore(expensesByCategory)
    const $isDarkMode = useStore(isDarkMode)
    const [background, setBackground] = useState($isDarkMode ? "hsl(222.2, 84%, 4.9%)" : "hsl(0, 0%, 100%)")
    const [primary, setPrimary] = useState($isDarkMode ? "hsl(217.2, 91.2%, 59.8%)" : "hsl(221.2, 83.2%, 53.3%)")
    const [accent, setAccent] = useState($isDarkMode ? "hsl(217.2, 32.6%, 17.5%)" : "hsl(210, 40%, 96.1%)")

    useEffect(() => {
        setBackground($isDarkMode ? "hsl(222.2, 84%, 4.9%)" : "hsl(0, 0%, 100%)")
        setPrimary($isDarkMode ? "hsl(217.2, 91.2%, 59.8%)" : "hsl(221.2, 83.2%, 53.3%)")
        setAccent($isDarkMode ? "hsl(217.2, 32.6%, 17.5%)" : "hsl(210, 40%, 96.1%)")
    }, [$isDarkMode])

    const data = {
        labels: ["Remaining", ...Object.keys($expensesByCategory)],
        datasets: [{
            label: "Amount",
            data: [remainingBudget, ...Object.values($expensesByCategory)],
            backgroundColor: [
                primary, // Remaining budget
                "#FF5733", // Food & Drink
                "#FFA500", // Entertainment
                "#FF8C00", // Transportation
                "#FF6347", // Health
                "#8A2BE2", // Education
                "#2E8B57", // Housing
                "#4169E1", // Utilities
                "#800080", // Insurance
                "#DC143C", // Debt Repayment
                "#FF4500", // Clothing
                "#A9A9A9", //Miscellaneous
            ],
            borderColor: [background]
        }],
    }

    useEffect(() => {
        const percentage = budget ? ((budget.amount - spent) / budget.amount) * 100 : 0
        setProgress(percentage)
    }, [budget, spent, progress])

    return (
        <>
            <div className={`rounded-full w-full h-full absolute flex items-center justify-center`}>
                <div className='flex flex-col items-center justify-center'>

                    <div className='font-bold text-2xl'>$
                        {budget ? (remainingBudget).toLocaleString('default', { minimumFractionDigits: 2 }) : (spent).toLocaleString('default', { minimumFractionDigits: 2 })}
                    </div>
                    <div className='text-sm opacity-70'>
                        {budget ?
                            `out of ${budget?.amount.toLocaleString('default', { minimumFractionDigits: 2 })}`
                            : `spent this ${period}`}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center relative w-full h-full">
                <Doughnut
                    options={{
                        cutout: 80,
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }}
                    style={{
                        position: "absolute",
                        height: "auto",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)"
                    }}
                    data={data}
                />
            </div>
        </>
    )
}

export default BudgetCircularProgress