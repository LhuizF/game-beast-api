import { CronJob } from 'cron';
import { PlayResult } from '../../presentation/protocols/play-result';

const cron = (time: string, playResult: PlayResult): CronJob => {
  console.log('run Corn');
  return new CronJob(
    time,
    async () => {
      await playResult.play();
    },
    null,
    true,
    'America/Sao_Paulo'
  );
};

export default cron;
