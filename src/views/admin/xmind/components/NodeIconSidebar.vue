<script setup lang="ts">
import Sidebar from "./Sidebar.vue";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { shortcutKeyList } from "../config";
import { nodeIconList } from "simple-mind-map/src/svg/icons";
import { mergerIconList } from "simple-mind-map/src/utils/index";
import icon from "../config/icon";
import image from "../config/image";
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import { emitter } from "@/utils/mitt";

defineOptions({
  name: "NodeIconSidebar",
});

const dialogVisible = ref(false);
const sidebar = ref(null);
const activeName = ref("icon");
const activeNodes = ref([]);
const iconList = ref([]);
const nodeImage = ref("");
const nodeIconListConcat = ref(mergerIconList([...nodeIconList, ...icon]));
const nodeImageList = [...image];
console.log(nodeImageList);

const activeSidebar = computed(() => useXmindStoreHook().getActiveSidebar);
const isDark = computed(() => useXmindStoreHook().getIsDark);

watch(
  () => activeSidebar.value,
  val => {
    if (!sidebar.value) return;
    sidebar.value.show = val === "nodeIconSidebar";
  },
  { immediate: true },
);
onBeforeMount(() => {
  emitter.on("node_active", handleNodeActive);
  emitter.on("showNodeIcon", handleShowNodeIcon);
});

onBeforeUnmount(() => {
  emitter.off("node_active", handleNodeActive);
  emitter.off("showNodeIcon", handleShowNodeIcon);
});

function handleNodeActive(args) {
  activeNodes.value = [...args[1]];
  if (activeNodes.value.length > 0) {
    if (activeNodes.value.length === 1) {
      let firstNode = activeNodes.value[0];
      nodeImage.value = firstNode.getData("image") || "";
      iconList.value = firstNode.getData("icon") || []; // 回显图标
    } else {
      nodeImage.value = "";
      iconList.value = [];
    }
  } else {
    nodeImage.value = "";
    iconList.value = [];
  }
}

function handleShowNodeIcon() {
  dialogVisible.value = true;
}
// 获取图标渲染方式
function getHtml(icon) {
  return /^<svg/.test(icon) ? icon : `<img src="${icon}" />`;
}
// 设置icon
function setIcon(type, name) {
  activeNodes.value.forEach(node => {
    const iconListData = [...(node.getData("icon") || [])];
    let key = type + "_" + name;
    let index = iconListData.findIndex(item => {
      return item === key;
    });
    // 删除icon
    if (index !== -1) {
      iconListData.splice(index, 1);
    } else {
      let typeIndex = iconListData.findIndex(item => {
        return item.split("_")[0] === type;
      });
      // 替换icon
      if (typeIndex !== -1) {
        iconListData.splice(typeIndex, 1, key);
      } else {
        // 增加icon
        iconListData.push(key);
      }
    }
    node.setIcon(iconListData);
    if (activeNodes.value.length === 1) {
      iconList.value = iconListData;
    }
  });
}
// 设置贴纸
function setImage(image) {
  activeNodes.value.forEach(node => {
    nodeImage.value = image.url;
    node.setImage({
      ...image,
    });
  });
}
</script>
<template>
  <Sidebar ref="sidebar" :title="$t('nodeIconSidebar.title')">
    <div class="box" :class="{ isDark: isDark }">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('nodeIconSidebar.icon')" name="icon" />
        <el-tab-pane :label="$t('nodeIconSidebar.sticker')" name="image" />
      </el-tabs>
      <div class="boxContent">
        <!-- 图标 -->
        <div v-if="activeName === 'icon'" class="iconBox">
          <div v-for="item in nodeIconListConcat" :key="item.name" class="item">
            <div class="title">{{ item.name }}</div>
            <div class="list">
              <div
                v-for="icon in item.list"
                :key="icon.name"
                class="icon"
                :class="{
                  selected: iconList.includes(item.type + '_' + icon.name),
                }"
                @click="setIcon(item.type, icon.name)"
                v-html="getHtml(icon.icon)"
              />
            </div>
          </div>
        </div>
        <!-- 贴纸 -->
        <div v-if="activeName === 'image'" class="imageBox">
          <div v-for="item in nodeImageList" :key="item.name" class="item">
            <div class="title">{{ item.name }}</div>
            <div class="list">
              <div
                v-for="image in item.list"
                :key="image.url"
                class="icon"
                :class="{
                  selected: nodeImage === image.url,
                }"
                @click="setImage(image)"
              >
                <img :src="image.url" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<style lang="scss" scoped>
.box {
  padding: 0 20px;

  &.isDark {
    .title {
      color: #fff;
    }
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  .boxContent {
    .iconBox {
      .item {
        margin-bottom: 20px;
        font-weight: bold;

        .title {
          margin-bottom: 10px;
        }

        .list {
          display: flex;
          flex-wrap: wrap;

          .icon {
            position: relative;
            width: 24px;
            height: 24px;
            margin-right: 10px;
            margin-bottom: 10px;
            cursor: pointer;

            :deep(img) {
              width: 100%;
              height: 100%;
            }

            :deep(svg) {
              width: 100%;
              height: 100%;
            }

            &.selected {
              &::after {
                position: absolute;
                top: -4px;
                left: -4px;
                width: 32px;
                height: 32px;
                content: "";
                border: 2px solid #409eff;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }

    .imageBox {
      margin-bottom: 20px;
      font-weight: bold;

      .title {
        margin-bottom: 10px;
      }

      .list {
        display: flex;
        flex-wrap: wrap;

        .icon {
          position: relative;
          width: 50px;
          height: 50px;
          margin-right: 10px;
          margin-bottom: 10px;
          cursor: pointer;

          :deep(img) {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          &.selected {
            &::after {
              position: absolute;
              top: -4px;
              left: -4px;
              width: 58px;
              height: 58px;
              content: "";
              border: 2px solid #409eff;
            }
          }
        }
      }
    }
  }
}
</style>
