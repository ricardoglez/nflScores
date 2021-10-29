const express = require('express');
const next = require('next');
const clientPromise = require('./utils/mongodb');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const chalk = require('chalk'); 
const log = console.log;
app.prepare().then( async() => {
  try {
    const server = express();
    const client = await clientPromise;
    log( chalk.white.bgBlue('DB is connected'));
    server.all('/', (req, res) => {
      return handle(req, res)
    })
    server.listen(port, (err) => {
      if (err) throw err
      log(chalk.white.bgGreen(`> Ready on http://localhost:${port}`))
    });
    server.get('/api', () => {
      
    });
  } catch (error) {
    log.apply(chalk.red.red('Something happened'));
    console.log(error);
    return;
  }
})