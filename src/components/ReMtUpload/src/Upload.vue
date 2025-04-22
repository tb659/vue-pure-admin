<script setup lang="ts">
import { cloneDeep } from "lodash-es";
import { ref, computed, useAttrs } from "vue";
import { Delete, Download, Plus, ZoomIn, Document, Close } from "@element-plus/icons-vue";

import { fileApi } from "@/api/file";

import { msg } from "@/utils/msg";
import { getToken } from "@/utils/cookie";
import propTypes from "@/utils/propTypes";
import { TOKEN_KEY } from "@/utils/constants";
import { httpConfig } from "@/utils/http/config";
import { isArray, isBoolean } from "@/utils/is";
import { useCommonStoreHook } from "@/store/modules/common";

defineOptions({
  name: "MtUpload",
});

const props = defineProps({
  /** 是否展示列表 */
  // showFileList: propTypes.bool.def(true),
  /** 数量限制 */
  // limit: propTypes.number.def(8),
  /** 外部传入的上传地址 */
  outUploadUrl: propTypes.string.def(""),
  /** 外部定制高度 */
  inputStyleHeight: propTypes.string.def(""),
  /** 组件样式 */
  listType: propTypes.oneOf(["picture-card", "list", "text"]).def("picture-card"),
  /** 是否禁用操作 */
  disabled: propTypes.bool.def(false),
  /** 多个上传 */
  multiple: propTypes.bool.def(false),
  /** 是否显示上传按钮 */
  showUploadButton: propTypes.bool.def(true),
});

const emit = defineEmits(["get-res", "emitValue"]);

// 组件实例
const uploadRef = ref();
// 上传地址
const uploadUrl = ref(props.outUploadUrl || httpConfig.baseURL + fileApi.getBaseUrl() + fileApi.getUrl().upload);
// 下载地址
const downloadUrl = ref(httpConfig.baseURL + fileApi.getBaseUrl() + fileApi.getUrl().download);
// 请求头
const headerObj = ref({ [TOKEN_KEY]: getToken() });
// 文件列表
const fileDataList = ref([]);
const originFileDataList = ref([]);
// 单文件名称
const fileName = ref("");
// 详情禁止操作
// const disabled = ref(false);
// 上传图标实例
const uploadIconDom = ref(null);
// 预览
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
// 传入的props和attrs
const getBindValue = computed(() => {
  const bindValue: Recordable = { ...props, ...useAttrs() };
  // 特殊处理 list-type show-file-list
  bindValue["list-type"] && (bindValue.listType = bindValue["list-type"]);
  isBoolean(bindValue["show-file-list"]) && (bindValue.showFileList = bindValue["show-file-list"]);
  // console.log("文件属性--------", bindValue);
  // 空数据不回填
  bindValue.modelValue && bindValue.modelValue !== "[]" && initBackFile(bindValue);
  return bindValue;
});

// 文件回填
function initBackFile(bindValue) {
  try {
    const fileList = JSON.parse(bindValue.modelValue);
    if (bindValue.listType === "picture-card") {
      // 卡片缩略图
      fileList.forEach(file => (file.url = `${downloadUrl.value}?fileName=${file.fileName}`));
    } else if (bindValue.listType === "text") {
      // 单文件
      fileName.value = fileList[0]?.originName;
    }
    fileDataList.value = cloneDeep(fileList);
    originFileDataList.value = cloneDeep(fileList);
  } catch (error) {
    console.log(error);
  }
}

// 文件超出限制上传个数时的钩子
function exceed(files) {
  if (files.length > getBindValue.value.limit) {
    msg.warning("文件超出个数");
  }
}

// 文件预览的钩子
function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}
// 文件上传之前的钩子
function beforeUpload(file) {
  const { fileSizeLimit } = useCommonStoreHook();
  if (!fileSizeLimit && file.size / 1024 / 1024 > parseInt("20MB")) {
    msg.warning(
      "当前系统未设置文件上传大小限制,默认20MB。请在字典管理菜单中，新增一条字典：字典编码为file_size_limit, 字典内容为MB结尾的文件大小数值（实例20MB）",
      { duration: 0, showClose: true },
    );
    return false;
  } else if (file.size / 1024 / 1024 > parseInt(fileSizeLimit)) {
    msg.warning(
      `当前系统已设置文件上传大小限制${fileSizeLimit}。请在字典管理菜单中，根据字典编码file_size_limit搜索后点击编辑进行调整`,
      { duration: 0, showClose: true },
    );
    return false;
  }
  return true;
}

// 文件上传成功的钩子
function handleSuccess(response, file, fileList, needEmit = true) {
  // 上传出错
  if (response && response.code !== httpConfig.resultCode) return msg.error(response.message || response.msg);
  // 组件外部上传地址，外部处理上传事件
  if (props.outUploadUrl) return emit("get-res", response);

  fileDataList.value = cloneDeep(fileList);
  // 处理是否展示上传图标
  uploadIconDom.value = uploadRef.value?.$el?.querySelector(".el-upload");
  // 之前的添加样式，隐藏起来，只能选择一张图片
  hiddenUploadIcon(fileList.length === getBindValue.value.limit);
  // 处理文件抛出
  handleFileDataEmit(needEmit);
}

// 文件移除文件时的钩子
function handleRemove(file) {
  if (!file.id) {
    // 卡片移除
    const index = fileDataList.value.findIndex(f => f.url === file.url);
    fileDataList.value.splice(index, 1);
    originFileDataList.value = cloneDeep(fileDataList.value);
  } else {
    // 列表单个移除
    const index = originFileDataList.value.findIndex(f => f.id === file.id);
    originFileDataList.value.splice(index, 1);
    fileDataList.value = cloneDeep(originFileDataList.value);
  }
  // 处理是否展示上传图标
  hiddenUploadIcon(false);
  // 处理文件抛出
  handleFileDataEmit(true);
}

