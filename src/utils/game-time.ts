import { GameTime } from '../presentation/protocols/game-time';

export class GameTimeAdapter implements GameTime {
  get(): number {
    const now = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const [hour, min, seconds] = now.split(':');
    const currentSeconds = Number(hour) * 3600 + Number(min) * 60 + Number(seconds);

    if (currentSeconds <= 36000) return 1;
    if (currentSeconds <= 54000) return 2;
    return 3;
  }
}

/**
 * Manha 10hs 36000 1
 * Tarde 15hs 54000 2
 * Noite 20hs 72000 3
 */
