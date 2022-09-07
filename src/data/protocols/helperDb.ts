export interface HelperDb {
  verifyGuild(id: number): Promise<void>;
  verifyUser(id: string): Promise<void>;
  verifyBeast(id: number): Promise<void>;
}
