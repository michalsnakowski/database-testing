require('dotenv').config()

export const configDatabase_BeforeMigration = {
    user: process.env.DB_USERNAME_FIRST,
    password: process.env.DB_PASSWORD_FIRST,
    server: process.env.DB_SERVER_FIRST,
    database: process.env.DB_NAME_FIRST,
    options: {
      trustServerCertificate: true,
    }
  };

  export const configDatabase_AfterMigration = {
    user: process.env.DB_USERNAME_SECOND,
    password: process.env.DB_PASSWORD_SECOND,
    server: process.env.DB_SERVER_SECOND,
    database: process.env.DB_NAME_SECOND,
    options: {
      trustServerCertificate: true,
    }
  };