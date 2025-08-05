<script setup lang="ts">
import { Close } from "@element-plus/icons-vue";
import { ref } from "vue";

defineOptions({
  name: "NodeImageUpload",
});

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["changeImg"]);

const file = ref(null);

/**
 * @Desc: 图片选择事件
 */
function onImgUploadInputChange(e) {
  console.log("e", e);
  let file = e.target.files[0];
  selectImg(file);
}

/**
 * @Desc: 拖动上传图片
 */
function onDrop(e) {
  let dt = e.dataTransfer;
  let file = dt.files && dt.files[0];
  selectImg(file);
}

/**
 * @Desc: 选择图片
 */
function selectImg(file) {
  file.value = file;
  let fr = new FileReader();
  fr.readAsDataURL(file);
  fr.onload = e => {
    emit("changeImg", e.target.result);
  };
}

/**
 * @Desc: 获取图片大小
 */
function getSize() {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = props.value;
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = e => {
      resolve({
        width: 0,
        height: 0,
      });
    };
  });
}

/**
 * @Desc: 删除图片
 */
function deleteImg() {
  emit("changeImg", "");
  file.value = null;
}

defineExpose({
  getSize,
});
</script>

<template>
  <div class="imgUploadContainer">
    <div class="imgUploadPanel">
      <div v-if="!value" class="upBtn">
        <label
          for="img-upload-input"
          class="imgUploadInputArea"
          @dragenter.stop.prevent
          @dragover.stop.prevent
          @drop.stop.prevent="onDrop"
          >点击此处选择图片、或拖动图片到此</label
        >
        <input id="img-upload-input" type="file" accept="image/*" @change="onImgUploadInputChange" />
      </div>
      <div v-if="value" class="uploadInfoBox">
        <div class="previewBox" :style="{ backgroundImage: `url('${value}')` }" />
        <el-icon class="delBtn" @click="deleteImg">
          <Close />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.imgUploadContainer {
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgb(255 255 255 / 90%);

  .imgUploadPanel {
    position: relative;
    width: 100%;
    font-size: 22px;
    color: #909090;
    white-space: nowrap;
    cursor: default;
    user-select: none;

    .title {
      margin-bottom: 15px;
      font-size: 22px;
      font-weight: 700;
      color: hsl(218deg 9% 51% / 80%);
    }

    .closeBtn {
      position: absolute;
      top: 32px;
      right: 25px;
      cursor: pointer;
    }

    .imgUploadInputArea {
      display: block;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 200px;
      padding: 10px;
      font-size: 20px;
      color: rgb(51 51 51 / 40%);
      text-align: center;
      white-space: normal;
      cursor: pointer;
      outline: none;
      background-color: hsl(0deg 0% 87% / 60%);
      border: none;
    }

    #img-upload-input {
      display: none;
    }

    .uploadInfoBox {
      position: relative;
      width: 100%;
      height: 200px;
      background-color: hsl(0deg 0% 87% / 60%);

      .previewBox {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
      }

      .delBtn {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        cursor: pointer;
        background-color: #fff;
      }
    }
  }
}
</style>
