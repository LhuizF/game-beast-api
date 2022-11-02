import { GameTime } from '../presentation/protocols/game-time';

export class GameTimeAdapter implements GameTime {
  getNext(): number {
    const now = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const [hour, min, seconds] = now.split(':');
    const currentSeconds = Number(hour) * 3600 + Number(min) * 60 + Number(seconds);

    if (currentSeconds <= 36000) return 2;
    if (currentSeconds <= 54000) return 3;
    return 1;
  }
}

export const time = {
  1: 'Manha',
  2: 'Tarde',
  3: 'Noite'
};

/**
 * 1 Manha 10hs 36000 next => 2
 * 2 Tarde 15hs 54000 next => 3
 * 3 Noite 20hs 72000 next => 1
 */
