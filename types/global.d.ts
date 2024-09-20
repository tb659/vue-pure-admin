import type { VNode, FunctionalComponent, PropType as VuePropType, ComponentPublicInstance } from "vue";
import type { ECharts } from "echarts";
import type { IconifyIcon } from "@iconify/vue";
import type { TableColumns } from "@pureadmin/table";

/**
 * 全局类型声明，无需引入直接在 `.vue` 、`.ts` 、`.tsx` 文件使用即可获得类型提示
 */
declare global {
  /**
   * 平台的名称、版本、依赖、最后构建时间的类型提示
   */
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };

  /**
   * Window 的类型提示
   */
  interface Window {
    // Global vue app instance
    __APP__: App<Element>;
    webkitCancelAnimationFrame: (handle: number) => void;
    mozCancelAnimationFrame: (handle: number) => void;
    oCancelAnimationFrame: (handle: number) => void;
    msCancelAnimationFrame: (handle: number) => void;
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    oRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  }

  /**
   * 打包压缩格式的类型声明
   */
  type ViteCompression = "none" | "gzip" | "brotli" | "both" | "gzip-clear" | "brotli-clear" | "both-clear";

  /**
   * 全局自定义环境变量的类型声明
   * @see {@link https://yiming_chang.gitee.io/pure-admin-doc/pages/config/#%E5%85%B7%E4%BD%93%E9%85%8D%E7%BD%AE}
   */
  interface ViteEnv {
    VITE_PORT: number;
    VITE_OUT_DIR: string;
    VITE_PUBLIC_PATH: string;
    VITE_ROUTER_HISTORY: string;
    VITE_CDN: boolean;
    VITE_HIDE_HOME: string;
    VITE_COMPRESSION: ViteCompression;
  }

  /**
   * 对应 `public/platform-config.json` 文件的类型声明
   * @see {@link https://yiming_chang.gitee.io/pure-admin-doc/pages/config/#platform-config-json}
   */
  interface PlatformConfigs {
    Version?: string;
    Title?: string;
    Grey?: boolean;
    Weak?: boolean;
    Theme?: string;
    Layout?: string;
    Locale?: string;
    DarkMode?: boolean;
    HideTabs?: boolean;
    ShowLogo?: boolean;
    ShowI18N?: boolean;
    ShowModel?: string;
    KeepAlive?: boolean;
    HideFooter?: boolean;
    ShowSearch?: boolean;
    ShowNotice?: boolean;
    FixedHeader?: boolean;
    MockRequest?: boolean;
    EpThemeColor?: string;
    TooltipEffect?: Effect;
    SidebarStatus?: boolean;
    ShowDataTheme?: boolean;
    HiddenSideBar?: boolean;
    MixMenuTrigger?: string;
    MultiTagsCache?: boolean;
    LeftMixNavFixed?: boolean;
    ContentFullScreen?: boolean;
    CachingAsyncRoutes?: boolean;
    ShowSystemSettings?: boolean;
    MenuArrowIconNoTransition?: boolean;
    PLATFORM_PREFIX?: string;
    MapConfigure?: {
      amapKey?: string;
      options: {
        zoom?: number;
        center?: number[];
        resizeEnable?: boolean;
      };
    };
  }

  /**
   * 与 `PlatformConfigs` 类型不同，这里是缓存到浏览器本地存储的类型声明
   * @see {@link https://yiming_chang.gitee.io/pure-admin-doc/pages/config/#platform-config-json}
   */
  interface StorageConfigs {
    version?: string;
    title?: string;
    fixedHeader?: boolean;
    hiddenSideBar?: boolean;
    multiTagsCache?: boolean;
    contentFullScreen?: boolean;
    leftMixNavFixed?: boolean;
    mixMenuTrigger?: string;
    keepAlive?: boolean;
    locale?: string;
    layout?: string;
    theme?: string;
    darkMode?: boolean;
    grey?: boolean;
    weak?: boolean;
    hideTabs?: boolean;
    hideFooter?: boolean;
    sidebarStatus?: boolean;
    epThemeColor?: string;
    showLogo?: boolean;
    showModel?: string;
    mapConfigure?: {
      amapKey?: string;
      options: {
        resizeEnable?: boolean;
        center?: number[];
        zoom?: number;
      };
    };
    username?: string;
  }

  /**
   * `responsive-storage` 本地响应式 `storage` 的类型声明
   */
  interface ResponsiveStorage {
    locale: {
      locale?: string;
    };
    layout: {
      theme?: string;
      layout?: string;
      darkMode?: boolean;
      epThemeColor?: string;
      sidebarStatus?: boolean;
      leftMixNavFixed?: boolean;
      contentFullScreen?: boolean;
    };
    configure: {
      grey?: boolean;
      weak?: boolean;
      hideTabs?: boolean;
      showLogo?: boolean;
      showModel?: string;
      hideFooter?: boolean;
      fixedHeader?: boolean;
      hiddenSideBar?: boolean;
      mixMenuTrigger?: string;
      multiTagsCache?: boolean;
    };
    tags?: Array<any>;
  }

  /**
   * 平台里所有组件实例都能访问到的全局属性对象的类型声明
   */
  interface GlobalPropertiesApi {
    $echarts: ECharts;
    $storage: ResponsiveStorage;
    $config: PlatformConfigs;
  }

  /**
   * 请求返回data
   */
  interface PureResponseData<T = any> {
    page: number;
    rows?: T[];
    data?: T[];
    size: number;
    total: number;
  }

  /**
   * 请求返回
   */
  interface PureResponse<T> {
    code: string;
    data: T;
    message: string;
    requestId: null;
    sign: null;
    success: boolean;
  }
}
