<script setup lang="ts">
import { useData } from "./data";
import { useHook } from "./hook";

defineOptions({
  name: "SystemLog",
});

const { searchSchema, tableColumns } = useData();

const { tableState, operationList, tableRegister, handleExport, setSearchParams } = useHook();
</script>

<template>
  <div class="main">
    <!-- 查询区域 -->
    <MtSearch show-export :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" @export="handleExport" />

    <MtTableBar title="日志管理" :columns="tableColumns" @refresh="setSearchParams">
      <template #buttons />
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
  </div>
</template>
