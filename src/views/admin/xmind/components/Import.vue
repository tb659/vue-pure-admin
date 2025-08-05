<script setup lang="ts">
/**
 * @Desc: 导入功能
 */
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
// import MindMap from 'simple-mind-map'
import xmind from "simple-mind-map/src/parse/xmind.js";
import markdown from "simple-mind-map/src/parse/markdown.js";
import { fileToBuffer } from "@/utils/file";
import { read, utils } from "xlsx";
import { msg } from "@/utils/msg";
import { emitter } from "@/utils/mitt";
import { useXmindStoreHook } from "@/store/modules/xmind";

defineOptions({
  name: "Import",
});

const route = useRoute();
const dialogVisible = ref(false);
const fileList = ref([]);

watch(
  () => dialogVisible.value,
  (val, oldVal) => {
    if (!val && oldVal) {
      fileList.value = [];
    }
  },
);

onMounted(() => {
  emitter.on("showImport", handleShowImport);
  emitter.on("handle_file_url", handleFileURL);
});

onBeforeMount(() => {
  emitter.off("showImport", handleShowImport);
  emitter.off("handle_file_url", handleFileURL);
});

const handleShowImport = () => {
  dialogVisible.value = true;
};

// 检查url中是否操作需要打开的文件
const handleFileURL = async () => {
  try {
    const fileURL = route.query.fileURL as string;
    if (!fileURL) return;
    const macth = /\.(smm|json|xmind|md|xlsx)$/.exec(fileURL);
    if (!macth) {
      return;
    }
    const type = macth[1];
    const res = await fetch(fileURL);
    const file = await res.blob();
    const data = {
      raw: file,
    };
    if (type === "smm" || type === "json") {
      handleSmm(data);
    } else if (type === "xmind") {
      handleXmind(data);
    } else if (type === "xlsx") {
      handleExcel(data);
    } else if (type === "md") {
      handleMd(data);
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * @Desc: 文件选择
 */
const onChange = file => {
  let reg = /\.(smm|xmind|json|xlsx|md)$/;
  if (!reg.test(file.name)) {
    msg.error("请选择.smm、.json、.xmind、.xlsx、.md文件");
    fileList.value = [];
  } else {
    fileList.value.push(file);
  }
};

/**
 * @Desc: 数量超出限制
 */
const onExceed = () => {
  msg.warning("最多只能选择一个文件");
};

/**
 * @Desc: 取消
 */
const cancel = () => {
  dialogVisible.value = false;
};

/**
 * @Desc: 确定导入
 */
const confirm = () => {
  if (fileList.value.length <= 0) {
    return msg.warning("请选择要导入的文件");
  }
  useXmindStoreHook().setIsHandleLocalFile(false);
  let file = fileList.value[0];
  if (/\.(smm|json)$/.test(file.name)) {
    handleSmm(file);
  } else if (/\.xmind$/.test(file.name)) {
    handleXmind(file);
  } else if (/\.xlsx$/.test(file.name)) {
    handleExcel(file);
  } else if (/\.md$/.test(file.name)) {
    handleMd(file);
  }
  cancel();
  useXmindStoreHook().setActiveSidebar(null);
};
/**
 * @Desc: 处理.smm文件
 */
const handleSmm = file => {
  let fileReader = new FileReader();
  fileReader.readAsText(file.raw);
  fileReader.onload = evt => {
    try {
      // @ts-ignore
      let data = JSON.parse(evt.target.result);
      if (typeof data !== "object") {
        throw new Error("文件内容有误");
      }
      emitter.emit("setData", data);
      msg.success("导入成功");
    } catch (error) {
      console.log(error);
      msg.error("文件解析失败");
    }
  };
  cancel();
};
/**
 * @Desc: 处理.xmind文件
 */
const handleXmind = async file => {
  try {
    // let data = await MindMap.xmind.parseXmindFile(file.raw)
    let data = await xmind.parseXmindFile(file.raw); // 将xmind解析方法从MindMap类上移除，改为按需引入方式使用
    emitter.emit("setData", data);
    msg.success("导入成功");
  } catch (error) {
    console.log(error);
    msg.error("文件解析失败");
  }
};
/**
 * @Desc: 处理.xlsx文件
 */
const handleExcel = async file => {
  try {
    const wb = read(await fileToBuffer(file.raw));
    const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
      header: 1,
    });
    if (data.length <= 0) {
      return;
    }
    let max = 0;
    data.forEach(arr => {
      if (arr["length"] > max) {
        max = arr["length"];
      }
    });
    let layers = [];
    let walk = layer => {
      if (!layers[layer]) {
        layers[layer] = [];
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i][layer]) {
          let node = {
            data: {
              text: data[i][layer],
            },
            children: [],
            _row: i,
          };
          layers[layer].push(node);
        }
      }
      if (layer < max - 1) {
        walk(layer + 1);
      }
    };
    walk(0);
    let getParent = (arr, row) => {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (row >= arr[i]._row) {
          return arr[i];
        }
      }
    };
    for (let i = 1; i < layers.length; i++) {
      let arr = layers[i];
      for (let j = 0; j < arr.length; j++) {
        let item = arr[j];
        let parent = getParent(layers[i - 1], item._row);
        if (parent) {
          parent.children.push(item);
        }
      }
    }
    emitter.emit("setData", layers[0][0]);
    msg.success("导入成功");
  } catch (error) {
    console.log(error);
    msg.error("文件解析失败");
  }
};
/**
 * @Desc: 处理markdown文件
 */
const handleMd = async file => {
  let fileReader = new FileReader();
  fileReader.readAsText(file.raw);
  fileReader.onload = async evt => {
    try {
      let data = await markdown.transformMarkdownTo(evt.target.result);
      emitter.emit("setData", data);
      msg.success("导入成功");
    } catch (error) {
      console.log(error);
      msg.error("文件解析失败");
    }
  };
};
</script>

<template>
  <el-dialog v-model="dialogVisible" custom-class="nodeImportDialog" :title="$t('import.title')" width="600px">
    <el-upload
      ref="upload"
      action="x"
      :file-list="fileList"
      :auto-upload="false"
      :multiple="false"
      :on-change="onChange"
      :limit="1"
      :on-exceed="onExceed"
    >
      <template #trigger>
        <el-button size="default" type="primary">{{ $t("import.selectFile") }}</el-button>
      </template>
      <template #tip>
        <div class="el-upload__tip">{{ $t("import.supportFile") }}</div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">{{ $t("dialog.cancel") }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t("dialog.confirm") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-upload__tip {
  margin: 0 0 0 5px;
}
</style>
