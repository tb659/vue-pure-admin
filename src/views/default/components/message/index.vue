<script setup lang="ts">
import { h } from "vue";
import { msg } from "@/utils/message";
import hot from "@/assets/svg/hot.svg?component";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Check from "@iconify-icons/ep/check";

defineOptions({
  name: "Message"
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium"> Message提示 </span>
      </div>
    </template>

    <h4 class="mb-4">element-plus 的消息提示，点击弹出提示信息</h4>

    <el-space wrap>
      <el-button type="info" @click="msg.info('Info类型消息', { customClass: 'el' })"> Info </el-button>
      <el-button type="success" @click="msg.success('Success类型消息', { customClass: 'el' })"> Success </el-button>
      <el-button type="warning" @click="msg.warning('Warning类型消息', { customClass: 'el' })"> Warning </el-button>
      <el-button type="danger" @click="msg.error('Error类型消息', { customClass: 'el' })"> Error </el-button>
      <el-button @click="msg.info('可关闭消息', { customClass: 'el', showClose: true })"> 可关闭 </el-button>
      <el-button
        @click="
          msg.success('分组消息合并', {
            customClass: 'el',
            grouping: true
          })
        "
      >
        分组消息合并
      </el-button>
      <el-button
        @click="
          msg.info('自定义消息图标', {
            customClass: 'el',
            icon: useRenderIcon(Check)
          })
        "
      >
        自定义图标
      </el-button>
      <el-button
        @click="
          msg.info('3秒后关闭', {
            customClass: 'el',
            duration: 3000,
            onClose: () => msg.success('消息已关闭', { customClass: 'el' })
          })
        "
      >
        自定义延时关闭时间并设置关闭后其他操作
      </el-button>
      <el-button
        @click="
          msg.info(h('p', null, [h('span', null, 'Message can be '), h('i', { style: 'color: teal' }, 'VNode')]), {
            customClass: 'el'
          })
        "
      >
        自定义内容
      </el-button>
      <el-button
        @click="
          msg.info('<strong>This is <i>HTML</i> string</strong>', {
            customClass: 'el',
            dangerouslyUseHTMLString: true
          })
        "
      >
        HTML 片段作为正文内容
      </el-button>
    </el-space>

    <el-divider />

    <h4 class="mb-4">
      类似 Ant Design 风格的消息提示，点击弹出提示信息（基于 ElMessage 样式改版，不会影响 ElMessage
      原本样式，使用和打包大小成本极低并适配暗黑模式）
    </h4>

    <el-space wrap>
      <el-button type="info" @click="msg.info('Info类型消息')">Info</el-button>
      <el-button type="success" @click="msg.success('Success类型消息')"> Success </el-button>
      <el-button type="warning" @click="msg.warning('Warning类型消息')"> Warning </el-button>
      <el-button type="danger" @click="msg.error('Error类型消息')"> Error </el-button>
      <el-button @click="msg.info('可关闭消息', { showClose: true })"> 可关闭 </el-button>
      <el-button @click="msg.info('分组消息合并', { grouping: true })"> 分组消息合并 </el-button>
      <el-button
        @click="
          msg.info('自定义消息图标', {
            icon: hot
          })
        "
      >
        自定义图标
      </el-button>
      <el-button
        @click="
          msg.info('3秒后关闭', {
            duration: 3000,
            onClose: () => msg.success('消息已关闭')
          })
        "
      >
        自定义延时关闭时间并设置关闭后其他操作
      </el-button>
      <el-button @click="msg.info(h('p', null, [h('span', null, 'Message can be '), h('i', { style: 'color: teal' }, 'VNode')]))">
        自定义内容
      </el-button>
      <el-button @click="msg.success('<strong>This is <i>HTML</i> string</strong>')"> HTML 片段作为正文内容 </el-button>
    </el-space>

    <el-divider />

    <el-button @click="msg.closeAll"> 关闭所有消息提示 </el-button>
  </el-card>
</template>
