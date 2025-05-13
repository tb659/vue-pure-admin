import type { RouteRecordName } from "vue-router";

export type CacheType = {
  mode: string;
  name?: RouteRecordName;
};

export type PositionType = {
  startIndex?: number;
  length?: number;
};

export type GoLastPageType = {
  info?: string;
  isConfirm?: boolean;
  closeTab?: boolean;
  reload?: boolean;
};

export type SettingLayoutType = {
  layout: Layout;
  theme: string;
  darkMode: boolean;
  sidebarStatus: boolean;
  epThemeColor: string;
  themeColor: string;
  overallStyle: string;
  contentFullScreen: boolean;
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
  mixMenuTrigger: string;
};

export type AppType = {
  title: string;
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
  leftMixNavFixed: boolean;
};

export interface AppStore extends AppType {
  getTitle: string;
  getSidebarStatus: boolean;
  getDevice: string;
  getViewportWidth: number;
  getViewportHeight: number;
  getSortSwap: boolean;
  getLeftMixNavFixed: boolean;
  toggleSideBar: (opened?: boolean, resize?: string) => void;
  toggleDevice: (device: string) => void;
  setLayout: (layout: string) => void;
  setViewportSize: (size: { width: number; height: number }) => void;
  setSortSwap: (sortSwap: boolean) => void;
  setLeftMixNavFixed: (leftMixNavFixed: boolean) => void;
}

export type CommonType = {
  dictList: DictData[];
  fileSizeLimit: string;
};

export interface CommonStore extends CommonType {
  init: () => void;
  getDict: () => Promise<void>;
  getFileSizeLimit: () => void;
  setFileSizeLimit: (size: string) => void;
  goLastPage: (data?: GoLastPageType) => void;
}

export type MultiType = {
  path: string;
  name: string;
  meta: any;
  query?: object;
  params?: object;
};

export type MultitagsStore = {
  multiTags: any[];
  multiTagsCache: boolean;
  multiTagsCacheChange: (multiTagsCache: boolean) => void;
  tagsCache: (multiTags: any[]) => void;
  handleTags: (mode: string, value?: any, position?: PositionType) => void;
};

export type PermissionStore = {
  constantMenus: any[];
  wholeMenus: any[];
  flatteningRoutes: any[];
  cachePageList: any[];
  handleWholeMenus: (routes: any[]) => void;
  cacheOperate: (data: CacheType) => void;
  clearAllCachePage: () => void;
};

export type SetType = {
  locale: {
    locale: string;
  };
  layout: SettingLayoutType;
  configure: SettingConfigureType;
  tags: any[];
};

export interface SettingStore extends SetType {
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
