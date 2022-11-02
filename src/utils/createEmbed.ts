import { GameResult } from '../presentation/protocols/play-result';
import { time } from './game-time';

export const createEmbed = (result: GameResult): Embed[] => {
  const timeHour = time[result.game.time as keyof typeof time];

  return [
    {
      title: `Game número: ${result.game.id}`,
      description: `Game número: ${result.game.id}`,
      color: '16730421',
      fields: [
        {
          name: 'Animal sorteado',
          value: `N°${result.beastWin.id} ${result.beastWin.name}`
        },
        {
          name: 'Total de apostas',
          value: result.totalBets.toString()
        },
        {
          name: 'Total de Ganhadores',
          value: result.winners.length.toString(),
          inline: true
        },
        {
          name: 'Total de Ganhadores',
          value: result.winners.length.toString(),
          inline: true
        }
      ],
      footer: {
        text: `Horário: ${timeHour}`
      }
    }
  ];
};

interface Embed {
  title: string;
  description: string;
  color: string;
  fields: Field[];
  footer: {
    text: string;
  };
}

interface Field {
  name: string;
  value: string;
  inline?: boolean;
}
