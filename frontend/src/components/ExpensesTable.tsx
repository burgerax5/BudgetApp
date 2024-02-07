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
import { ChevronsUp, ChevronsDown } from 'lucide-react'

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
    id: number,
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
    keys: (keyof Expense)[],
    mode: "none" | "asc" | "desc"
}

const defaultHeaders: Header[] = [
    { name: "Expense", keys: ["name"], mode: "none" },
    { name: "Category", keys: ["categoryId"], mode: "none" },
    { name: "Date", keys: ["year", "month", "day"], mode: "none" },
    { name: "Amount", keys: ["amount"], mode: "none" },
]

const ExpensesTable: React.FC<Props> = ({ take, showCheckbox, filteredExpenses }) => {
    const $expenses = useStore(expenses)
    const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([])
    const [headers, setHeaders] = useState<Header[]>(defaultHeaders)

    useEffect(() => {
        getExpenses()
    }, [])

    const shiftMode = (currMode: string) => {
        const cycle = ["none", "asc", "desc"]
        const index = cycle.findIndex((el) => el === currMode)
        return cycle[(index + 1) % 3]
    }

    const getExpenses = async () => {
        const res = await axios.get(`/expense/${take ? `?take=${take}` : ``}`, { withCredentials: true })
        if (res.data) expenses.set(res.data.expenses)
    }

    const getDate = (expense: Expense) => {
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

    return (
        <Table>
            <TableHeader className="text-white">
                <TableRow>
                    {showCheckbox && <TableHead>
                        <Checkbox
                            checked={selectedExpenses.length > 0 && selectedExpenses.length === $expenses.length}
                            onCheckedChange={checkAllCheckboxes} />
                    </TableHead>}
                    {headers.map((header, i) => (
                        <TableHead
                            key={header.name}
                            onClick={() => {
                                if (filteredExpenses) {
                                    setHeaders((prevHeaders) => {
                                        const newHeaderState = { ...defaultHeaders[i], mode: shiftMode(prevHeaders[i].mode) }
                                        filteredExpensesStore.set(mergeSort(filteredExpenses, header.keys, newHeaderState.mode))
                                        return defaultHeaders.slice(0, i).concat(newHeaderState).concat(defaultHeaders.slice(i + 1))
                                    })
                                }
                            }}
                        >
                            <div className="flex items-center gap-2">
                                {header.name}
                                {header.mode === "none" && <div className="h-4 w-4"></div>}
                                {header.mode === "asc" && <ChevronsUp className="h-4 w-4" />}
                                {header.mode === "desc" && <ChevronsDown className="h-4 w-4" />}
                            </div>
                        </TableHead>
                    ))}
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
                        <TableCell>${expense.amount.toLocaleString('default', {
                            minimumFractionDigits: 2
                        })}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ExpensesTable