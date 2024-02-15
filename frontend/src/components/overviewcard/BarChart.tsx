import { Bar } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js"
import type { ChartOptions } from "chart.js"
import { useState, useEffect, useRef } from "react"
import { useStore } from "@nanostores/react"
import { selectedDate } from "@/store/userStore"

interface Dataset {
    label: string,
    data: number[],
    backgroundColor: string
}

interface ExpenseData {
    labels: string[],
    datasets: Dataset[]
}

interface Props {
    expenseData: ExpenseData,
    title: string
}

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const BarChart: React.FC<Props> = ({ expenseData, title }) => {
    const $selectedDate = useStore(selectedDate)
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth)
    const chartRef = useRef<any>(null)
    const options = {
        indexAxis: screenWidth >= 640 ? 'x' : 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
                ticks: {
                    callback: function (value: number, index: number, values: unknown) {
                        if (screenWidth >= 640 && $selectedDate.yearOnly && months[value])
                            return months[value].slice(0, 3)
                        else if (screenWidth >= 640 && !$selectedDate.yearOnly)
                            return value + 1
                        else
                            return '$' + value
                    }
                },
            },
            y: {
                stacked: true,
                ticks: {
                    callback: function (value: number, index: number, values: unknown) {
                        if (screenWidth >= 640)
                            return '$' + value
                        else if ($selectedDate.yearOnly && months[value])
                            return months[value].slice(0, 3)
                        else
                            return value + 1
                    }
                },
            }
        },
        plugins: {
            legend: {
                display: false, // Hide the legend
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 16
                }
            }
        },
    }

    useEffect(() => {
        const updateScreenWidth = () => {
            setScreenWidth(window.innerWidth)
        }

        window.addEventListener('resize', updateScreenWidth)

        return () => {
            window.removeEventListener('resize', updateScreenWidth)
        }
    }, [])

    return (
        <div className="flex flex-col p-3 gap-1 w-full relative h-60 sm:h-72">
            {expenseData.labels.length &&
                <Bar data={expenseData}
                    ref={chartRef}
                    style={{
                        position: "absolute",
                        height: "auto",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)"
                    }}
                    options={options as ChartOptions<'bar'>} />}

        </div>
    )
}

export default BarChart