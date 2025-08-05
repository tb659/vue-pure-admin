<script setup lang="ts">
/**
 * @Desc: 侧边栏触发器
 */
import { sidebarTriggerList } from "../config";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { useI18n } from "vue-i18n";
import { ref, computed } from "vue";

defineOptions({
  name: "SidebarTrigger",
});

const show = ref(true);
const { locale } = useI18n();

const activeSidebar = computed(() => useXmindStoreHook().getActiveSidebar);
const isDark = computed(() => useXmindStoreHook().getIsDark);
const triggerList = computed(() => sidebarTriggerList[locale] || sidebarTriggerList.zh);

function trigger(item) {
  useXmindStoreHook().setActiveSidebar(item.value);
}
</script>
<template>
  <div class="sidebarTriggerContainer" :class="{ hasActive: show && activeSidebar, show: show, isDark: isDark }" @click.stop>
    <div class="toggleShowBtn" :class="{ hide: !show }" @click="show = !show">
      <span class="iconfont iconjiantouyou" />
    </div>
    <div class="trigger">
      <div
        v-for="item in triggerList"
        :key="item.value"
        class="triggerItem"
        :class="{ active: activeSidebar === item.value }"
        @click="trigger(item)"
      >
        <div class="triggerIcon iconfont" :class="[item.icon]" />
        <div class="triggerName">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebarTriggerContainer {
  position: fixed;
  top: 50%;
  right: -60px;
  margin-top: 110px;
  transform: translateY(-50%);
  transition: all 0.3s;

  &.isDark {
    .trigger {
      background-color: #262a2e;

      .triggerItem {
        color: hsl(0deg 0% 100% / 60%);

        &:hover {
          background-color: hsl(0deg 0% 100% / 5%);
        }
      }
    }
  }

  &.show {
    right: 0;
  }

  &.hasActive {
    right: 305px;
  }

  .toggleShowBtn {
    position: absolute;
    top: 50%;
    left: -6px;
    z-index: 0;
    display: flex;
    align-items: center;
    width: 35px;
    height: 60px;
    padding-left: 4px;
    cursor: pointer;
    background: #409eff;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    transform: translateY(-50%);
    transition: left 0.1s linear;

    &.hide {
      left: -8px;

      span {
        transform: rotateZ(180deg);
      }
    }

    &:hover {
      left: -18px;
    }

    span {
      color: #fff;
      transition: all 0.1s;
    }
  }

  .trigger {
    position: relative;
    width: 60px;
    overflow: hidden;
    background-color: #fff;
    border-color: #eee;
    border-radius: 6px;
    box-shadow: 0 2px 16px 0 rgb(0 0 0 / 6%);

    .triggerItem {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 60px;
      color: #464646;
      white-space: nowrap;
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: #ededed;
      }

      &.active {
        font-weight: bold;
        color: #409eff;
      }

      .triggerIcon {
        margin-bottom: 5px;
        font-size: 18px;
      }

      .triggerName {
        font-size: 13px;
      }
    }
  }
}
</style>
