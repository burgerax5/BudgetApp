import { Bar } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"
import { useEffect, useRef } from "react"

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

const BarChart: React.FC<Props> = ({ expenseData, title }) => {
    const chartRef = useRef<any>(null)
    const options = {
        // indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                ticks: {
                    callback: function (value: unknown, index: unknown, values: unknown) {
                        return '$' + value
                    }
                },
            }
        },
        plugins: {
            legend: {
                display: false, // Hide the legend
                // position: 'right' as const,
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
                    options={options} />}

        </div>
    )
}

export default BarChart