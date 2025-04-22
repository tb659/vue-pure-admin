<script setup lang="ts">
import { ref } from "vue";
import { deviceDetection } from "@pureadmin/utils";

import Write from "./modules/Write.vue";
import UserWrite from "./modules/UserWrite.vue";

import { useData } from "./data";
import { useHook } from "./hook";
import { DIALOG_WIDTH_TYPE } from "@/utils/constants";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import AddFill from "~icons/ri/add-circle-line";
import Trash from "~icons/fa/trash";
import Edit from "~icons/fa/edit";
import Remove from "~icons/fa/remove";

defineOptions({
  name: "Post",
});

const writeRef = ref<ComponentRef<typeof Write>>();
const userWriteRef = ref<ComponentRef<typeof UserWrite>>();

const { searchSchema, formSchema, memberFormSchema, tableColumns } = useData();

const {
  title,
  visible,
  loading,
  postList,
  activePost,
  userVisible,
  userLoading,
  tableState,
  tableRegister,
  handleAdd,
  onAddPost,
  handleDel,
  handleSubmit,
  setSearchParams,
  onEditPost,
  onDeletePost,
  onCurPostChange,
} = useHook();
</script>

<template>
  <div class="main">
    <el-row :gutter="16">
      <el-col :span="deviceDetection() ? 24 : 6" :class="['!w-[400px]', deviceDetection() ? '!mb-[10px]' : '']">
        <el-card shadow="never" :body-style="{ height: deviceDetection() ? 'auto' : 'calc(100vh - 120px)' }">
          <el-scrollbar height="100%">
            <div class="mb-6 flex-bc x-2">
              <span v-auth="'添加岗位'" class="font-bold">岗位</span>
              <IconifyIconOffline :icon="AddFill" class="pointer" @click="onAddPost" />
            </div>
            <div v-if="postList.length">
              <div
                v-for="item in postList"
                :key="item.id"
                class="h-[40px] cursor-pointer hover:text-[#0094ff] hover:bg-[#ECF3F8] px-2 text-xs text-[#777] flex justify-between items-center rounded mb-[5px]"
                :class="activePost?.id == item.id ? 'text-[#0094ff]! bg-[#ECF3F8]' : ''"
                @click="onCurPostChange(item.id)"
              >
                {{ item.name }}
                <div class="flex">
                  <IconifyIconOffline v-auth="'修改'" :icon="Edit" class="pointer mr-[4px]" @click.stop="onEditPost(item)" />
                  <IconifyIconOffline v-auth="'删除'" :icon="Remove" class="pointer" @click.stop="onDeletePost(item)" />
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="deviceDetection() ? 24 : 18" class="h-[calc(100vh-162px)]">
        <el-scrollbar height="100%">
          <!-- 查询区域 -->
          <MtSearch :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />

          <MtTableBar :title="activePost?.name" :columns="tableColumns" @refresh="setSearchParams">
            <template #buttons>
              <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="handleAdd"> 添加用户 </el-button>
              <el-button type="primary" :icon="useRenderIcon(Trash)" @click="handleDel"> 批量删除 </el-button>
            </template>
            <template #default="{ size, dynamicColumns }">
              <MtTable
                v-model:pageSize="tableState.pageSize"
                v-model:pageNumber="tableState.pageNumber"
                row-key="id"
                :size="size"
                :columns="dynamicColumns"
                :data="tableState.tableList"
                :loading="tableState.loading"
                :pagination="{ total: tableState.total }"
                @register="tableRegister"
              />
            </template>
          </MtTableBar>
        </el-scrollbar>
      </el-col>

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

      <el-dialog
        v-if="userVisible"
        v-model="userVisible"
        :title="title"
        draggable
        :mix-width="DIALOG_WIDTH_TYPE.SMALL"
        :width="DIALOG_WIDTH_TYPE.DEFAULT"
        :close-on-click-modal="false"
      >
        <UserWrite
          ref="userWriteRef"
          :form-schema="memberFormSchema"
          :table-list="tableState.tableList"
          :current-row="tableState.currentRow"
          :post="{ postList, activePost }"
        />
        <template #footer>
          <el-button @click="userVisible = false">取消</el-button>
          <el-button type="primary" :loading="userLoading" @click="() => handleSubmit(userWriteRef)"> 确认 </el-button>
        </template>
      </el-dialog>
    </el-row>
  </div>
</template>
