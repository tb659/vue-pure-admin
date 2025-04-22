declare global {
  interface CorpsData {
    id?: number;
    crtUserName?: string;
    corpName?: string;
    corpCode?: string;
    status?: number;
    modUser?: number;
    name?: string;
    note?: string;
    resourceList?: { id: number; permissions: string }[];
  }
}
export {};
