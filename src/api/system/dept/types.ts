import type { BaseQuery } from "@/api/types";

export type DeptData = {
  id?: number;
  name?: string;
  value?: string;
  code?: string;
  note?: string;
  status?: number;
  embed?: number;
};

export type DeptQuery = BaseQuery;
