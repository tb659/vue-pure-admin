<script setup>
/**寅
 * @Desc: 主题
 */
import { ref, onMounted, computed, watch, onBeforeUnmount } from "vue";
import Sidebar from "./Sidebar.vue";
// import { themeList } from "simple-mind-map/src/constants/constant";
import { storeConfig } from "@/api/xmind";
import { themeMap } from "../config/constant.js";
import customThemeList from "../customThemes";
import { msg } from "@/utils/msg";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { emitter } from "@/utils/mitt";

defineOptions({
  name: "Theme",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});

const sidebar = ref(null);
const theme = ref("");
// const themeAllList = ref([...themeList, ...customThemeList].reverse());
const themeAllList = ref([...customThemeList].reverse());
// const themeAllList = ref([...themeList, ...customThemeList])
const activeName = ref("");
const groupList = ref([]);

const currentList = computed(() => {
  return groupList.value.length > 0 ? groupList.value.find(item => item.name === activeName.value).list : [];
});
const activeSidebar = computed(() => useXmindStoreHook().getActiveSidebar);
const isDark = computed(() => useXmindStoreHook().getIsDark);

watch(
  () => activeSidebar.value,
  val => {
    if (val === "theme") {
      theme.value = props.mindMap.getTheme();
      handleDark();
      sidebar.value.show = true;
    } else {
      sidebar.value.show = false;
    }
  },
);

onMounted(async () => {
  await initGroup();
  theme.value = props.mindMap.getTheme();
  handleDark();
  props.mindMap.on("view_theme_change", handleViewThemeChange);
});

onBeforeUnmount(() => {
  props.mindMap.off("view_theme_change", handleViewThemeChange);
});

const handleViewThemeChange = () => {
  theme.value = props.mindMap.getTheme();
  handleDark();
};

const initGroup = () => {
  let baiduThemes = [
    "default",
    "skyGreen",
    "classic2",
    "classic3",
    "classicGreen",
    "classicBlue",
    "blueSky",
    "brainImpairedPink",
    "earthYellow",
    "freshGreen",
    "freshRed",
    "romanticPurple",
    "pinkGrape",
    "mint",
  ];
  let baiduList = [];
  let classicsList = [];
  themeAllList.value.forEach(item => {
    if (baiduThemes.includes(item.value)) {
      baiduList.push(item);
    } else if (!item.dark) {
      classicsList.push(item);
    }
  });
  groupList.value = [
    {
      name: "经典",
      list: classicsList,
    },
    {
      name: "深色",
      list: themeAllList.value.filter(item => {
        return item.dark;
      }),
    },
    {
      name: "朴素",
      list: baiduList,
    },
  ];
  activeName.value = groupList.value[0].name;
};

/**寅
 * @Desc: 使用主题
 */
const useTheme = item => {
  if (theme.value === item.value) return;
  theme.value = item.value;
  handleDark();
  const customThemeConfig = props.mindMap.getCustomThemeConfig();
  const hasCustomThemeConfig = Object.keys(customThemeConfig).length > 0;
  if (hasCustomThemeConfig) {
    msg.confirm("你当前自定义过基础样式，是否覆盖？", "提示", {
      confirmButtonText: "覆盖",
      cancelButtonText: "保留",
      infoType: "warning",
      confirmBack: () => {
        props.mindMap.setThemeConfig({}, true);
        changeTheme(theme, {});
      },
      cancelBack: () => {
        changeTheme(theme, customThemeConfig);
      },
    });
  } else {
    changeTheme(theme, customThemeConfig);
  }
};

const changeTheme = (theme, config) => {
  emitter.emit("showLoading");
  props.mindMap.setTheme(theme.value);
  storeConfig({
    theme: {
      template: theme.value,
      config,
    },
  });
};

const handleDark = () => {
  let target = themeAllList.value.find(item => {
    return item.value === theme.value;
  });
  target && useXmindStoreHook().setIsDark(target.dark);
};
</script>
<template>
  <Sidebar ref="sidebar" :title="$t('theme.title')">
    <div class="themeList" :class="{ isDark: isDark }">
      <div class="tabList">
        <el-tabs v-model="activeName">
          <el-tab-pane v-for="group in groupList" :key="group.name" :label="group.name" :name="group.name" />
        </el-tabs>
      </div>
      <div
        v-for="item in currentList"
        :key="item.value"
        class="themeItem"
        :class="{ active: item.value === theme }"
        @click="useTheme(item)"
      >
        <div class="imgBox">
          <img :src="themeMap[item.value]" alt="" />
        </div>
        <div class="name">{{ item.name }}</div>
      </div>
    </div>
  </Sidebar>
</template>

<style lang="scss" scoped>
.themeList {
  padding: 20px;
  padding-top: 50px;

  &.isDark {
    .name {
      color: #fff;
    }
  }

  .tabList {
    position: absolute;
    top: 44px;
    left: 0;
    width: 100%;
    padding-left: 20px;
    background-color: #fff;
  }

  .themeItem {
    width: 100%;
    padding-bottom: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    border: 1px solid transparent;
    border-bottom: 1px solid #e9e9e9;
    transition: all 0.2s;

    &:last-of-type {
      border: none;
    }

    &:hover {
      box-shadow:
        0 1px 2px -2px rgb(0 0 0 / 16%),
        0 3px 6px 0 rgb(0 0 0 / 12%),
        0 5px 12px 4px rgb(0 0 0 / 9%);
    }

    &.active {
      border: 1px solid #67c23a;
    }

    .imgBox {
      width: 100%;

      img {
        width: 100%;
      }
    }

    .name {
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>
