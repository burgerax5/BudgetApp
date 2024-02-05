import axios from '@/api/axios'
import { useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { expenses, filteredExpenses as filteredExpensesStore } from '@/store/userStore'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from './ui/checkbox'
import { mergeSort } from '@/util/Sorting'

interface expenseDetails {
    name: string,
    categoryId: number,
    amount: number,
    day: number,
    month: number,
    year: number
}

enum Category {
    "Food & Drink" = 1,
    Entertainment,
    Transportation,
    Health,
    Education,
    Housing,
    Utilities,
    Insurance,
    "Debt Repayment",
    Clothing,
    Miscellaneous
}

interface Expense {
    name: string,
    categoryId: number,
    amount: number,
    day: number,
    month: number,
    year: number
}

interface Props {
    take: number | undefined,
    showCheckbox: boolean,
    filteredExpenses?: Expense[]
}

interface Expense {
    name: string,
    categoryId: number,
    amount: number,
    day: number,
    month: number,
    year: number
}

interface Header {
    name: string,
    key: keyof Expense,
    reverse: boolean
}

const ExpensesTable: React.FC<Props> = ({ take, showCheckbox, filteredExpenses }) => {
    const $expenses = useStore(expenses)
    const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([])
    const [headers, setHeaders] = useState<Header[]>([
        { name: "Expense", key: "name", reverse: false },
        { name: "Category", key: "categoryId", reverse: false },
        { name: "Date", key: "day", reverse: false },
        { name: "Amount", key: "amount", reverse: false },
    ])

    useEffect(() => {
        getExpenses()
    }, [])

    const getExpenses = async () => {
        const res = await axios.get(`/expense/${take ? `?take=${take}` : ``}`, { withCredentials: true })
        if (res.data) expenses.set(res.data.expenses)
    }

    const getDate = (expense: expenseDetails) => {
        const date = new Date(expense.year, expense.month - 1, expense.day)
        return `${date.getDate()} ${date?.toLocaleDateString('default', { month: 'short' })} ${date.getFullYear()}`
    }

    const handleCheckboxChange = (expense: Expense) => {
        if (!selectedExpenses.includes(expense))
            setSelectedExpenses([...selectedExpenses, expense])
        else
            setSelectedExpenses(prevSelected => prevSelected.filter(prev => prev !== expense))
    }

    const checkAllCheckboxes = () => {
        if (selectedExpenses.length)
            setSelectedExpenses([])
        else
            setSelectedExpenses($expenses)
    }

    useEffect(() => {

    }, [filteredExpenses])

    return (
        <Table>
            <TableHeader className="text-white">
                <TableRow>
                    {showCheckbox && <TableHead>
                        <Checkbox
                            checked={selectedExpenses.length === $expenses.length}
                            onCheckedChange={checkAllCheckboxes} />
                    </TableHead>}
                    {headers.map((header, i) => (
                        <TableHead
                            onClick={() => {
                                if (filteredExpenses) {
                                    setHeaders(prevHeaders => {
                                        const newHeaderState = { ...prevHeaders[i], reverse: !prevHeaders[i].reverse }
                                        filteredExpensesStore.set(mergeSort(filteredExpenses, header.key, newHeaderState.reverse))
                                        return prevHeaders.slice(0, i).concat(newHeaderState).concat(prevHeaders.slice(i + 1))
                                    })
                                }
                            }}
                        >
                            {header.name}
                        </TableHead>
                    ))}
                    {/* <TableHead
                        onClick={() => {
                            if (filteredExpenses)
                                console.log(mergeSort(filteredExpenses, "name"))
                        }}
                        className="cursor-pointer">
                        <div className="flex gap-3">
                            Expense
                        </div>
                    </TableHead>
                    <TableHead
                        onClick={() => {
                            if (filteredExpenses)
                                console.log(mergeSort(filteredExpenses, "categoryId"))
                        }}
                        className="w-[150px] cursor-pointer">
                        Category
                    </TableHead>
                    <TableHead
                        className="cursor-pointer">
                        Date
                    </TableHead>
                    <TableHead
                        onClick={() => {
                            if (filteredExpenses)
                                filteredExpensesStore.set(mergeSort(filteredExpenses, "amount"))
                        }}
                        className="text-right cursor-pointer">
                        Amount
                    </TableHead> */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredExpenses && filteredExpenses.map(expense => (
                    <TableRow key={crypto.randomUUID()}>
                        {showCheckbox && <TableCell>
                            <Checkbox
                                checked={selectedExpenses.includes(expense)}
                                onCheckedChange={() => handleCheckboxChange(expense)} />
                        </TableCell>}
                        <TableCell className="font-medium">{expense.name}</TableCell>
                        <TableCell>{Category[expense.categoryId]}</TableCell>
                        <TableCell>{getDate(expense)}</TableCell>
                        <TableCell className="text-right">${expense.amount.toLocaleString('default', {
                            minimumFractionDigits: 2
                        })}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ExpensesTable