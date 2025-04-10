# database-testing

Repository was created for database testing purposes (for example migration testing between two databases).
This solution is based on using node.js library called node-mssql (that allows connect to MSSQL databases and download data from them, etc.), and Plawyright (by using soft assertions, thanks to which test won't be terminated after failing assertions).
Thanks to that it will be easier to compare some datas before and after migration.
Using library node-mssql is limited to having maximum one active connection to one database at the same time. It means that without disconnecting from first database, futher queries won't be sent to second database (because there will be try to use only existing connection that is active at the moment.)

## Before starting

1) After cloning repository please run command in terminal (that will install all required dependencies): "npm install"
2) Afer that you need to create in root folder, file called ".env" It should include personal credentials that are needed to connect into databases. Credentials should be provided in format that is displayed in file ".env example".
3) For running test explorer run command in terminal "npx playwright test --ui"
4) If you want to check and compare data for multiple objects - then is recommended to increase timeout in "playwright.config.ts" file.