require('dotenv').config()
const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const chalk = require('chalk'); 

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const apiV1 = require('./server/api-v1');

const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.jieo9.mongodb.net/season_2021?retryWrites=true&w=majority`;
const log = console.log;

app.prepare().then( async() => {
  try {
    const server = express();
    await mongoose.connect(uri, options);
    server.use('/api/v1', apiV1);
    // server.use('/', (req, res) => {
    //   console.log('AllRequests');
    //   return handle(req, res)
    // })
    server.listen(port, (err) => {
      if (err) throw err
      log(chalk.white.bgGreen(`> Ready on http://localhost:${port}`))
    });
  } catch (error) {
    log.apply(chalk.red.red('Something happened'));
    console.log(error);
    return;
  }
})