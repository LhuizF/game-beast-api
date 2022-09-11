export interface BetModel {
  id: number;
  points: number;
  id_game: number;
  status: string;
  platform: string;
  id_beast: number;
  id_user: string;
  created_at: Date;
}

type StatusBet = 'pending' | 'win' | 'lose';
