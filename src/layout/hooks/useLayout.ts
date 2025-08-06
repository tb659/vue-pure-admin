import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { routerArrays } from "../types";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useSettingStoreHook } from "@/store/modules/settings";

export function useLayout() {
  const settingStore = useSettingStoreHook();
  const initStorage = () => {
    /** 路由 */
    if (
      useMultiTagsStoreHook().multiTagsCache &&
      (!useSettingStoreHook().getTags || useSettingStoreHook().getTags.length === 0)
    ) {
      useSettingStoreHook().setTags({ value: routerArrays });
    }

    /** 国际化 */
    useI18n().locale.value = settingStore.getLocale.locale ?? "zh";
  };

  /** 清空缓存后从platform-config.json读取默认配置并赋值到storage中 */
  const layout = computed(() => {
    return useSettingStoreHook().getLayout.layout;
  });

  const layoutTheme = computed(() => {
    return useSettingStoreHook().getLayout;
  });

  return {
    layout,
    layoutTheme,
    initStorage,
  };
}
