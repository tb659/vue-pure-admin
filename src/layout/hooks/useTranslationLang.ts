import { useNav } from "./useNav";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { watch, onBeforeMount, type Ref } from "vue";
import { useSettingStoreHook } from "@/store/modules/settings";

export function useTranslationLang(ref?: Ref) {
  const { changeTitle, handleResize } = useNav();
  const { locale, t } = useI18n();
  const route = useRoute();

  function translationCh() {
    useSettingStoreHook().setLocale({ locale: "zh" });
    locale.value = "zh";
    ref && handleResize(ref.value);
  }

  function translationEn() {
    useSettingStoreHook().setLocale({ locale: "en" });
    locale.value = "en";
    ref && handleResize(ref.value);
  }

  watch(
    () => locale.value,
    () => {
      changeTitle(route.meta);
    },
  );

  onBeforeMount(() => {
    locale.value = useSettingStoreHook().getLocale.locale ?? "zh";
  });

  return {
    t,
    route,
    locale,
    translationCh,
    translationEn,
  };
}
