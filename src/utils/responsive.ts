// 响应式storage
import { App } from "vue";
import { getConfig } from "@/config";
import Storage from "responsive-storage";
import { routerArrays } from "@/layout/types";
import { responsiveStorageNameSpace } from "@/config";

export const injectResponsiveStorage = (app: App, config: PlatformConfigs) => {
  const nameSpace = responsiveStorageNameSpace();
  const configObj = Object.assign(
    {
      // 国际化 默认中文zh
      locale: Storage.getData("locale", nameSpace) ?? {
        locale: config.Locale ?? "zh"
      },
      // layout模式以及主题
      layout: Storage.getData("layout", nameSpace) ?? {
        theme: config.Theme ?? getConfig().Theme,
        layout: config.Layout ?? getConfig().Layout,
        darkMode: config.DarkMode ?? getConfig().DarkMode,
        epThemeColor: config.EpThemeColor ?? getConfig().EpThemeColor,
        sidebarStatus: config.SidebarStatus ?? getConfig().SidebarStatus,
        leftMixNavFixed: config.LeftMixNavFixed ?? getConfig().LeftMixNavFixed,
        contentFullScreen: config.ContentFullScreen ?? getConfig().ContentFullScreen
      },
      configure: Storage.getData("configure", nameSpace) ?? {
        grey: config.Grey ?? getConfig().Grey,
        weak: config.Weak ?? getConfig().Weak,
        hideTabs: config.HideTabs ?? getConfig().HideTabs,
        showLogo: config.ShowLogo ?? getConfig().ShowLogo,
        showModel: config.ShowModel ?? getConfig().ShowModel,
        hideFooter: config.HideFooter ?? getConfig().HideFooter,
        fixedHeader: config?.FixedHeader ?? getConfig().FixedHeader,
        hiddenSideBar: config?.HiddenSideBar ?? getConfig().HiddenSideBar,
        mixMenuTrigger: config.MixMenuTrigger ?? getConfig().MixMenuTrigger,
        multiTagsCache: config.MultiTagsCache ?? getConfig().MultiTagsCache
      }
    },
    config.MultiTagsCache
      ? {
          // 默认显示顶级菜单tag
          tags: Storage.getData("tags", nameSpace) ?? routerArrays
        }
      : {}
  );

  app.use(Storage, { nameSpace, memory: configObj });
};
