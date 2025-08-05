<!-- <script setup>
/**
 * @Desc: 快捷键功能
 */
import { ref, onMounted, nextTick, computed } from 'vue'
import Sidebar from './Sidebar'
import { shortcutKeyList } from '../config'
import { useI18n } from "vue-i18n";
import { emitter } from "@/utils/mitt";

const sidebar = ref(null) // 声明一个 ref 来存放该元素的引用   必须和模板里的 ref 同名
const { locale } = useI18n();
const shortcutKeyList = computed(() => {
  shortcutKeyList: {
    return shortcutKeyList[this.$i18n.locale] || shortcutKeyList.zh
  }
})

onMounted(() => {
  emitter.on('showShortcutKey', () => {
    sidebar.value.show = false
    nextTick(() => {
      sidebar.value.show = true
    })
  })
})
</script> -->

<script setup lang="ts">
import Sidebar from "./Sidebar.vue";
import { shortcutKeyList } from "../config";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { useI18n } from "vue-i18n";
import { ref, computed, watch } from "vue";

defineOptions({
  name: "ShortcutKey",
});

const sidebar = ref(null);
const { locale } = useI18n();
const activeSidebar = computed(() => useXmindStoreHook().getActiveSidebar);
const isDark = computed(() => useXmindStoreHook().getIsDark);
const shortcutKeyListData = computed(() => shortcutKeyList[locale] || shortcutKeyList.zh);

watch(
  () => activeSidebar.value,
  val => {
    if (!sidebar.value) return;
    sidebar.value.show = val === "shortcutKey";
  },
  { immediate: true },
);
</script>
<template>
  <Sidebar ref="sidebar" :title="$t('shortcutKey.title')">
    <div class="box" :class="{ isDark: isDark }">
      <div v-for="item in shortcutKeyListData" :key="item.type">
        <div class="title">{{ item.type }}</div>
        <div v-for="item2 in item.list" :key="item2.value" class="list">
          <div class="item">
            <span v-if="item2.icon" class="icon iconfont" :class="[item2.icon]" />
            <span class="name" :title="item2.name">{{ item2.name }}</span>
            <div class="value" :title="item2.value">{{ item2.value }}</div>
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

    .list {
      .item {
        .icon {
          color: hsl(0deg 0% 100% / 60%);
        }

        .name {
          color: hsl(0deg 0% 100% / 60%);
        }

        .value {
          color: hsl(0deg 0% 100% / 30%);
        }
      }
    }
  }

  .title {
    margin: 26px 0 20px;
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  .list {
    font-size: 14px;

    .item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;

      .icon {
        margin-right: 16px;
        font-size: 16px;
      }

      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        color: #333;
        white-space: nowrap;
      }

      .value {
        margin-left: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #909090;
        white-space: nowrap;
      }
    }
  }
}
</style>
