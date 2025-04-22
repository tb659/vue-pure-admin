import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { routerArrays } from "../types";
import { useMultiTagsStore } from "@/store/modules/multiTags";
import { useSettingStore } from "@/store/modules/settings";

export function useLayout() {
  const settingStore = useSettingStore();
  const initStorage = () => {
    /** 路由 */
    if (useMultiTagsStore().multiTagsCache && (!useSettingStore().getTags || useSettingStore().getTags.length === 0)) {
      useSettingStore().setTags({ value: routerArrays });
    }

    /** 国际化 */
    useI18n().locale.value = settingStore.getLocale.locale ?? "zh";
  };

  /** 清空缓存后从platform-config.json读取默认配置并赋值到storage中 */
  const layout = computed(() => {
    return useSettingStore().getLayout.layout;
  });

  const layoutTheme = computed(() => {
    return useSettingStore().getLayout;
  });

  return {
    layout,
    layoutTheme,
    initStorage,
  };
}
