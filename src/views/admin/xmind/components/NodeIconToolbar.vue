<script setup lang="ts">
import { nodeIconList as _nodeIconList } from "simple-mind-map/src/svg/icons";
import icon from "../config/icon";
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { emitter } from "@/utils/mitt";

defineOptions({
  name: "NodeIconToolbar",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});
const allIconList = [..._nodeIconList, ...icon];

const nodeIconToolbar = ref(null);
const showNodeIconToolbar = ref(false);
const style = ref({
  left: "0px",
  top: "0px",
});
const node = ref(null);
const iconType = ref("");
const iconName = ref("");
const nodeIconList = ref([]);
const iconList = ref([]);

const activeSidebar = computed(() => useXmindStoreHook().getActiveSidebar);

onBeforeMount(() => {
  props.mindMap.on("node_icon_click", show);
  props.mindMap.on("draw_click", close);
  props.mindMap.on("svg_mousedown", close);
  props.mindMap.on("node_dblclick", close);
  props.mindMap.on("node_active", onNodeActive);
  props.mindMap.on("scale", onScale);
  emitter.on("close_node_icon_toolbar", close);
});
onMounted(() => {
  document.body.append(nodeIconToolbar.value);
});
onBeforeUnmount(() => {
  props.mindMap.off("node_icon_click", show);
  props.mindMap.off("draw_click", close);
  props.mindMap.off("svg_mousedown", close);
  props.mindMap.off("node_dblclick", close);
  props.mindMap.off("node_active", onNodeActive);
  props.mindMap.off("scale", onScale);
  emitter.off("close_node_icon_toolbar", close);
});
function show(node, icon) {
  node.value = node;
  iconType.value = icon.split("_")[0];
  iconName.value = icon.split("_")[1];
  nodeIconList.value = node.getData("icon") || [];
  iconList.value = [
    ...allIconList.find(item => {
      return item.type === iconType.value;
    }).list,
  ];
  updatePos();
  showNodeIconToolbar.value = true;
  if (activeSidebar.value === "nodeIconSidebar") {
    useXmindStoreHook().setActiveSidebar("");
  }
}
function close() {
  showNodeIconToolbar.value = false;
  node.value = null;
  iconType.value = "";
  iconName.value = "";
  nodeIconList.value = [];
  iconList.value = [];
  style.value.left = "0px";
  style.value.top = "0px";
}
function updatePos() {
  if (!node.value) return;
  const rect = node.value.getRect();
  style.value.left = rect.x + "px";
  style.value.top = rect.y + rect.height + "px";
}
function onScale() {
  updatePos();
}
function onNodeActive(nodeValue) {
  if (nodeValue === node.value) {
    return;
  }
  close();
}
function deleteIcon() {
  setIcon(iconName.value);
  close();
}
// 获取图标渲染方式
function getHtml(icon) {
  return /^<svg/.test(icon) ? icon : `<img src="${icon}" />`;
}
// 设置icon
function setIcon(name) {
  let key = iconType.value + "_" + name;
  let index = nodeIconList.value.findIndex(item => {
    return item === key;
  });
  // 删除icon
  if (index !== -1) {
    nodeIconList.value.splice(index, 1);
  } else {
    let typeIndex = nodeIconList.value.findIndex(item => {
      return item.split("_")[0] === iconType.value;
    });
    // 替换icon
    if (typeIndex !== -1) {
      nodeIconList.value.splice(typeIndex, 1, key);
      iconName.value = name;
    } else {
      // 增加icon
      nodeIconList.value.push(key);
    }
  }
  node.value.setIcon([...nodeIconList.value]);
}
</script>
<template>
  <div v-show="showNodeIconToolbar" ref="nodeIconToolbar" class="nodeIconToolbar" :style="style" @click.stop.passive>
    <div class="iconListBox">
      <div
        v-for="icon in iconList"
        :key="icon.name"
        class="icon"
        :class="{
          selected: nodeIconList.includes(iconType + '_' + icon.name),
        }"
        @click="setIcon(icon.name)"
        v-html="getHtml(icon.icon)"
      />
    </div>
    <div class="btnBox">
      <span class="btn iconfont iconshanchu" @click="deleteIcon" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nodeIconToolbar {
  position: fixed;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  width: 210px;
  max-height: 170px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgb(0 0 0 / 6%);
  border-radius: 8px;
  box-shadow: 0 2px 16px 0 rgb(0 0 0 / 6%);

  .iconListBox {
    width: 100%;
    height: 180px;
    padding: 10px;
    overflow-y: auto;

    .icon {
      position: relative;
      float: left;
      width: 24px;
      height: 24px;
      margin: 5px;
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
          width: 28px;
          height: 28px;
          content: "";
          border: 2px solid #409eff;
          border-radius: 50%;
        }
      }
    }
  }

  .btnBox {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 30px;
    border-top: 1px solid #eee;

    .btn {
      color: rgb(26 26 26 / 80%);
      cursor: pointer;
    }
  }
}
</style>
