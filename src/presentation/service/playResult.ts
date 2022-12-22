import { Result, PlayResult, BetsResult } from '../protocols/play-result';
import { HelperDb } from '../../data/protocols/helperDb';
import { WinBeast } from '../../data/protocols/winBeast';
import { BeastModel, GameModel } from '../../domain/models';
import { CreateGame } from '../../domain/usecases/create-game';
import { DiscordEmbed } from '../../utils/discordEmbed';
import { GameData } from '../protocols/IDiscordEmbed';
import fs from 'fs';
import path from 'path';

class PlayResultService implements PlayResult {
  constructor(
    private readonly helperDb: HelperDb,
    private readonly winBeast: WinBeast,
    private readonly crateGame: CreateGame,
    private readonly discordEmbed: DiscordEmbed
  ) {}

  async play(): Promise<Result> {
    const beasts = await this.helperDb.getAllBeast();
    const game = await this.helperDb.getCurrentGame();

    if (beasts.length === 0 || !game) {
      console.log('vai ser um erro');
      return {
        isSuccess: false,
        data: {
          date: new Date(),
          body: {
            beasts,
            game
          }
        },
        channels: []
      };
    }

    const beast = this.beastSelected(beasts);

    const { totalBets, winners, losers } = await this.winBeast.addWin(game.id, beast.id);

    const channels = await this.winBeast.getChannels();

    await this.crateGame.nextGame();
    await this.sendMessageResult(game, beast, { totalBets, winners, losers });

    return {
      isSuccess: true,
      data: {
        game,
        beastWin: beast,
        totalBets,
        winners,
        losers
      },
      channels
    };
  }

  beastSelected(beasts: BeastModel[]): BeastModel {
    const index = Math.floor(Math.random() * beasts.length);
    return beasts[index];
  }

  async sendMessageResult(game: GameModel, beast: BeastModel, bets: BetsResult) {
    const guilds = await this.helperDb.getAllGuildActive();

    guilds.forEach((guild, i) => {
      const gameDD: GameData = {
        roleId: guild.role,
        gameNumber: game.id,
        result: {
          name: beast.name,
          number: beast.id
        },
        bets: {
          total: bets.totalBets,
          wins: bets.winners.length,
          loses: bets.losers
        },
        gameTime: game.time
      };
      const message = this.discordEmbed.createEmbed(gameDD);

      //fs.writeFileSync(path.join(__dirname, `text${i}.txt`), JSON.stringify(message));
    });
  }
}

export default PlayResultService;
