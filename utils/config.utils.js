require("dotenv").config(); 
const configs = {
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    databaseName: process.env.DATABASE_NAME,
  },
  api: {
    KEY: process.env.API_KEY,
    SECRET: process.env.SECRET_KEY,
  },
};

module.exports = configs;
