<script setup lang="ts">
import { ref } from "vue";
import { deviceDetection } from "@pureadmin/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useData } from "./data";
import { useHook } from "./hook";
import Write from "./modules/Write.vue";
import AddFill from "~icons/ri/add-circle-line";
import { DIALOG_WIDTH_TYPE } from "@/utils/constants";

defineOptions({
  name: "User",
});

const writeRef = ref<ComponentRef<typeof Write>>();

const { searchSchema, formSchema, tableColumns } = useData();

const {
  title,
  visible,
  loading,
  treeRef,
  deptList,
  tableState,
  operationList,
  tableRegister,
  nodeClick,
  handleAdd,
  handleSubmit,
  handleExport,
  setSearchParams,
} = useHook();
</script>

<template>
  <div class="main">
    <el-row :gutter="16">
      <el-col :span="deviceDetection() ? 24 : 6" :class="['!w-[400px]', deviceDetection() ? '!mb-[10px]' : '']">
        <el-card shadow="never" :body-style="{ height: deviceDetection() ? 'auto' : 'calc(100vh - 164px)' }">
          <el-scrollbar height="100%">
            <el-tree
              ref="treeRef"
              :data="deptList"
              node-key="id"
              highlight-current
              :props="{ label: 'name' }"
              :expand-on-click-node="false"
              :default-expand-all="false"
              @node-click="nodeClick"
            />
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="deviceDetection() ? 24 : 18" class="h-[calc(100vh-162px)]">
        <el-scrollbar height="100%">
          <!-- 查询区域 -->
          <MtSearch
            show-export
            :schema="searchSchema"
            @search="setSearchParams"
            @reset="setSearchParams"
            @export="handleExport"
          />

          <MtTableBar title="用户列表" :columns="tableColumns" @refresh="setSearchParams">
            <template #buttons>
              <el-button v-if="false" v-auth="'添加用户'" type="primary" :icon="useRenderIcon(AddFill)" @click="handleAdd">
                添加用户
              </el-button>
            </template>
            <template #default="{ size, dynamicColumns }">
              <MtTable
                v-model:pageSize="tableState.pageSize"
                v-model:pageNumber="tableState.pageNumber"
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
        </el-scrollbar>

        <el-dialog
          v-if="visible"
          v-model="visible"
          :width="DIALOG_WIDTH_TYPE.LARGE"
          draggable
          :title="title"
          :close-on-click-modal="false"
        >
          <Write ref="writeRef" :form-schema="formSchema" :current-row="tableState.currentRow" />
          <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" :loading="loading" @click="() => handleSubmit(writeRef)"> 确认 </el-button>
          </template>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
