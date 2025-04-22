<script setup lang="ts">
import { onMounted } from "vue";

import { useData } from "./data";
import { useHook } from "./hook";
import propTypes from "@/utils/propTypes";

defineOptions({
  name: "FormDialogSelectMember",
});

defineProps({
  /** 表格选择数据回填 */
  selections: propTypes.array.def([]),
  selsSingle: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["get-sels"]);

const { searchSchema, tableColumns } = useData();

const { treeRef, deptList, tableState, tableRegister, nodeClick, setSearchParams, getSelections } = useHook();

defineExpose({ getSelections });

onMounted(() => emit("get-sels", getSelections));
</script>

<template>
  <div class="main">
    <el-row :gutter="16">
      <el-col :span="6" class="!w-[400px]">
        <el-scrollbar height="550px">
          <el-card shadow="never">
            <el-tree
              ref="treeRef"
              :data="deptList"
              node-key="id"
              highlight-current
              default-expand-all
              :props="{ label: 'name' }"
              :expand-on-click-node="false"
              @node-click="nodeClick"
            />
          </el-card>
        </el-scrollbar>
      </el-col>
      <el-col :span="18">
        <!-- 查询区域 -->
        <MtSearch :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />

        <MtTable
          v-model:pageSize="tableState.pageSize"
          v-model:pageNumber="tableState.pageNumber"
          sels-tag
          :sels-single="selsSingle"
          max-height="450px"
          :selections="selections"
          row-key="id"
          label-key="realName"
          :columns="tableColumns"
          :data="tableState.tableList"
          :loading="tableState.loading"
          :pagination="{ total: tableState.total }"
          @register="tableRegister"
        />
      </el-col>
    </el-row>
  </div>
</template>
