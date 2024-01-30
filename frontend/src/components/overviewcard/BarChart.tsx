import { Bar } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"
import { useEffect, useRef } from "react"

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
    const chartRef = useRef<any>(null)

    // const handleResize = (chart: any, size: {
    //     width: number;
    //     height: number;
    // }) => {

    //     console.log("SHIT")
    // };

    // useEffect(() => {
    //     const handleResize = () => {
    //         // Access the Chart.js instance and update its size

    //         console.log("RESIZED")
    //         if (chartInstance) {
    //             chartInstance.resize();
    //         }
    //     };

    //     // Attach the resize event listener
    //     window.addEventListener('resize', handleResize);

    //     // Clean up the event listener on component unmount
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, [])

    return (
        <div className="flex flex-col gap-1 w-full relative h-36 sm:h-60">
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
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        onResize: (chartInstance, newSize) => {
                            console.log("Chart resized")
                        }
                    }} />}
        </div>
    )
}

export default BarChart