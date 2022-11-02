import { CronJob } from 'cron';
import { GameResult, PlayResult } from '../../presentation/protocols/play-result';
import { discordApi } from '../../services';
import { createEmbed } from '../../utils/createEmbed';

const cron = (time: string, playResult: PlayResult): CronJob => {
  console.log('run Cron');
  return new CronJob(
    time,
    async () => {
      const { isSuccess, data, channels } = await playResult.play();
      if (isSuccess) {
        const result = data as GameResult;

        const body = {
          allowed_mentions: {
            //  roles: ['1031346220318334976']
          },
          embeds: createEmbed(result)
        };

        channels.forEach(async (channel) => {
          await discordApi
            .post(`/channels/${channel}/messages`, body, {
              headers: {
                Authorization: 'Bot ' + process.env.DISCORD_TOKEN
              }
            })
            .catch((err) => {
              console.error(err);
            });
        });

        return;
      }

      console.log('Add error log');
    },
    null,
    true,
    'America/Sao_Paulo'
  );
};

export default cron;
