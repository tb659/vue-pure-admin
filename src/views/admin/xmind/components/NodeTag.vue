<script setup lang="ts">
/**
 * @Desc: 节点标签内容设置
 */
import { onBeforeMount, onMounted, ref } from "vue";
import { generateColorByContent } from "simple-mind-map/src/utils/index";
import { emitter } from "@/utils/mitt";

const dialogVisible = ref(false);
const tagArr = ref([]);
const tag = ref("");
const activeNodes = ref([]);
const max = ref(5);

onMounted(() => {
  emitter.on("node_active", handleNodeActive);
  emitter.on("showNodeTag", handleShowNodeTag);
});

onBeforeMount(() => {
  emitter.off("node_active", handleNodeActive);
  emitter.off("showNodeTag", handleShowNodeTag);
});

const handleNodeActive = args => {
  activeNodes.value = [...args[1]];
  if (activeNodes.value.length > 0) {
    let firstNode = activeNodes.value[0];
    tagArr.value = firstNode.getData("tag") || [];
  } else {
    tagArr.value = [];
    tag.value = "";
  }
};

const handleShowNodeTag = () => {
  emitter.emit("startTextEdit");
  dialogVisible.value = true;
};

/**
 * @Desc: 添加
 */
const add = () => {
  tagArr.value.push(tag.value);
  tag.value = "";
};

/**
 * @Desc: 删除
 */
const del = index => {
  tagArr.value.splice(index, 1);
};

/**
 * @Desc: 取消
 */
const cancel = () => {
  dialogVisible.value = false;
  emitter.emit("endTextEdit");
};

/**
 * @Desc:  确定
 */
const confirm = () => {
  activeNodes.value.forEach(node => {
    node.setTag(tagArr.value);
  });
  cancel();
};
</script>

<template>
  <el-dialog v-model="dialogVisible" body-class="nodeTagDialog" :title="$t('nodeTag.title')">
    <el-input
      v-model="tag"
      :disabled="tagArr.length >= max"
      :placeholder="$t('nodeTag.addTip')"
      @keyup.enter="add"
      @keyup.stop
      @keydown.stop
    />
    <div class="tagList">
      <div
        v-for="(item, index) in tagArr"
        :key="index"
        class="tagItem"
        :style="{
          backgroundColor: generateColorByContent(item),
        }"
      >
        {{ item }}
        <div class="delBtn" @click="del(index)">
          <span class="iconfont iconshanchu" />
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">{{ $t("dialog.cancel") }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t("dialog.confirm") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.nodeTagDialog {
  .tagList {
    display: flex;
    flex-wrap: wrap;
    margin-top: 5px;

    .tagItem {
      position: relative;
      padding: 3px 5px;
      margin-right: 5px;
      margin-bottom: 5px;
      color: #fff;

      .delBtn {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        visibility: hidden;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: #fff;
        cursor: pointer;
        background-color: rgb(0 0 0 / 40%);
      }

      &:hover {
        .delBtn {
          visibility: visible;
        }
      }
    }
  }
}
</style>
