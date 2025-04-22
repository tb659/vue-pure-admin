import { $t } from "@/plugins/i18n";
import { components } from "@/router/enums";

export default {
  path: "/components",
  redirect: "/components/dialog",
  meta: {
    icon: "ep/menu",
    title: $t("menus.pureComponents"),
    rank: components,
  },
  children: [
    {
      path: "/components/dialog",
      name: "DialogPage",
      component: () => import("@/views/default/components/dialog/index.vue"),
      meta: {
        title: $t("menus.pureDialog"),
      },
    },
    {
      path: "/components/drawer",
      name: "DrawerPage",
      component: () => import("@/views/default/components/drawer/index.vue"),
      meta: {
        title: $t("menus.pureDrawer"),
      },
    },
    {
      path: "/components/message",
      name: "Message",
      component: () => import("@/views/default/components/message.vue"),
      meta: {
        title: $t("menus.pureMessage"),
      },
    },
    {
      path: "/components/upload",
      name: "PureUpload",
      component: () => import("@/views/default/components/upload/index.vue"),
      meta: {
        title: $t("menus.pureUpload"),
      },
    },
    {
      path: "/components/check-card",
      name: "CheckCard",
      component: () => import("@/views/default/components/check-card.vue"),
      meta: {
        title: $t("menus.pureCheckCard"),
      },
    },
    {
      path: "/components/date-picker",
      name: "DatePicker",
      component: () => import("@/views/default/components/date-picker.vue"),
      meta: {
        title: $t("menus.pureDatePicker"),
      },
    },
    {
      path: "/components/datetime-picker",
      name: "DateTimePicker",
      component: () => import("@/views/default/components/datetime-picker.vue"),
      meta: {
        title: $t("menus.pureDateTimePicker"),
      },
    },
    {
      path: "/components/time-picker",
      name: "TimePicker",
      component: () => import("@/views/default/components/time-picker.vue"),
      meta: {
        title: $t("menus.pureTimePicker"),
      },
    },
    {
      path: "/components/icon-select",
      name: "IconSelect",
      component: () => import("@/views/default/components/icon-select.vue"),
      meta: {
        title: $t("menus.pureIconSelect"),
      },
    },
    {
      path: "/components/animatecss",
      name: "AnimateCss",
      component: () => import("@/views/default/components/animatecss.vue"),
      meta: {
        title: $t("menus.pureAnimatecss"),
      },
    },
    {
      path: "/components/cropping",
      name: "Cropping",
      component: () => import("@/views/default/components/cropping/index.vue"),
      meta: {
        title: $t("menus.pureCropping"),
      },
    },
    {
      path: "/components/segmented",
      name: "Segmented",
      component: () => import("@/views/default/components/segmented.vue"),
      meta: {
        title: $t("menus.pureSegmented"),
      },
    },
    {
      path: "/components/text",
      name: "PureText",
      component: () => import("@/views/default/components/text.vue"),
      meta: {
        title: $t("menus.pureText"),
      },
    },
    {
      path: "/components/slider",
      name: "PureSlider",
      component: () => import("@/views/default/components/slider/index.vue"),
      meta: {
        title: $t("menus.pureSlider"),
        extraIcon: "IF-pure-iconfont-new svg",
      },
    },
    {
      path: "/components/el-button",
      name: "PureButton",
      component: () => import("@/views/default/components/el-button.vue"),
      meta: {
        title: $t("menus.pureElButton"),
      },
    },
    {
      path: "/components/check-button",
      name: "CheckButton",
      component: () => import("@/views/default/components/check-button.vue"),
      meta: {
        title: $t("menus.pureCheckButton"),
      },
    },
    {
      path: "/components/button",
      name: "ButtonPage",
      component: () => import("@/views/default/components/button.vue"),
      meta: {
        title: $t("menus.pureButton"),
      },
    },
    {
      path: "/components/progress",
      name: "PureProgress",
      component: () => import("@/views/default/components/progress.vue"),
      meta: {
        title: $t("menus.pureProgress"),
      },
    },
    {
      path: "/components/tag",
      name: "PureTag",
      component: () => import("@/views/default/components/tag.vue"),
      meta: {
        title: $t("menus.pureTag"),
      },
    },
    {
      path: "/components/statistic",
      name: "Statistic",
      component: () => import("@/views/default/components/statistic.vue"),
      meta: {
        title: $t("menus.pureStatistic"),
      },
    },
    {
      path: "/components/collapse",
      name: "Collapse",
      component: () => import("@/views/default/components/collapse.vue"),
      meta: {
        title: $t("menus.pureCollapse"),
      },
    },
    {
      path: "/components/cascader",
      name: "Cascader",
      component: () => import("@/views/default/components/cascader.vue"),
      meta: {
        title: $t("menus.pureCascader"),
      },
    },
    {
      path: "/components/color-picker",
      name: "ColorPicker",
      component: () => import("@/views/default/components/color-picker.vue"),
      meta: {
        title: $t("menus.pureColorPicker"),
      },
    },
    {
      path: "/components/selector",
      name: "Selector",
      component: () => import("@/views/default/components/selector.vue"),
      meta: {
        title: $t("menus.pureSelector"),
      },
    },
    {
      path: "/components/waterfall",
      name: "Waterfall",
      component: () => import("@/views/default/components/waterfall/index.vue"),
      meta: {
        title: $t("menus.pureWaterfall"),
      },
    },
    {
      path: "/components/split-pane",
      name: "SplitPane",
      component: () => import("@/views/default/components/split-pane.vue"),
      meta: {
        title: $t("menus.pureSplitPane"),
      },
    },
    {
      path: "/components/swiper",
      name: "Swiper",
      component: () => import("@/views/default/components/swiper.vue"),
      meta: {
        title: $t("menus.pureSwiper"),
      },
    },
    {
      path: "/components/timeline",
      name: "TimeLine",
      component: () => import("@/views/default/components/timeline.vue"),
      meta: {
        title: $t("menus.pureTimeline"),
      },
    },
    {
      path: "/components/count-to",
      name: "CountTo",
      component: () => import("@/views/default/components/count-to.vue"),
      meta: {
        title: $t("menus.pureCountTo"),
      },
    },
    {
      path: "/components/contextmenu",
      name: "ContextMenu",
      component: () => import("@/views/default/components/contextmenu/index.vue"),
      meta: {
        title: $t("menus.pureContextmenu"),
      },
    },
    {
      path: "/components/json-editor",
      name: "JsonEditor",
      component: () => import("@/views/default/components/json-editor.vue"),
      meta: {
        title: $t("menus.pureJsonEditor"),
      },
    },
    {
      path: "/components/seamless-scroll",
      name: "SeamlessScroll",
      component: () => import("@/views/default/components/seamless-scroll.vue"),
      meta: {
        title: $t("menus.pureSeamless"),
      },
    },
    {
      path: "/components/virtual-list",
      name: "VirtualList",
      component: () => import("@/views/default/components/virtual-list/index.vue"),
      meta: {
        title: $t("menus.pureVirtualList"),
      },
    },
  ],
} satisfies RouteConfigsTable;
