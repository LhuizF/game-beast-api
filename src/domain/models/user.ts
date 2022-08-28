export interface UserModel {
  id: string;
  name: string;
  id_guild?: string | null;
  id_discord?: string | null;
  email?: string | null;
  password?: string | null;
  avatar: string | null;
  created_at: Date;
}
