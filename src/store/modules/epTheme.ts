import { defineStore } from "pinia";
import { useSettingStoreHook } from "./settings";
import { store, getConfig, /* storageLocal, */ responsiveStorageNameSpace } from "../utils";

export const useEpThemeStore = defineStore(`${responsiveStorageNameSpace()}store_epTheme`, {
  state: () => ({
    epThemeColor: useSettingStoreHook().getLayout.epThemeColor ?? getConfig().EpThemeColor,
    epTheme: useSettingStoreHook().getLayout.theme ?? getConfig().Theme,
  }),
  getters: {
    getEpThemeColor(state) {
      return state.epThemeColor;
    },
    /** 用于mix导航模式下hamburger-svg的fill属性 */
    fill(state) {
      if (state.epTheme === "light") {
        return "#409eff";
      } else {
        return "#fff";
      }
    },
  },
  actions: {
    setEpThemeColor(newColor: string): void {
      const layout = useSettingStoreHook().getLayout;
      this.epTheme = layout?.theme;
      this.epThemeColor = newColor;
      if (!layout) return;
      layout.epThemeColor = newColor;
      // storageLocal().setItem(`${responsiveStorageNameSpace()}layout`, layout);
    },
  },
});

export function useEpThemeStoreHook() {
  return useEpThemeStore(store);
}
