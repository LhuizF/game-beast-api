import app from './config/app';
import cron from './config/cron';
import { makePlayResult } from './factories/playResult';

app.listen(process.env.PORT || 3333, () => {
  console.log(`Server started on port ${process.env.PORT}`);
  cron('0 10,15,20 * * *', makePlayResult()).start();
});
