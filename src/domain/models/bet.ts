export interface Bet {
  id: number;
  points: number;
  game_time: number;
  status: StatusBet;
  platform: string;
  id_beast: number;
  id_user: number;
  created_at: Date;
}

type StatusBet = 'pending' | 'win' | 'lose';
