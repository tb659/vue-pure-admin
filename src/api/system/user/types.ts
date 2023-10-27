import { BaseQuery } from "@/api/types";

export interface loginType {
  username: string;
  password: string;
  code: string;
}

export interface UserData {
  id: number;
  dataVersion: number;
  userId: number;
  roleList: number[];
  status: number;
  username: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
  expireTime: string;
}

export interface UserQuery extends BaseQuery {
  name: string;
}
