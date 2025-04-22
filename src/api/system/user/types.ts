declare global {
  interface loginType {
    username: string;
    password: string;
    code: string;
  }

  interface UserData {
    id?: number;
    avatar?: string;
    dataVersion?: number;
    userId?: number;
    roleList?: number[];
    status?: number;
    username?: string;
    realName?: string;
    password?: string;
    newPassword?: string;
    confirmPassword?: string;
    expireTime?: string;
    /** 当前登录用户的角色 */
    roles?: Array<string>;
    /** 当前登录用户的按钮级别权限 */
    permissions?: Array<string>;
    /** token */
    accessToken: string;
    /** 用于调用刷新accessToken的接口时所需的token */
    refreshToken: string;
    /** 昵称 */
    nickname?: string;
  }

  export interface UserQuery extends BaseQuery {
    name: string;
  }
}

export {};
