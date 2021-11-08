require('dotenv').config()
import express, { Express } from 'express';

import next, {NextApiHandler} from 'next';
import { parse as parseUrl } from 'url';
import mongoose  from 'mongoose';
import chalk from 'chalk';
import cors from 'cors';

import { NextServer } from 'next/dist/server/next';
import apiV1 from './server/routes/api';

const port: Number = parseInt(process.env.PORT, 10) || 8080;
const dev: boolean = process.env.NODE_ENV !== 'production';
const nextApp: NextServer = next({ dev });

const uri: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.jieo9.mongodb.net/season_2021?retryWrites=true&w=majority`;
const log: Function = console.log;

nextApp.prepare().then( async() => {
  try {
    const server: Express = express();
    const serverHandler: any = (err:any) => {
      if (err) throw err
      log(chalk.white.bgGreen(`> Ready on http://localhost:${port}`));
    };
    await mongoose.connect(uri);
    server.use(express.json());
    server.use(cors());
    server.use('/api/v1', apiV1);

    server.get('/*', (req, res)  => {
      const { pathname, query } = parseUrl(req.url, true);
      console.log('App server star',pathname, query);
      return  nextApp.render(req, res, pathname, query);
      // return handle(req, res, parseUrl(req.url, true));
    });
    server.listen(port, serverHandler);
  } catch (error) {
    log.apply(chalk.red.red('Something happened'));
    console.log(error);
    return;
  }
})