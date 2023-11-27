import type { setType } from "./types";
import { store } from "@/store";
import { defineStore } from "pinia";
import { getConfig } from "@/config";

export const useSettingStore = defineStore({
  id: "pure-setting",
  state: (): setType => ({
    title: getConfig().Title
  }),
  getters: {
    getTitle(state) {
      return state.title;
    }
  },
  actions: {
    CHANGE_SETTING({ key, value }) {
      if (Reflect.has(this, key)) {
        this[key] = value;
      }
    },
    changeSetting(data) {
      this.CHANGE_SETTING(data);
    }
  }
});

export function useSettingStoreHook() {
  return useSettingStore(store);
}
