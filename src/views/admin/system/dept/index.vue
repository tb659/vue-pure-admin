<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useData } from "./data";
import { useHook } from "./hook";
import { ref } from "vue";
import Write from "./modules/Write.vue";
import { DIALOG_WIDTH_TYPE } from "@/utils/constants";

import AddFill from "~icons/ri/add-circle-line";

defineOptions({
  name: "Dept",
});

const writeRef = ref<ComponentRef<typeof Write>>();

const { searchSchema, formSchema, tableColumns } = useData();

const {
  title,
  visible,
  loading,
  elTableRef,
  tableState,
  operationList,
  tableRegister,
  handleAdd,
  handleSubmit,
  setSearchParams,
} = useHook();
</script>

<template>
  <div class="main">
    <!-- 查询区域 -->
    <MtSearch :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <MtTableBar title="部门列表" :table-ref="elTableRef" :columns="tableColumns" @refresh="setSearchParams">
      <template #buttons>
        <el-button v-if="false" v-auth="'添加部门'" type="primary" :icon="useRenderIcon(AddFill)" @click="handleAdd">
          添加部门
        </el-button>
      </template>
      <template #default="{ size, dynamicColumns }">
        <MtTable
          row-key="id"
          default-expand-all
          :size="size"
          :showOverflowTooltip="false"
          :columns="dynamicColumns"
          :operations="operationList"
          :data="tableState.tableList"
          :loading="tableState.loading"
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
      <Write ref="writeRef" :form-schema="formSchema" :current-row="tableState.currentRow" :table-list="tableState.tableList" />
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="() => handleSubmit(writeRef)"> 确认 </el-button>
      </template>
    </el-dialog>
  </div>
</template>
