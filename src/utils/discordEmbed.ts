import {
  DiscordMessage,
  GameData,
  IDiscordEmbed
} from '../presentation/protocols/IDiscordEmbed';
import { time } from './game-time';

export class DiscordEmbed implements IDiscordEmbed {
  createEmbed(data: GameData): DiscordMessage {
    const timeHour = time[data.gameTime as keyof typeof time];
    const content = `||<@&${data.roleId}>||`;
    const embed = [
      {
        title: `Resultado do jogo número ${data.gameNumber}`,
        description: `Animal sorteado: **${data.result.name} N°${data.result.number}**`,
        color: '16730421',
        fields: [
          {
            name: 'Total de apostas',
            value: data.bets.total.toString()
          },
          {
            name: 'Total de Ganhadores',
            value: data.bets.wins.toString(),
            inline: true
          },
          {
            name: 'Total de Ganhadores',
            value: data.bets.loses.toString(),
            inline: true
          }
        ],
        footer: {
          text: `Horário: ${timeHour} ${data.gameTime}`
        }
      }
    ];

    return { content, embed };
  }
}
