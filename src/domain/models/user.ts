export interface UserModel {
  id: string;
  name: string;
  id_guild?: string;
  id_discord?: string;
  email?: string;
  password?: string;
  avatar?: string;
  created_at: Date;
}
