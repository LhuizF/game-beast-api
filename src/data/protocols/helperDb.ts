export interface HelperDb {
  verifyGuild(id: number): Promise<void>;
  verifyUser(id: number): Promise<void>;
  verifyBeast(id: number): Promise<void>;
}
