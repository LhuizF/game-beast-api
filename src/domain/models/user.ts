export interface UserModel {
  id: string;
  name: string;
  id_guild?: number | null;
  id_discord?: number | null;
  email?: string | null;
  password?: string | null;
  avatar: string | null;
  created_at: Date;
}
