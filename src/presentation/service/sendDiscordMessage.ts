import { SendMessage } from '../protocols/send-message';
import { GuildModel } from '../../domain/models';
import { GameData, IDiscordEmbed } from '../protocols/IDiscordEmbed';
import { GameResult } from '../protocols/play-result';
import { discordApi } from '../../utils/discord';

export class SendMessageDiscord implements SendMessage {
  constructor(private readonly discordEmbed: IDiscordEmbed) {}

  async send(data: GameResult, guilds: GuildModel[]) {
    const { game, beastWin: beast, totalBets, winners, losers } = data;

    console.log(`Total of ${guilds.length} guilds`);

    guilds.forEach((guild, i) => {
      const gameDD: GameData = {
        roleId: guild.role,
        gameNumber: game.id,
        result: {
          name: beast.name,
          number: beast.id
        },
        bets: {
          total: totalBets,
          wins: winners.length,
          loses: losers
        },
        gameTime: game.time
      };

      const message = this.discordEmbed.createEmbed(gameDD);

      discordApi
        .post(`channels/${guild.channel}/messages`, { ...message })
        .then(() => {
          console.log(`SEND DISCORD GUILD ${guild.name}`);
        })
        .catch((err) => {
          console.log('error', err);
        });
    });
  }
}
