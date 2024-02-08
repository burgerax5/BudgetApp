import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { expensesByCategory } from '@/store/userStore'
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

    // const data = {
    //     labels: ['a', 'b'],
    //     datasets: [{
    //         label: "Expenses by Category",
    //         data: Object.values($expensesByCategory),
    //         backgroundColor: [
    //             'rgb(255, 99, 132)',
    //             'rgb(54, 162, 235)',
    //             'rgb(255, 205, 86)'
    //         ],
    //     }]
    // }

    const isDarkMode = localStorage.getItem("theme") === "dark"
    const background = isDarkMode ? "hsl(222.2, 84%, 4.9%)" : "hsl(0, 0%, 100%)"
    const primary = isDarkMode ? "hsl(217.2, 91.2%, 59.8%)" : "hsl(221.2, 83.2%, 53.3%)"
    const accent = isDarkMode ? "hsl(217.2, 32.6%, 17.5%)" : "hsl(210, 40%, 96.1%)"

    const data = {
        labels: ["Remaining", "Spent"],
        datasets: [{
            label: "Amount",
            data: [remainingBudget, spent],
            backgroundColor: [
                primary,
                accent,
            ],
            borderColor: [background]
        },
            // {
            //     label: "Hi"
            // }
        ],
    }

    useEffect(() => {
        const percentage = budget ? ((budget.amount - spent) / budget.amount) * 100 : 0
        setProgress(percentage)
    }, [budget, spent, progress])

    return (
        <>
            <div className={`rounded-full w-full h-full absolute flex items-center justify-center mt-3.5`}>
                <div className='flex flex-col items-center justify-center'>
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
            <div className="flex items-center justify-center relative w-full h-full">
                <Doughnut
                    options={{ cutout: 80 }}
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