import { test, expect } from '@playwright/test';
import { getAndCompareValuesFromColumns } from '../../helpers/migration-testing'

// common configuration for both tests
let columnList: string[] = [ //columns that exist in both databases (before and after migration)
    "Column A",
    "Column B",
    "Column C",
    "Column ...",
    "Column n"
]

let table = "tableName"
let uniqueColumn = "ID"

test('Compare data for single object ID from specific table', async ({ }) => {
    // PLEASE PROVIDE OBJECT ID, FOR WHICH YOU WANT TO CHECK AND COMPARE DATA
    let objectID = 1
    await getAndCompareValuesFromColumns(columnList, table, uniqueColumn, objectID)
});

test('Compare data for multiple objects IDs from specific table', async ({ }) => {
    // PLEASE PROVIDE OBJECTS IDs, FOR WHICH YOU WANT TO CHECK AND COMPARE DATA
    let objectList: number[] = [
        1,
        2,
        3
    ]

    for (let index in objectList) {
        await getAndCompareValuesFromColumns(columnList, table, uniqueColumn, objectList[index])
    }
});