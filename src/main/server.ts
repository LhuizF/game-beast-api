import dotenv from 'dotenv';
import app from './config/app';
import cron from './config/cron';
import { makePlayResult } from './factories/playResult';
dotenv.config();

const time = '0 10,15,20 * * *';

app.listen(process.env.PORT || 3333, () => {
  console.log(`Server started on port ${process.env.PORT}`);
  cron(time, makePlayResult()).start();
});
