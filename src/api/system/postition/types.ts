declare global {
  interface PositionData {
    id?: number;
    name?: string;
    code?: string;
    note?: string;
    dataVersion?: number;
    corpId?: number;
    status?: number;
    embed?: number;
    crtDt?: number;
    userIds?: number[];
  }
}
export {};
