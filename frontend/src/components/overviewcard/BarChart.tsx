import { Bar } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"

interface Dataset {
    label: string,
    data: number[],
    backgroundColor: string
}

interface ExpenseData {
    labels: number[],
    datasets: Dataset[]
}

interface Props {
    expenseData: ExpenseData
}

const BarChart: React.FC<Props> = ({ expenseData }) => {
    return (
        <div className="flex flex-col gap-1">
            {expenseData.labels.length && <Bar data={expenseData} />}
        </div>
    )
}

export default BarChart