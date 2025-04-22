declare global {
  interface RoleData {
    id?: number;
    code?: string;
    corpId?: number;
    crtTime?: number;
    crtUser?: number;
    dataState?: number;
    dataVersion?: number;
    embed?: number;
    modUser?: number;
    name?: string;
    note?: string;
    resourceList?: { id: number; permissions: string }[] | undefined;
    sequence?: null;
    status?: number;
  }
}
export {};
