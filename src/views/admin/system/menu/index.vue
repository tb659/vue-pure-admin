<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useHook } from "./hook";
import { ref } from "vue";
import Write from "./modules/Write.vue";
import { DIALOG_WIDTH_TYPE } from "@/utils/constants";

import AddFill from "~icons/fa/plus-circle";
import Trash from "~icons/fa/trash";

defineOptions({
  name: "SystemMenu",
});

const writeRef = ref<ComponentRef<typeof Write>>();

const {
  title,
  visible,
  loading,
  formSchema,
  elTableRef,
  tableState,
  searchSchema,
  tableColumns,
  operationList,
  tableRegister,
  handleAdd,
  handleDel,
  handleSubmit,
  setSearchParams,
} = useHook();
</script>

<template>
  <div class="main custom-style">
    <!-- 查询区域 -->
    <MtSearch :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <MtTableBar title="菜单列表" :table-ref="elTableRef" :columns="tableColumns" @refresh="setSearchParams">
      <template #buttons>
        <el-button v-auth="'添加目录'" type="primary" :icon="useRenderIcon(AddFill)" @click="handleAdd"> 添加目录 </el-button>
        <el-button v-auth="'删除'" type="primary" :icon="useRenderIcon(Trash)" @click="handleDel"> 批量删除 </el-button>
      </template>
      <template #default="{ size, dynamicColumns, setExpand }">
        <MtTable
          row-key="id"
          default-expand-all
          :size="size"
          :columns="dynamicColumns"
          :operations="operationList"
          :data="tableState.tableList"
          :loading="tableState.loading"
          @register="tableRegister"
          @reload-data="setExpand"
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
