<script setup lang="ts">
import { onBeforeUnmount, computed, type PropType, unref, nextTick, ref, watch, shallowRef } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { type IDomEditor, type IEditorConfig, i18nChangeLanguage } from "@wangeditor/editor";
import propTypes from "@/utils/propTypes";
import { isNumber, storageLocal } from "@pureadmin/utils";
import { TOKEN_KEY } from "@/utils/constants";
import { responsiveStorageNameSpace } from "@/config";
import { httpConfig } from "@/utils/http/config";
import { getToken } from "@/utils/auth";
import { msg } from "@/utils/msg";
import { merge } from "lodash-es";

let locale = storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace}locale`)?.locale;
locale === "zh" && (locale = "zh-CN"); // 处理编辑器中文

i18nChangeLanguage(locale);

const props = defineProps({
  editorId: propTypes.string.def("wangeEditor-1"),
  height: propTypes.oneOfType([Number, String]).def("500px"),
  editorConfig: {
    type: Object as PropType<IEditorConfig>,
    default: () => undefined,
  },
  modelValue: propTypes.string.def(""),
});

const emit = defineEmits(["change", "update:modelValue"]);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>();

const valueHtml = ref("");

watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueHtml)) return;
    valueHtml.value = val;
  },
  {
    immediate: true,
  },
);

// 监听
watch(
  () => valueHtml.value,
  (val: string) => {
    emit("update:modelValue", val);
  },
);

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
};

// 编辑器配置
const editorConfig = computed((): IEditorConfig => {
  return merge(
    {
      // 默认配置
      readOnly: false,
      customAlert: (s: string, t: string) => {
        // ... existing code ...
      },
      autoFocus: false,
      scroll: true,
      uploadImgShowBase64: false,
      MENU_CONF: {
        uploadImage: {
          server: httpConfig.uploadUrl,
          fieldName: "file",
          maxFileSize: 1 * 1024 * 1024,
          maxNumberOfFiles: 5,
          allowedFileTypes: ["image/jpeg", "image/png", "image/gif"],
          headers: {
            [TOKEN_KEY]: getToken(),
          },
          onSuccess(file: File, res: any) {
            console.log("上传成功", res);
          },
          onFailed(file: File, res: any) {
            msg.error(res.message);
          },
          onError(file: File, err: any, res: any) {
            msg.error(res.message);
          },
        },
        uploadVideo: {
          server: httpConfig.uploadUrl,
          fieldName: "file",
          maxFileSize: 1 * 1024 * 1024, // 1MB
          allowedFileTypes: ["video/mp4", "video/quicktime", "video/x-msvideo"],
          headers: {
            [TOKEN_KEY]: getToken(),
          },
          onSuccess(file: File, res: any) {
            console.log("视频上传成功", res);
          },
          onFailed(file: File, res: any) {
            msg.error(res.message);
          },
          onError(file: File, err: any, res: any) {
            msg.error(res.message);
          },
        },
      },
    },
    props.editorConfig || {},
  );
});
console.log(editorConfig.value);

const editorStyle = computed(() => {
  return {
    height: isNumber(props.height) ? `${props.height}px` : props.height,
  };
});

// 回调函数
const handleChange = (editor: IDomEditor) => {
  emit("change", editor);
};

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = unref(editorRef.value);
  if (editor === null) return;

  // 销毁，并移除 editor
  editor?.destroy();
});

const getEditorRef = async (): Promise<IDomEditor> => {
  await nextTick();
  return unref(editorRef.value) as IDomEditor;
};

defineExpose({
  getEditorRef,
});
</script>

<template>
  <div class="editor-wrap">
    <!-- 工具栏 -->
    <toolbar :editor="editorRef" :editorId="editorId" class="editor-toolbar" />
    <!-- 编辑器 -->
    <editor
      v-model="valueHtml"
      :editorId="editorId"
      :defaultConfig="editorConfig"
      :style="editorStyle"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.editor-wrap {
  $bg: #dcdfe6;

  z-index: 3000;
  border: 1px solid $bg;
  border-radius: 6px;

  .editor-toolbar {
    border-bottom: 1px solid $bg;
  }
}
</style>
