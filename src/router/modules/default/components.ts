import { $t } from "@/plugins/i18n";
import { components } from "@/router/enums";

export default {
  path: "/components",
  redirect: "/components/dialog",
  meta: {
    icon: "menu",
    title: $t("menus.hscomponents"),
    rank: components
  },
  children: [
    {
      path: "/components/dialog",
      name: "DialogPage",
      component: () => import("@/views/default/components/dialog/index.vue"),
      meta: {
        title: $t("menus.hsdialog"),
        extraIcon: "IF-pure-iconfont-new svg",
        transition: {
          enterTransition: "animate__fadeInLeft",
          leaveTransition: "animate__fadeOutRight"
        }
      }
    },
    {
      path: "/components/message",
      name: "Message",
      component: () => import("@/views/default/components/message/index.vue"),
      meta: {
        title: $t("menus.hsmessage")
      }
    },
    {
      path: "/components/segmented",
      name: "Segmented",
      component: () => import("@/views/default/components/segmented/index.vue"),
      meta: {
        title: $t("menus.hssegmented"),
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/components/waterfall",
      name: "Waterfall",
      component: () => import("@/views/default/components/waterfall/index.vue"),
      meta: {
        title: $t("menus.hswaterfall"),
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/components/video",
      name: "VideoPage",
      component: () => import("@/views/default/components/video/index.vue"),
      meta: {
        title: $t("menus.hsvideo")
      }
    },
    {
      path: "/components/map",
      name: "MapPage",
      component: () => import("@/views/default/components/map/index.vue"),
      meta: {
        title: $t("menus.hsmap"),
        keepAlive: true,
        transition: {
          name: "fade"
        }
      }
    },
    {
      path: "/components/draggable",
      name: "Draggable",
      component: () => import("@/views/default/components/draggable/index.vue"),
      meta: {
        title: $t("menus.hsdraggable"),
        transition: {
          enterTransition: "animate__zoomIn",
          leaveTransition: "animate__zoomOut"
        }
      }
    },
    {
      path: "/components/splitPane",
      name: "SplitPane",
      component: () => import("@/views/default/components/split-pane/index.vue"),
      meta: {
        title: $t("menus.hssplitPane")
      }
    },
    {
      path: "/components/button",
      name: "ButtonPage",
      component: () => import("@/views/default/components/button/index.vue"),
      meta: {
        title: $t("menus.hsbutton")
      }
    },
    {
      path: "/components/cropping",
      name: "Cropping",
      component: () => import("@/views/default/components/cropping/index.vue"),
      meta: {
        title: $t("menus.hscropping")
      }
    },
    {
      path: "/components/animatecss",
      name: "AnimateCss",
      component: () => import("@/views/default/components/animatecss/index.vue"),
      meta: {
        title: $t("menus.hsanimatecss"),
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/components/countTo",
      name: "CountTo",
      component: () => import("@/views/default/components/count-to/index.vue"),
      meta: {
        title: $t("menus.hscountTo")
      }
    },
    {
      path: "/components/selector",
      name: "Selector",
      component: () => import("@/views/default/components/selector/index.vue"),
      meta: {
        title: $t("menus.hsselector")
      }
    },
    {
      path: "/components/seamlessScroll",
      name: "SeamlessScroll",
      component: () => import("@/views/default/components/seamless-scroll/index.vue"),
      meta: {
        title: $t("menus.hsseamless")
      }
    },
    {
      path: "/components/contextmenu",
      name: "ContextMenu",
      component: () => import("@/views/default/components/contextmenu/index.vue"),
      meta: {
        title: $t("menus.hscontextmenu")
      }
    },
    {
      path: "/components/typeit",
      name: "Typeit",
      component: () => import("@/views/default/components/typeit/index.vue"),
      meta: {
        title: $t("menus.hstypeit")
      }
    },
    {
      path: "/components/json-editor",
      name: "JsonEditor",
      component: () => import("@/views/default/components/json-editor/index.vue"),
      meta: {
        title: $t("menus.hsjsoneditor")
      }
    },
    {
      path: "/components/danmaku",
      name: "Danmaku",
      component: () => import("@/views/default/components/danmaku/index.vue"),
      meta: {
        title: $t("menus.hsdanmaku")
      }
    }
  ]
} as RouteConfigsTable;
