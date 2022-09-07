export interface UpdatePoints {
  discount(userID: string, points: number): Promise<void>;
}
