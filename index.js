require('dotenv').config()

const database = require('./config/database');

database.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

const webSocketService = require("./services/webSocketService"); 

webSocketService.init(); 

// let formatMemoryUsage;
//   let memoryData;
//   let memoryUsage;
//   setInterval(() => {
//     formatMemoryUsage = (data) => `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

//     memoryData = process.memoryUsage();

//     memoryUsage = {
//       rss: `${formatMemoryUsage(
//         memoryData.rss,
//       )} -> Resident Set Size - total memory allocated for the process execution`,
//       heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
//       heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
//       external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
//     };
//     console.log(memoryUsage);
//   }, 3000);