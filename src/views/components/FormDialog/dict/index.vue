<script setup lang="ts">
import { onMounted } from "vue";

import { useData } from "./data";
import { useHook } from "./hook";
import propTypes from "@/utils/propTypes";

defineOptions({
  name: "FormDialog",
});

defineProps({
  /** 表格选择数据回填 */
  selections: propTypes.array.def([]),
});

const emit = defineEmits(["get-sels"]);

const { searchSchema, tableColumns, searchRegister } = useData();
const { tableState, tableRegister, setSearchParams, getSelections } = useHook();

onMounted(() => emit("get-sels", getSelections));
</script>

<template>
  <div class="main">
    <!-- 查询区域 -->
    <MtSearch :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" @register="searchRegister" />

    <MtTable
      v-model:pageSize="tableState.pageSize"
      v-model:pageNumber="tableState.pageNumber"
      sels-tag
      sels-single
      :selections="selections"
      row-key="id"
      label-key="name"
      :columns="tableColumns"
      :data="tableState.tableList"
      :loading="tableState.loading"
      :pagination="{ total: tableState.total }"
      @register="tableRegister"
    />
  </div>
</template>
