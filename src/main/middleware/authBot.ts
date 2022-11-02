import { NextFunction, Request, Response } from 'express';

export const authBot = (req: Request, res: Response, next: NextFunction) => {
  const discordToken = req.headers.discord_token as string;

  if (!discordToken) {
    return res.status(401).json({
      message: 'token not found'
    });
  }

  const [header, token] = discordToken.split(' ');

  if (header !== 'bot-token') {
    return res.status(401).json({
      message: 'header invalid'
    });
  }

  const discordTokenApi = process.env.DISCORD_TOKEN;

  if (token !== discordTokenApi) {
    return res.status(412).json({
      message: 'invalid token'
    });
  }

  next();
};
