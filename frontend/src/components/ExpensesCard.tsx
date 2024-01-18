import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function ExpensesCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Expenses</CardTitle>
                <CardDescription>Your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
            {/* <CardFooter className='justify-end'>
                <DialogButton />
            </CardFooter> */}
        </Card>
    )
}

export default ExpensesCard