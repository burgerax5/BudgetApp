import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ExpensesTable from '../ExpensesTable'
import { Button } from "../ui/button"

const SpendingCard = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center justify-between">
                        Spendings
                        <Button variant="outline" className="font-bold" asChild>
                            <a href="/expenses">View More...</a>
                        </Button>
                    </div>
                </CardTitle>
                <CardDescription>Your recent expenses</CardDescription>
            </CardHeader>
            <CardContent>
                <ExpensesTable take={5} />
            </CardContent>

        </Card>
    )
}

export default SpendingCard