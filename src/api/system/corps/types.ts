import type { BaseQuery } from "@/api/types";

export type CorpsData = {
  id?: number;
  crtUserName?: string;
  corpName?: string;
  corpCode?: string;
  status?: number;
  modUser?: number;
  name?: string;
  note?: string;
  resourceList?: { id: number; permissions: string }[] | undefined;
};

export type CorpsQuery = BaseQuery;