// 下载文件
function handleDownload(file) {
  fileApi.downloadFileByOpen(file?.id ? file.fileName : fileDataList.value[0].fileName);
}

// 处理文件抛出
function handleFileDataEmit(needEmit) {
  const fileData = fileDataList.value.map(file => {
    const item = {
      id: file.response?.data?.id || file.id,
      fileName: file.response?.data?.fileName || file.fileName,
      originName: file.response?.data?.originalFileName || file.originName,
    };
    return item;
  });
  fileName.value = fileDataList.value.length ? fileData[0]?.originName : "";
  originFileDataList.value = fileData;
  // 多个文件都返回了 才外抛
  fileData.filter(f => f.id).length === fileDataList.value.length && needEmit && emitValue(JSON.stringify(fileData));
}

// 是否展示上传图标
function hiddenUploadIcon(show) {
  uploadIconDom.value = uploadRef.value?.$el?.querySelector(".el-upload");
  uploadIconDom.value && (uploadIconDom.value.style.display = !show ? "inline-block" : "none");
}
// 事件抛出
function emitValue(val) {
  emit("emitValue", isArray(val) && val.length ? val.join(",") : val);
}
</script>
<template>
  <div class="break-words upload-container">
    <!-- 卡片缩略图形式 -->
    <div v-if="getBindValue.listType === 'picture-card'">
      <el-upload
        ref="uploadRef"
        v-model:file-list="fileDataList"
        class="upload picture-card"
        list-type="picture-card"
        :action="uploadUrl"
        :headers="headerObj"
        :showFileList="true"
        v-bind="getBindValue"
        :on-exceed="exceed"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      >
        <div class="upload-icon-own">
          <el-icon> <Plus /> </el-icon>
        </div>
        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <el-icon> <ZoomIn /> </el-icon>
              </span>
              <span class="el-upload-list__item-delete" @click="handleDownload(file)">
                <el-icon> <Download /> </el-icon>
              </span>
              <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                <el-icon> <Delete /> </el-icon>
              </span>
            </span>
          </div>
        </template>
      </el-upload>
    </div>
    <!-- 列表文件名称 -->
    <div v-else-if="getBindValue.listType === 'list'">
      <el-upload
        v-if="showUploadButton"
        ref="uploadRef"
        v-model:file-list="fileDataList"
        class="upload list"
        :action="uploadUrl"
        :headers="headerObj"
        :showFileList="false"
        :on-exceed="exceed"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :style="{ height: fileDataList.length > 1 ? 'auto' : inputStyleHeight }"
        v-bind="getBindValue"
        list-type="text"
      >
        <el-button :disabled="getBindValue.disabled" class="h-30px">
          <el-icon> <Plus /> </el-icon>
          <span>上传</span>
        </el-button>
      </el-upload>
      <ul class="file-list-own">
        <li v-for="(item, index) in originFileDataList" :key="index" class="file-item-own">
          <div class="flex items-center justify-between">
            <div class="flex items-center" @click="handleDownload(item)">
              <el-icon><Document /></el-icon>
              <el-link type="primary" :underline="false" class="ml-[5px]">{{ item.originName }}</el-link>
            </div>
            <el-icon v-show="!getBindValue.disabled" class="pointer" @click="handleRemove(item)"><Close /></el-icon>
          </div>
        </li>
      </ul>
    </div>
    <!-- 列表文件名称 -->
    <div v-else-if="getBindValue.listType === 'text'">
      <el-upload
        v-if="showUploadButton"
        v-show="!fileName"
        ref="uploadRef"
        v-model:file-list="fileDataList"
        class="upload text"
        :action="uploadUrl"
        :headers="headerObj"
        :showFileList="false"
        :on-exceed="exceed"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        v-bind="getBindValue"
      >
        <el-button :disabled="getBindValue.disabled" class="w-full h-[30px]">
          <el-icon> <Plus /> </el-icon>
          <span>上传</span>
        </el-button>
      </el-upload>
      <div v-show="fileName" class="relative">
        <el-input v-model="fileName" readonly class="truncate" />
        <el-icon class="!absolute !right-[30px] top-[10px] pointer" @click="handleDownload">
          <Download />
        </el-icon>
        <el-icon v-show="!getBindValue.disabled" class="!absolute !right-[10px] top-[10px] pointer" @click="handleRemove">
          <Close />
        </el-icon>
      </div>
    </div>
    <div v-else>文件上传属性[listType]不正确</div>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<style lang="scss">
$width: 100px;

.upload-container {
  .upload.picture-card {
    height: $width;
    overflow-y: scroll;

    .el-upload {
      position: relative;
      width: $width;
      height: $width;
      overflow: hidden;
      line-height: $width;
      cursor: pointer;

      .avatar-uploader-icon {
        width: $width;
        height: $width;
        font-size: 30px;
        line-height: $width;
        color: #8c939d;
        text-align: center;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
      }

      .avatar {
        display: block;
      }
    }

    .upload-icon-own {
      display: flex;
      align-items: center;
      justify-content: center;
      width: $width;
      height: $width;
    }

    .el-upload-list {
      height: $width;

      .el-upload-list__item {
        width: $width;
        height: $width;
      }
    }
  }

  .upload-text {
    .el-upload--text {
      width: 100%;
    }
  }
}

.el-input__inner[type="text"] {
  padding-right: 20px;
  text-overflow: ellipsis;
}
</style>
