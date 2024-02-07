interface Expense {
    id: number,
    name: string,
    categoryId: number,
    amount: number,
    day: number,
    month: number,
    year: number
}


export function mergeSort(expenses: Expense[], fields: (keyof Expense)[], reverse: boolean = false): Expense[] {
    if (expenses.length <= 1) {
        return expenses;
    }

    const middle = Math.floor(expenses.length / 2);
    const left = expenses.slice(0, middle);
    const right = expenses.slice(middle);

    return merge(
        mergeSort(left, fields, reverse),
        mergeSort(right, fields, reverse),
        fields,
        reverse
    );
}

function merge(left: Expense[], right: Expense[], fields: (keyof Expense)[], reverse: boolean): Expense[] {
    let result: Expense[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    for (let i = 0; i < fields.length; i++) {
        while (leftIndex < left.length && rightIndex < right.length) {
            const leftValue = left[leftIndex][fields[i]];
            const rightValue = right[rightIndex][fields[i]];

            if ((reverse && leftValue > rightValue) || (!reverse && leftValue < rightValue)) {
                result.push(left[leftIndex]);
                leftIndex++;
            } else {
                result.push(right[rightIndex]);
                rightIndex++;
            }
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}
