import nodemailer from 'nodemailer';
import { time } from '../../utils/game-time';
import { GameResult } from '../protocols/play-result';
import { SendEmail } from '../protocols/send-email';

export class SendEmailNode implements SendEmail {
  config() {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_FROM,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN
      }
    });
  }

  send(data: GameResult): void {
    const { game, beastWin: beast, totalBets, winners, losers } = data;
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Resultado do Game #${game.id}`,
      html: `
        <h1>Resultado do Game #${game.id}</h1>
        <p>Animal sorteado: ${beast.name} - N°${beast.id}</p>
        <p>Total de apostas: ${totalBets}</p>
        <p>Total de ganhadores: ${winners.length}</p>
        <p>Total de perdedores: ${losers}</p>
        <p>Horário do jogo: ${time[game.time as keyof typeof time]}</p>
        <p>Data do jogo: ${game.update_at}</p>
      `
    };

    this.config().sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Email sent: ' + info.response);
    });
  }
}
