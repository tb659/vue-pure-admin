import { BaseQuery } from "@/api/types";

export type DictData = {
  id?: number;
  name?: string;
  value?: string;
  code?: string;
  note?: string;
  status?: number;
  embed?: number;
};

export type DictQuery = BaseQuery;
