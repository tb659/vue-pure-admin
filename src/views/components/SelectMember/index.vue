<script setup lang="ts">
import { useData } from "./data";
import { useHook } from "./hook";

defineOptions({
  name: "SelectMember"
});
const { searchSchema, tableColumns } = useData();

const { treeRef, deptList, tableObject, register, nodeClick, setSearchParams, getSelections } = useHook();

defineExpose({
  getSelections
});
</script>

<template>
  <div class="main">
    <el-row :gutter="16">
      <el-col :span="6" class="!w-[400px]">
        <el-card shadow="never" :body-style="{ height: 'calc(100vh - 120px)' }">
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
      </el-col>
      <el-col :span="18">
        <!-- 查询区域 -->
        <mt-search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />

        <mt-table-bar title="用户列表" :columns="tableColumns" @refresh="setSearchParams">
          <template #default="{ size, dynamicColumns }">
            <mt-table
              v-bind="$attrs"
              v-model:pageSize="tableObject.pageSize"
              v-model:currentPage="tableObject.currentPage"
              sels-tag
              row-key="id"
              label-key="realName"
              :size="size"
              :columns="dynamicColumns"
              :data="tableObject.tableList"
              :loading="tableObject.loading"
              :pagination="{ total: tableObject.total }"
              @register="register"
            />
          </template>
        </mt-table-bar>
      </el-col>
    </el-row>
  </div>
</template>
