// this file contains functions that download and compare data between two databases
import * as sql from 'mssql';
import { test, expect } from '@playwright/test';
require('dotenv').config()
const util = require('util')
import { configDatabase_BeforeMigration }  from '../databases-config'
import { configDatabase_AfterMigration } from '../databases-config'

// USING THIS FUNCTION IS NOT RECOMMENDED FOR CHECKING LARGE TABLES
export async function getValueFromColumnAndCompare(column, tableName, columnInCondition, valueInCondition) {
  // target query based on functions parameters = `select ${column} from ${tableName} where ${columnInCondition} = ${valueInCondition}`
  let selectColumnQuery = `select ${column} from ${tableName} where ${columnInCondition} = ${valueInCondition}`

  // connecting with first database (before migration), downloading value from selected column 
  let firstDatabaseConnection = await sql.connect(configDatabase_BeforeMigration);
  console.log('Connected to the database: ' + configDatabase_BeforeMigration.database)
  let row_BeforeMigration = await (sql.query(selectColumnQuery))
  let downloadedValue_BeforeMigration = JSON.stringify(row_BeforeMigration.recordset)
  console.log("Query that was sent to database: " + configDatabase_BeforeMigration.database, '\n', selectColumnQuery)
  console.log("Downloaded value before migration: " + downloadedValue_BeforeMigration)

  // close connection from first database (before migration)
  await firstDatabaseConnection.close()
  console.log('Disconnected from the database: ' + configDatabase_BeforeMigration.database);

  // connecting with second database (after migration), downloading value from selected column 
  let secondDatabaseConnection = await sql.connect(configDatabase_AfterMigration);
  console.log('Connected to the database: ' + configDatabase_AfterMigration.database);
  let row_AfterMigration = await (sql.query(selectColumnQuery))
  let downloadedValue_AfterMigration = JSON.stringify(row_AfterMigration.recordset)
  console.log("Query that was sent to database: " + configDatabase_AfterMigration.database, '\n', selectColumnQuery)
  console.log("Downloaded value after migration: " + downloadedValue_AfterMigration)

  // close connection from second database (after migration)
  await secondDatabaseConnection.close()
  console.log('Disconnected from the database: ' + configDatabase_AfterMigration.database);

  //soft assertion - comparing values for selected column before and after migration,
  expect.soft(downloadedValue_AfterMigration,
    "\nThere is difference between dowloaded values for column: " + column + " for object ID = " + valueInCondition +
    '\n' + "Query that was sent to both databases: " + selectColumnQuery
    + '\n' + "Value downloaded before migration: " + downloadedValue_BeforeMigration
    + '\n' + "Value downloaded after migration: " + downloadedValue_AfterMigration
  ).toEqual(downloadedValue_BeforeMigration)
}

export async function getAndCompareValuesFromColumns(columnList, tableName, columnInCondition, valueInCondition) {
  let QueriesListSentToDB: string[] = []
  let valuesListBeforeMigration: string[] = []
  let valuesListAfterMigration: string[] = []

  // generating SQL queries that will be sent to both databases and adding them to array (for displaying custom message in assertions needs)
  for (let index in columnList) {
    let selectColumnQuery = `select ${columnList[index]} from ${tableName} where ${columnInCondition} = ${valueInCondition}`
    QueriesListSentToDB.push(selectColumnQuery)
  }
  console.log("\n ALL QUERIES THAT WILL BE SENT TO BOTH DATABASES FOR DOWNLOADING DATAS FOR OBJECT ID: " + valueInCondition)
  console.log(util.inspect(QueriesListSentToDB, { maxArrayLength: null }))

  // connecting with main database (before migration), downloading values from column list and and adding them to array
  let firstDatabaseConnection = await sql.connect(configDatabase_BeforeMigration);
  console.log('Connected to the database: ' + configDatabase_BeforeMigration.database)

  for (let index in columnList) {
    let selectColumnQuery = `select ${columnList[index]} from ${tableName} where ${columnInCondition} = ${valueInCondition}`
    let row_BeforeMigration = await (sql.query(selectColumnQuery))
    let downloadedValue_BeforeMigration = JSON.stringify(row_BeforeMigration.recordset)
    valuesListBeforeMigration.push(downloadedValue_BeforeMigration)
  }
  console.log("\n ALL DOWNLOADED VALUES BEFORE MIGRATION FOR OBJECT ID: " + valueInCondition, "\n")
  console.log(util.inspect(valuesListBeforeMigration, { maxArrayLength: null }))

  // close connection from first database (before migration)
  await firstDatabaseConnection.close()
  console.log('Disconnected from the database: ' + configDatabase_BeforeMigration.database);

  // connecting with second database (after migration), downloading values from column list and and adding them to array
  let secondDatabaseConnection = await sql.connect(configDatabase_AfterMigration);
  console.log('Connected to the database: ' + configDatabase_AfterMigration.database);
  for (let index in columnList) {
    let selectColumnQuery = `select ${columnList[index]} from ${tableName} where ${columnInCondition} = ${valueInCondition}`
    let row_AfterMigration = await (sql.query(selectColumnQuery))
    let downloadedValue_AfterMigration = JSON.stringify(row_AfterMigration.recordset)
    valuesListAfterMigration.push(downloadedValue_AfterMigration)
  }
  console.log("\n ALL DOWNLOADED VALUES AFTER MIGRATION FOR OBJECT ID: " + valueInCondition, "\n")
  console.log(util.inspect(valuesListAfterMigration, { maxArrayLength: null }))

  // close connection from v2 database (after migration)
  await secondDatabaseConnection.close()
  console.log('Disconnected from the database: ' + configDatabase_AfterMigration.database);
  //soft assertion - comparing values for column list before and after migration
  for (let index in columnList) {
    await expect.soft(valuesListAfterMigration[index],
      "\nThere is difference between dowloaded values for column: " + columnList[index] + " for object ID = " + valueInCondition +
      '\n' + "Query that was sent to both databases: " + QueriesListSentToDB[index]
      + '\n' + "Value downloaded before migration: " + valuesListBeforeMigration[index]
      + '\n' + "Value downloaded after migration: " + valuesListAfterMigration[index]
    ).toEqual(valuesListBeforeMigration[index])
  }
  // removing all values from arrays (after executing all assertions)
  QueriesListSentToDB.length = 0
  valuesListBeforeMigration.length = 0
  valuesListAfterMigration.length = 0
}