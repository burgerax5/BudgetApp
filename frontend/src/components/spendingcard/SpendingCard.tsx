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

const SpendingCard = () => {
    const $expenses = useStore(expenses)

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Spendings
                </CardTitle>
                <CardDescription>Your recent expenses</CardDescription>
            </CardHeader>
            <CardContent>
                <ExpensesTable take={5} showCheckbox={false} filteredExpenses={$expenses} />
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