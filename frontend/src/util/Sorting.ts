interface Expense {
    id: number,
    name: string,
    categoryId: number,
    amount: number,
    day: number,
    month: number,
    year: number
}


export function mergeSort(expenses: Expense[], fields: (keyof Expense)[], mode: string): Expense[] {
    if (expenses.length <= 1) {
        return expenses;
    }

    const middle = Math.floor(expenses.length / 2);
    const left = expenses.slice(0, middle);
    const right = expenses.slice(middle);

    return merge(
        mergeSort(left, fields, mode),
        mergeSort(right, fields, mode),
        fields,
        mode
    );
}

function merge(left: Expense[], right: Expense[], fields: (keyof Expense)[], mode: string): Expense[] {
    let result: Expense[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    const reverse = mode === "desc";

    while (leftIndex < left.length && rightIndex < right.length) {
        let comparison = 0;

        for (let i = 0; i < fields.length; i++) {
            const leftValue = left[leftIndex][fields[i]];
            const rightValue = right[rightIndex][fields[i]];

            if (leftValue < rightValue) {
                comparison = reverse ? 1 : -1;
                break;
            } else if (leftValue > rightValue) {
                comparison = reverse ? -1 : 1;
                break;
            }
        }

        if (comparison < 0) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}