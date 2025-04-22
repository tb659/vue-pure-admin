<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useData } from "./data";
import { useHook } from "./hook";
import { ref } from "vue";
import Write from "./modules/Write.vue";
import { DIALOG_WIDTH_TYPE } from "@/utils/constants";

import AddFill from "~icons/ri/add-circle-line";
import Trash from "~icons/fa/trash";

defineOptions({
  name: "Dict",
});

const writeRef = ref<ComponentRef<typeof Write>>();

const { searchSchema, formSchema, tableColumns, searchRegister } = useData();

const {
  title,
  visible,
  loading,
  tableState,
  operationList,
  tableRegister,
  handleAdd,
  handleDel,
  handleSubmit,
  handleExport,
  setSearchParams,
} = useHook();
</script>

<template>
  <div class="main">
    <!-- 查询区域 -->
    <MtSearch
      show-export
      :schema="searchSchema"
      @search="setSearchParams"
      @reset="setSearchParams"
      @export="handleExport"
      @register="searchRegister"
    />

    <MtTableBar title="字典列表" :columns="tableColumns" @refresh="setSearchParams">
      <template #buttons>
        <el-button v-auth="'添加字典'" type="primary" :icon="useRenderIcon(AddFill)" @click="handleAdd"> 添加字典 </el-button>
        <el-button v-auth="'删除'" type="primary" :icon="useRenderIcon(Trash)" @click="handleDel"> 批量删除 </el-button>
      </template>
      <template #default="{ size, dynamicColumns }">
        <MtTable
          v-model:pageSize="tableState.pageSize"
          v-model:pageNumber="tableState.pageNumber"
          sels-tag
          row-key="id"
          :size="size"
          :columns="dynamicColumns"
          :operations="operationList"
          :data="tableState.tableList"
          :loading="tableState.loading"
          :pagination="{ total: tableState.total }"
          @register="tableRegister"
        />
      </template>
    </MtTableBar>

    <el-dialog
      v-if="visible"
      v-model="visible"
      :title="title"
      draggable
      :mix-width="DIALOG_WIDTH_TYPE.SMALL"
      :width="DIALOG_WIDTH_TYPE.DEFAULT"
      :close-on-click-modal="false"
    >
      <Write ref="writeRef" :form-schema="formSchema" :current-row="tableState.currentRow" />
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="() => handleSubmit(writeRef)"> 确认 </el-button>
      </template>
    </el-dialog>
  </div>
</template>
