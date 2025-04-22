import type { RouteRecordName } from "vue-router";

export type CacheType = {
  mode: string;
  name?: RouteRecordName;
};

export type PositionType = {
  startIndex?: number;
  length?: number;
};

export type AppType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Collapse
    isClickCollapse: boolean;
  };
  layout: Layout;
  device: string;
  viewportSize: { width: number; height: number };
  sortSwap: boolean;
};

export type MultiType = {
  path: string;
  name: string;
  meta: any;
  query?: object;
  params?: object;
};

export type SettingLayoutType = {
  layout: Layout;
  theme: string;
  darkMode: boolean;
  sidebarStatus: boolean;
  epThemeColor: string;
  themeColor: string;
  overallStyle: string;
};

export type SettingConfigureType = {
  stretch: boolean | number;
  showModel: string;
  showLogo: boolean;
  fixedHeader: boolean;
  hideSideBar: boolean;
  multiTagsCache: boolean;
  hideTabs: boolean;
  hideFooter: boolean;
  grey: boolean;
  weak: boolean;
};

export type SetType = {
  title: string;
  locale: {
    locale: string;
  };
  layout: SettingLayoutType;
  configure: SettingConfigureType;
  tags: any[];
};
export interface SettingStore extends SetType {
  getTitle: string;
  getLocale: {
    locale: string;
  };
  getLayout: SettingLayoutType;
  getConfigure: SettingConfigureType;
  getTags: any[];
  setLocale: (locale: { locale: string }) => void;
  setLayout: ({ key, value }: { key: string; value: SettingLayoutType | any }) => void;
  setConfigure: ({ key, value }: { key: string; value: SettingConfigureType | any }) => void;
  setTags: ({ value }: { value: any[] }) => void;
}

export type PermissionStore = {
  constantMenus: any[];
  wholeMenus: any[];
  flatteningRoutes: any[];
  cachePageList: any[];
  handleWholeMenus: (routes: any[]) => void;
  cacheOperate: (data: CacheType) => void;
  clearAllCachePage: () => void;
};

export type CommonStore = {
  dictList: any[];
  fileSizeLimit: string;
  init: () => void;
  getDict: () => Promise<void>;
  getFileSizeLimit: () => void;
  setFileSizeLimit: (size: string) => void;
  goLastPage: (data?: GoLastPageType) => void;
};

export type CommonType = {
  dictList: DictData[];
  fileSizeLimit: string;
};

export type GoLastPageType = {
  info?: string;
  isConfirm?: boolean;
  closeTab?: boolean;
  reload?: boolean;
};

export type UserType = {
  avatar?: string;
  username?: string;
  nickname?: string;
  roles?: Array<string>;
  permissions?: Array<string>;
  verifyCode?: string;
  currentPage?: number;
  isRemembered?: boolean;
  loginDay?: number;
};
