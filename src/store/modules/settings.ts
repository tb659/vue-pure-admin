import { defineStore } from "pinia";
import { type SettingStore, type SetType, store, getConfig, responsiveStorageNameSpace } from "../utils";

// 延迟创建 store，等待配置加载完成
let settingStore: ReturnType<typeof defineStore>;

export const useSettingStore = () => {
  if (!settingStore) {
    settingStore = defineStore(`${responsiveStorageNameSpace()}store_setting`, {
      state: (): SetType => ({
        title: getConfig().Title,
        locale: { locale: getConfig().Locale ?? "zh" },
        layout: {
          layout: getConfig().Layout ?? "vertical",
          theme: getConfig().Theme ?? "light",
          darkMode: getConfig().DarkMode ?? false,
          sidebarStatus: getConfig().SidebarStatus ?? true,
          epThemeColor: getConfig().EpThemeColor ?? "#409EFF",
          themeColor: getConfig().Theme ?? "light",
          overallStyle: getConfig().OverallStyle ?? "light",
        },
        configure: {
          stretch: getConfig().Stretch ?? false,
          showModel: getConfig().ShowModel ?? "smart",
          showLogo: getConfig().ShowLogo ?? true,
          fixedHeader: getConfig().FixedHeader,
          hideSideBar: getConfig().HideSideBar ?? false,
          multiTagsCache: getConfig().MultiTagsCache ?? false,
          hideTabs: getConfig().HideTabs ?? false,
          hideFooter: getConfig().HideFooter ?? true,
          grey: getConfig().Grey ?? false,
          weak: getConfig().Weak ?? false,
        },
        tags: [],
      }),
      getters: {
        getTitle(state) {
          return state.title;
        },
        getLocale(state) {
          return state.locale;
        },
        getLayout(state) {
          return state.layout;
        },
        getConfigure(state) {
          return state.configure;
        },
        getTags(state) {
          return state.tags;
        },
      },
      actions: {
        setLocale({ value }) {
          this.locale = value;
        },
        setLayout({ key, value }) {
          if (key) {
            this.layout[key] = value;
          } else {
            this.layout = { ...this.layout, ...value };
          }
        },
        setConfigure({ key, value }) {
          if (key) {
            this.configure[key] = value;
          } else {
            this.configure = { ...this.configure, ...value };
          }
        },
        setTags({ value }) {
          this.tags = value;
        },
      },
      persist: {
        pick: ["locale", "layout", "configure"],
      },
    });
  }
  return settingStore(store) as unknown as SettingStore;
};

export function useSettingStoreHook() {
  return useSettingStore();
}
