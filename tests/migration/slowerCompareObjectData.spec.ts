import { test, expect } from '@playwright/test';
import { getValueFromColumnAndCompare } from '../../helpers/migration-testing'

test('Compare data for specific object from specific table', async ({}) => {
    let commonColumns: string[] = [ //columns that exist in both databases (before and after migration)
        "Column A",
        "Column B",
        "Column C",
        "Column ...",
        "Column n"
    ]

    let table = "tableName"
    let uniqueColumn = "ID"
    let objectID = 1 // PLEASE PROVIDE OBJECT ID, FOR WHICH YOU WANT TO CHECK AND COMPARE DATA

// repeat operation for each column
for(let index in commonColumns)
    { 
        await getValueFromColumnAndCompare(commonColumns[index], table, uniqueColumn, objectID)
    }
});