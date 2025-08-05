<script setup lang="ts">
import { emitter } from "@/utils/mitt";
import { $t, transformI18n } from "@/plugins/i18n";
import { ref, onMounted, onBeforeMount } from "vue";
/**
 * @Desc: 节点超链接内容设置
 */
const dialogVisible = ref(false);
const link = ref("");
const linkTitle = ref("");
const activeNodes = ref([]);
const protocol = ref("https");

onMounted(() => {
  emitter.on("node_active", handleNodeActive);
  emitter.on("showNodeLink", handleShowNodeLink);
});

onBeforeMount(() => {
  emitter.off("node_active", handleNodeActive);
  emitter.off("showNodeLink", handleShowNodeLink);
});

const handleNodeActive = args => {
  activeNodes.value = [...args[1]];
  if (activeNodes.value.length > 0) {
    let firstNode = activeNodes.value[0];
    link.value = firstNode.getData("hyperlink") || "";
    handleUrl(true);
    linkTitle.value = firstNode.getData("hyperlinkTitle") || "";
  } else {
    link.value = "";
    linkTitle.value = "";
  }
};

const removeProtocol = url => {
  return url.replace(/^https?:\/\//, "");
};

const handleUrl = (setProtocolNoneIfNotExist = false) => {
  const res = link.value.match(/^(https?):\/\//);
  if (res && res[1]) {
    protocol.value = res[1];
  } else if (!link.value) {
    protocol.value = "https";
  } else if (setProtocolNoneIfNotExist) {
    protocol.value = "none";
  }
  link.value = removeProtocol(link.value);
};

const handleShowNodeLink = () => {
  activeNodes.value[0].mindMap.keyCommand.pause();
  emitter.emit("startTextEdit");
  dialogVisible.value = true;
};

/**
 * @Desc: 取消
 */
const cancel = () => {
  dialogVisible.value = false;
  activeNodes.value[0].mindMap.keyCommand.recovery();
  emitter.emit("endTextEdit");
};

/**
 * @Desc:  确定
 */
const confirm = () => {
  activeNodes.value.forEach(node => {
    if (!link.value.startsWith("http://") && !link.value.startsWith("https://") && !link.value.startsWith("//")) {
      link.value = `//${link.value}`;
    }
    node.setHyperlink(link.value, linkTitle.value);
    node.setHyperlink((protocol.value === "none" ? "" : protocol.value + "://") + link.value, linkTitle.value);
    cancel();
  });
};
</script>

<template>
  <el-dialog v-model="dialogVisible" body-class="nodeHyperlinkDialog" :title="transformI18n($t('nodeHyperlink.title'))">
    <div class="item">
      <span class="name">{{ transformI18n($t("nodeHyperlink.link")) }}</span>
      <el-input v-model="link" size="small" placeholder="http://xxxx.com/" @keyup.stop @keydown.stop @blur="handleUrl()">
        <template #prepend>
          <el-select v-model="protocol" style="width: 80px">
            <el-option label="https" value="https" />
            <el-option label="http" value="http" />
            <el-option label="无" value="none" />
          </el-select>
        </template>
      </el-input>
    </div>
    <div class="item">
      <span class="name">{{ transformI18n($t("nodeHyperlink.name")) }}</span>
      <el-input v-model="linkTitle" size="small" @keyup.stop @keydown.stop />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">{{ transformI18n($t("dialog.cancel")) }}</el-button>
        <el-button type="primary" @click="confirm">{{ transformI18n($t("dialog.confirm")) }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.nodeHyperlinkDialog {
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .name {
      display: block;
      width: 50px;
    }
  }
}
</style>
