<script setup lang="ts">
import Color from "./Color.vue";
import { fontFamilyList, fontSizeList } from "../config";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { emitter } from "@/utils/mitt";

defineOptions({
  name: "RichTextToolbar",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});

const showRichTextToolbar = ref(false);
const style = ref({
  left: "0px",
  top: "0px",
});
const richTextToolbar = ref(null);
const fontColor = ref("");
const fontBackgroundColor = ref("");
const formatInfo = ref<Recordable>({});

const isDark = computed(() => useXmindStoreHook().getIsDark);

function onRichTextSelectionChange(e) {
  const hasRange = e[0];
  const rect = e[1];
  const formatInfo = e[2];
  if (hasRange) {
    style.value.left = rect.left + rect.width / 2 + "px";
    style.value.top = rect.top - 60 + "px";
    formatInfo.value = { ...(formatInfo || {}) };
  }
  showRichTextToolbar.value = hasRange;
}

function toggleBold() {
  formatInfo.value.bold = !formatInfo.value.bold;
  props.mindMap.richText.formatText({
    bold: formatInfo.value.bold,
  });
}

function toggleItalic() {
  formatInfo.value.italic = !formatInfo.value.italic;
  props.mindMap.richText.formatText({
    italic: formatInfo.value.italic,
  });
}

function toggleUnderline() {
  formatInfo.value.underline = !formatInfo.value.underline;
  props.mindMap.richText.formatText({
    underline: formatInfo.value.underline,
  });
}

function toggleStrike() {
  formatInfo.value.strike = !formatInfo.value.strike;
  props.mindMap.richText.formatText({
    strike: formatInfo.value.strike,
  });
}

function changeFontFamily(font) {
  formatInfo.value.font = font;
  props.mindMap.richText.formatText({
    font,
  });
}

function changeFontSize(size) {
  formatInfo.value.size = size;
  props.mindMap.richText.formatText({
    size: size + "px",
  });
}

function changeFontColor(color) {
  formatInfo.value.color = color;
  props.mindMap.richText.formatText({
    color,
  });
}

function changeFontBackgroundColor(background) {
  formatInfo.value.background = background;
  props.mindMap.richText.formatText({
    background,
  });
}

function removeFormat() {
  props.mindMap.richText.removeFormat();
}

onMounted(() => {
  emitter.on("rich_text_selection_change", onRichTextSelectionChange);
  document.body.append(richTextToolbar.value);
});
onBeforeUnmount(() => {
  emitter.off("rich_text_selection_change", onRichTextSelectionChange);
});
</script>
<template>
  <div
    v-show="showRichTextToolbar"
    ref="richTextToolbar"
    class="richTextToolbar"
    :style="style"
    :class="{ isDark: isDark }"
    @click.stop.passive
  >
    <el-tooltip :content="$t('richTextToolbar.bold')" placement="top">
      <div class="btn" :class="{ active: formatInfo.bold }" @click="toggleBold">
        <span class="icon iconfont iconzitijiacu" />
      </div>
    </el-tooltip>
    <el-tooltip :content="$t('richTextToolbar.italic')" placement="top">
      <div class="btn" :class="{ active: formatInfo.italic }" @click="toggleItalic">
        <span class="icon iconfont iconzitixieti" />
      </div>
    </el-tooltip>
    <el-tooltip :content="$t('richTextToolbar.underline')" placement="top">
      <div class="btn" :class="{ active: formatInfo.underline }" @click="toggleUnderline">
        <span class="icon iconfont iconzitixiahuaxian" />
      </div>
    </el-tooltip>
    <el-tooltip :content="$t('richTextToolbar.strike')" placement="top">
      <div class="btn" :class="{ active: formatInfo.strike }" @click="toggleStrike">
        <span class="icon iconfont iconshanchuxian" />
      </div>
    </el-tooltip>
    <el-tooltip :content="$t('richTextToolbar.fontFamily')" placement="top">
      <el-popover placement="bottom" trigger="hover">
        <template #reference>
          <div class="btn">
            <span class="icon iconfont iconxingzhuang-wenzi" />
          </div>
        </template>
        <div class="fontOptionsList" :class="{ isDark: isDark }">
          <div
            v-for="item in fontFamilyList"
            :key="item.value"
            class="fontOptionItem"
            :style="{ fontFamily: item.value }"
            :class="{ active: formatInfo.font === item.value }"
            @click="changeFontFamily(item.value)"
          >
            {{ item.name }}
          </div>
        </div>
      </el-popover>
    </el-tooltip>
    <el-tooltip :content="$t('richTextToolbar.fontSize')" placement="top">
      <el-popover placement="bottom" trigger="hover">
        <template #reference>
          <div class="btn">
            <span class="icon iconfont iconcase fontColor" />
          </div>
        </template>
        <div class="fontOptionsList" :class="{ isDark: isDark }">
          <div
            v-for="item in fontSizeList"
            :key="item"
            class="fontOptionItem"
            :style="{ fontSize: item + 'px' }"
            :class="{ active: formatInfo.size === item + 'px' }"
            @click="changeFontSize(item)"
          >
            {{ item }}px
          </div>
        </div>
      </el-popover>
    </el-tooltip>
    <el-tooltip :content="$t('richTextToolbar.color')" placement="top">
      <el-popover placement="bottom" trigger="hover">
        <template #reference>
          <div class="btn" :style="{ color: formatInfo.color }">
            <span class="icon iconfont iconzitiyanse" />
          </div>
        </template>
        <Color :color="fontColor" @change="changeFontColor" />
      </el-popover>
    </el-tooltip>
    <el-tooltip :content="$t('richTextToolbar.backgroundColor')" placement="top">
      <el-popover placement="bottom" trigger="hover">
        <template #reference>
          <div class="btn">
            <span class="icon iconfont iconbeijingyanse" />
          </div>
        </template>
        <Color :color="fontBackgroundColor" @change="changeFontBackgroundColor" />
      </el-popover>
    </el-tooltip>
    <el-tooltip :content="$t('richTextToolbar.removeFormat')" placement="top">
      <div class="btn" @click="removeFormat">
        <span class="icon iconfont iconqingchu" />
      </div>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.richTextToolbar {
  position: fixed;
  z-index: 2000;
  display: flex;
  align-items: center;
  height: 55px;
  background: #fff;
  border: 1px solid rgb(0 0 0 / 6%);
  border-radius: 8px;
  box-shadow: 0 2px 16px 0 rgb(0 0 0 / 6%);
  transform: translateX(-50%);

  &.isDark {
    background: #363b3f;

    .btn {
      color: #fff;

      &:hover {
        background: hsl(0deg 0% 100% / 5%);
      }
    }
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 55px;
    height: 55px;
    cursor: pointer;

    &:hover {
      background-color: #eefbed;
    }

    &.active {
      color: #12bb37;
    }

    .icon {
      font-size: 20px;

      &.fontColor {
        font-size: 26px;
      }
    }
  }
}

.fontOptionsList {
  width: 150px;

  &.isDark {
    .fontOptionItem {
      color: #fff;

      &:hover {
        background-color: hsl(0deg 0% 100% / 5%);
      }
    }
  }

  .fontOptionItem {
    display: flex;
    align-items: center;
    width: 100%;
    height: 30px;
    cursor: pointer;

    &:hover {
      background-color: #f7f7f7;
    }

    &.active {
      color: #12bb37;
    }
  }
}
</style>
