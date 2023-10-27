import { $t } from "@/plugins/i18n";
import { able } from "@/router/enums";

export default {
  path: "/able",
  redirect: "/able/watermark",
  meta: {
    icon: "ubuntuFill",
    title: $t("menus.hsAble"),
    rank: able
  },
  children: [
    {
      path: "/able/videoFrame",
      name: "VideoFrame",
      component: () => import("@/views/default/able/video-frame/index.vue"),
      meta: {
        title: $t("menus.hsVideoFrame"),
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/able/wavesurfer",
      name: "Wavesurfer",
      component: () => import("@/views/default/able/wavesurfer/index.vue"),
      meta: {
        title: $t("menus.hsWavesurfer"),
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/able/directives",
      name: "Directives",
      component: () => import("@/views/default/able/directives.vue"),
      meta: {
        title: $t("menus.hsOptimize")
      }
    },
    {
      path: "/able/watermark",
      name: "WaterMark",
      component: () => import("@/views/default/able/watermark.vue"),
      meta: {
        title: $t("menus.hsWatermark")
      }
    },
    {
      path: "/able/print",
      name: "Print",
      component: () => import("@/views/default/able/print.vue"),
      meta: {
        title: $t("menus.hsPrint")
      }
    },
    {
      path: "/able/download",
      name: "Download",
      component: () => import("@/views/default/able/download.vue"),
      meta: {
        title: $t("menus.hsDownload")
      }
    },
    {
      path: "/able/iconSelect",
      name: "IconSelect",
      component: () => import("@/views/default/able/icon-select.vue"),
      meta: {
        title: $t("menus.hsIconSelect")
      }
    },
    {
      path: "/able/timeline",
      name: "TimeLine",
      component: () => import("@/views/default/able/timeline.vue"),
      meta: {
        title: $t("menus.hsTimeline")
      }
    },
    {
      path: "/able/menuTree",
      name: "MenuTree",
      component: () => import("@/views/default/able/menu-tree.vue"),
      meta: {
        title: $t("menus.hsMenuTree")
      }
    },
    {
      path: "/able/lineTree",
      name: "LineTree",
      component: () => import("@/views/default/able/line-tree.vue"),
      meta: {
        title: $t("menus.hsLineTree")
      }
    },
    {
      path: "/able/debounce",
      name: "Debounce",
      component: () => import("@/views/default/able/debounce.vue"),
      meta: {
        title: $t("menus.hsDebounce")
      }
    },
    {
      path: "/able/barcode",
      name: "BarCode",
      component: () => import("@/views/default/able/barcode.vue"),
      meta: {
        title: $t("menus.hsBarcode")
      }
    },
    {
      path: "/able/qrcode",
      name: "QrCode",
      component: () => import("@/views/default/able/qrcode.vue"),
      meta: {
        title: $t("menus.hsQrcode")
      }
    },
    {
      path: "/able/cascader",
      name: "Cascader",
      component: () => import("@/views/default/able/cascader.vue"),
      meta: {
        title: $t("menus.hsCascader")
      }
    },
    {
      path: "/able/swiper",
      name: "Swiper",
      component: () => import("@/views/default/able/swiper.vue"),
      meta: {
        title: $t("menus.hsSwiper")
      }
    },
    {
      path: "/able/virtualList",
      name: "VirtualList",
      component: () => import("@/views/default/able/virtual-list/index.vue"),
      meta: {
        title: $t("menus.hsVirtualList")
      }
    },
    {
      path: "/able/pdf",
      name: "Pdf",
      component: () => import("@/views/default/able/pdf.vue"),
      meta: {
        title: $t("menus.hsPdf")
      }
    },
    {
      path: "/able/excel",
      name: "Excel",
      component: () => import("@/views/default/able/excel.vue"),
      meta: {
        title: $t("menus.hsExcel")
      }
    },
    {
      path: "/able/infiniteScroll",
      name: "InfiniteScroll",
      component: () => import("@/views/default/able/infinite-scroll.vue"),
      meta: {
        title: $t("menus.hsInfiniteScroll")
      }
    },
    {
      path: "/able/sensitive",
      name: "Sensitive",
      component: () => import("@/views/default/able/sensitive.vue"),
      meta: {
        title: $t("menus.hsSensitive"),
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/able/pinyin",
      name: "Pinyin",
      component: () => import("@/views/default/able/pinyin.vue"),
      meta: {
        title: $t("menus.hsPinyin"),
        extraIcon: "IF-pure-iconfont-new svg"
      }
    }
  ]
} as RouteConfigsTable;
