import { useNav } from "./useNav";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { watch, onBeforeMount, type Ref } from "vue";
import { useSettingStore } from "@/store/modules/settings";

export function useTranslationLang(ref?: Ref) {
  const { changeTitle, handleResize } = useNav();
  const { locale, t } = useI18n();
  const route = useRoute();

  function translationCh() {
    useSettingStore().setLocale({ locale: "zh" });
    locale.value = "zh";
    ref && handleResize(ref.value);
  }

  function translationEn() {
    useSettingStore().setLocale({ locale: "en" });
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
    locale.value = useSettingStore().getLocale.locale ?? "zh";
  });

  return {
    t,
    route,
    locale,
    translationCh,
    translationEn,
  };
}
