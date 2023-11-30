<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useData } from "./data";
import { useHook } from "./hook";
import { ref } from "vue";
import Write from "./modules/Write.vue";

import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "Role"
});

const writeRef = ref<ComponentRef<typeof Write>>();

const { searchSchema, formSchema, tableColumns } = useData();

const { title, visible, loading, tableObject, operationList, register, handleAdd, handleSubmit, setSearchParams } = useHook();
</script>

<template>
  <div class="main">
    <!-- 查询区域 -->
    <mt-search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <mt-table-bar title="角色列表" :columns="tableColumns" @refresh="setSearchParams">
      <template #buttons>
        <el-button v-auth="'添加角色'" type="primary" :icon="useRenderIcon(AddFill)" @click="handleAdd"> 添加角色 </el-button>
      </template>
      <template #default="{ size, dynamicColumns }">
        <mt-table
          v-model:pageSize="tableObject.pageSize"
          v-model:currentPage="tableObject.currentPage"
          row-key="id"
          :size="size"
          :columns="dynamicColumns"
          :operations="operationList"
          :data="tableObject.tableList"
          :loading="tableObject.loading"
          :pagination="{ total: tableObject.total }"
          @register="register"
        />
      </template>
    </mt-table-bar>

    <el-dialog
      v-if="visible"
      v-model="visible"
      :title="title"
      draggable
      mix-width="680px"
      width="750px"
      :close-on-click-modal="false"
    >
      <write ref="writeRef" :form-schema="formSchema" :current-row="tableObject.currentRow" />
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="() => handleSubmit(writeRef)"> 确认 </el-button>
      </template>
    </el-dialog>
  </div>
</template>
