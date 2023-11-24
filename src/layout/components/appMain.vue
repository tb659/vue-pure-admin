<script setup lang="ts">
import Footer from "./footer/index.vue";
import { storageLocal, useGlobal } from "@pureadmin/utils";
import backTop from "@/assets/svg/back_top.svg?component";
import { h, computed, Transition, defineComponent, ref } from "vue";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { getConfig, responsiveStorageNameSpace } from "@/config";

const fixedHeader = ref(
  storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace()}configure`)?.fixedHeader ?? getConfig().FixedHeader
);

const { $storage, $config } = useGlobal<GlobalPropertiesApi>();

const isKeepAlive = computed(() => {
  return $config?.KeepAlive;
});

const transitions = computed(() => {
  return route => {
    return route.meta.transition;
  };
});

const hideTabs = computed(() => {
  return $storage?.configure.hideTabs;
});

const hideFooter = computed(() => {
  return $storage?.configure.hideFooter;
});

const getSectionStyle = computed(() => {
  return [hideTabs.value ? "padding-top: 48px" : "padding-top: 85px", !fixedHeader.value ? "padding-top: 0;" : ""];
});

const transitionMain = defineComponent({
  props: {
    route: {
      type: undefined,
      required: true
    }
  },
  render() {
    const transitionName = transitions.value(this.route)?.name || "fade-transform";
    const enterTransition = transitions.value(this.route)?.enterTransition;
    const leaveTransition = transitions.value(this.route)?.leaveTransition;
    return h(
      Transition,
      {
        name: enterTransition ? "pure-classes-transition" : transitionName,
        enterActiveClass: enterTransition ? `animate__animated ${enterTransition}` : undefined,
        leaveActiveClass: leaveTransition ? `animate__animated ${leaveTransition}` : undefined,
        mode: "out-in",
        appear: true
      },
      {
        default: () => [this.$slots.default()]
      }
    );
  }
});
</script>

<template>
  <section :class="[fixedHeader ? 'app-main' : 'app-main-nofixed-header']" :style="getSectionStyle">
    <router-view>
      <template #default="{ Component, route }">
        <el-scrollbar
          v-if="fixedHeader"
          :wrap-style="{
            display: 'flex'
          }"
          :view-style="{
            display: 'flex',
            flex: 'auto',
            overflow: 'auto',
            'flex-direction': 'column'
          }"
        >
          <el-backtop title="回到顶部" target=".app-main .el-scrollbar__wrap">
            <backTop />
          </el-backtop>
          <div class="grow">
            <transitionMain :route="route">
              <keep-alive v-if="isKeepAlive" :include="usePermissionStoreHook().cachePageList">
                <component :is="Component" :key="route.fullPath" class="main-content" />
              </keep-alive>
              <component :is="Component" v-else :key="route.fullPath" class="main-content" />
            </transitionMain>
          </div>
          <Footer v-if="!hideFooter" />
        </el-scrollbar>
        <div v-else class="grow">
          <transitionMain :route="route">
            <keep-alive v-if="isKeepAlive" :include="usePermissionStoreHook().cachePageList">
              <component :is="Component" :key="route.fullPath" class="main-content" />
            </keep-alive>
            <component :is="Component" v-else :key="route.fullPath" class="main-content" />
          </transitionMain>
        </div>
      </template>
    </router-view>

    <!-- 页脚 -->
    <Footer v-if="!hideFooter && !fixedHeader" />
  </section>
</template>

<style scoped>
.app-main {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
}

.app-main-nofixed-header {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.main-content {
  margin: 16px;
}
</style>
