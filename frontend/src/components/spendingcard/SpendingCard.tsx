import axios from "@/api/axios"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { expenses } from "@/store/userStore"
import { useStore } from "@nanostores/react"
import ExpensesTable from '../ExpensesTable'
import { Button } from "../ui/button"
import { useEffect } from "react"

const SpendingCard = () => {
    const $expenses = useStore(expenses)

    const getExpenses = async () => {
        await axios.get('/expense/', { withCredentials: true })
            .then(res => {
                if (res.data.expenses) {
                    console.log()
                    expenses.set(res.data.expenses)
                }
            })
    }

    useEffect(() => {
        getExpenses()
    }, [$expenses])

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Spendings
                </CardTitle>
                <CardDescription>Your recent expenses</CardDescription>
            </CardHeader>
            <CardContent>
                {$expenses.length ?
                    <ExpensesTable take={5} showCheckboxAndToolbar={false} filteredExpenses={$expenses} />
                    : <div>You have not added any expenses.</div>}
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="ml-auto font-bold" asChild>
                    <a href="/expenses">View More...</a>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default SpendingCard