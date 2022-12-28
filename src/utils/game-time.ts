import { GameTime } from '../presentation/protocols/game-time';

export class GameTimeAdapter implements GameTime {
  getNext(): number {
    const now = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    const [hour, min, seconds] = now.split(':');
    const currentSeconds = Number(hour) * 3600 + Number(min) * 60 + Number(seconds);

    const time = (() => {
      if (currentSeconds >= 72000) return 1;
      if (currentSeconds >= 54000) return 3;
      return 2;
    })();

    console.log({
      now,
      currentSeconds,
      time
    });

    return time;
  }
}

export const time = {
  1: 'Manha',
  2: 'Tarde',
  3: 'Noite'
};
