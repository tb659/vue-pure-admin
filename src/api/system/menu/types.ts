import { BaseQuery } from "@/api/types";
export interface MenuData {
  id?: number;
  menuId?: number;
  code?: string;
  domain?: string;
  href?: string;
  name?: string;
  permissions?: string;
  defaultAssign?: number;
  parentId?: number;
  status?: number;
  type?: number;
  note?: string;
  children?: MenuData[];
  path?: string;
  cname?: string;
  component?: string;
  redirect?: string;
  icon?: string;
  keepAlive?: boolean;
  frameType?: number;
  visible?: boolean;
  showParent?: boolean;
  meta?: {
    title?: string;
    icon?: string;
    auths?: string[];
    visible?: boolean;
    showLink?: boolean;
    affix?: boolean;
    frontstage?: boolean;
    backstage?: boolean;
    showParent?: boolean;
    keepAlive?: boolean;
    frameSrc?: string;
    rank?: number;
  };
}

export interface MenuQuery extends BaseQuery {
  parentId: number;
  resourceId: number;
  status: number;
  code: string;
  name: string;
}
