import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { getConfig } from "@/config";
import { routerArrays } from "../types";
import { useGlobal } from "@pureadmin/utils";
import { useMultiTagsStore } from "@/store/modules/multiTags";

export function useLayout() {
  const { $storage, $config } = useGlobal<GlobalPropertiesApi>();

  const initStorage = () => {
    /** 路由 */
    if (useMultiTagsStore().multiTagsCache && (!$storage.tags || $storage.tags.length === 0)) {
      $storage.tags = routerArrays;
    }
    /** 国际化 */
    if (!$storage.locale) {
      $storage.locale = { locale: $config?.Locale ?? "zh" };
      useI18n().locale.value = $config?.Locale ?? "zh";
    }
    /** 导航 */
    if (!$storage.layout) {
      $storage.layout = {
        layout: $config?.Layout ?? getConfig().Layout,
        theme: $config?.Theme ?? getConfig().Theme,
        darkMode: $config?.DarkMode ?? getConfig().DarkMode,
        leftMixNavFixed: $config?.LeftMixNavFixed ?? getConfig().LeftMixNavFixed,
        contentFullScreen: $config?.ContentFullScreen ?? getConfig().ContentFullScreen,
        sidebarStatus: $config?.SidebarStatus ?? getConfig().SidebarStatus,
        epThemeColor: $config?.EpThemeColor ?? getConfig().EpThemeColor
      };
    }
    /** 灰色模式、色弱模式、隐藏标签页 */
    if (!$storage.configure) {
      $storage.configure = {
        grey: $config?.Grey ?? getConfig().Grey,
        weak: $config?.Weak ?? getConfig().Weak,
        hideTabs: $config?.HideTabs ?? getConfig().HideTabs,
        showLogo: $config?.ShowLogo ?? getConfig().ShowLogo,
        showModel: $config?.ShowModel ?? getConfig().ShowModel,
        fixedHeader: $config?.FixedHeader ?? getConfig().FixedHeader,
        hiddenSideBar: $config?.HiddenSideBar ?? getConfig().HiddenSideBar,
        mixMenuTrigger: $config?.MixMenuTrigger ?? getConfig().MixMenuTrigger,
        multiTagsCache: $config?.MultiTagsCache ?? getConfig().MultiTagsCache
      };
    }
  };

  /** 清空缓存后从platform-config.json读取默认配置并赋值到storage中 */
  const layout = computed(() => {
    return $storage?.layout.layout;
  });

  const layoutTheme = computed(() => {
    return $storage.layout;
  });

  return {
    layout,
    layoutTheme,
    initStorage
  };
}
