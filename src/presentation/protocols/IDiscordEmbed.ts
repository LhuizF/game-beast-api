export interface GameData {
  roleId: string;
  gameNumber: number;
  result: {
    name: string;
    number: number;
  };
  bets: {
    total: number;
    wins: number;
    loses: number;
  };
  gameTime: number;
}

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

export interface DiscordMessage {
  content: string;
  embed: Embed[];
}

export interface IDiscordEmbed {
  createEmbed(data: GameData): DiscordMessage;
}
