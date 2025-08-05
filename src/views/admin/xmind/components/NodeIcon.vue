<script setup lang="ts">
/**
 * @Desc: 节点图标内容设置
 */
import icon from "../config/icon";
import { nodeIconList } from "simple-mind-map/src/svg/icons";
import { emitter } from "@/utils/mitt";
import { $t, transformI18n } from "@/plugins/i18n";
import { onBeforeUnmount, onMounted, ref } from "vue";

defineOptions({
  name: "NodeIcon",
});

const nodeIconListConcat = ref([...nodeIconList, ...icon]);
const dialogVisible = ref(false);
const iconList = ref([]);
const activeNodes = ref([]);

onMounted(() => {
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
    let firstNode = activeNodes.value[0];
    iconList.value = firstNode.getData("icon") || [];
  } else {
    iconList.value = [];
  }
}

function handleShowNodeIcon() {
  dialogVisible.value = true;
}
function getHtml(icon) {
  return /^<svg/.test(icon) ? icon : `<img src="${icon}" />`;
}
/**
 * @Desc: 设置icon
 */
function setIcon(type, name) {
  let key = type + "_" + name;
  let index = iconList.value.findIndex(item => {
    return item === key;
  });
  // 删除icon
  if (index !== -1) {
    iconList.value.splice(index, 1);
  } else {
    let typeIndex = iconList.value.findIndex(item => {
      return item.split("_")[0] === type;
    });
    // 替换icon
    if (typeIndex !== -1) {
      iconList.value.splice(typeIndex, 1, key);
    } else {
      // 增加icon
      iconList.value.push(key);
    }
  }
  activeNodes.value.forEach(node => {
    node.setIcon([...iconList.value]);
  });
}
</script>
<template>
  <el-dialog v-model="dialogVisible" custom-class="nodeIconDialog" :title="transformI18n($t('nodeIcon.title'))">
    <div v-for="item in nodeIconListConcat" :key="item.name" class="item">
      <div class="title">{{ item.name }}</div>
      <div class="list">
        <div
          v-for="icon in item.list"
          :key="icon.name"
          class="icon"
          :class="{ selected: iconList.includes(item.type + '_' + icon.name) }"
          @click="setIcon(item.type, icon.name)"
          v-html="getHtml(icon.icon)"
        />
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.nodeIconDialog {
  :deep(.el-dialog__body) {
    padding: 0 20px;
  }

  .deleteBtn {
    margin-bottom: 20px;
  }

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
            width: 28px;
            height: 28px;
            content: "";
            border: 2px solid #409eff;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
