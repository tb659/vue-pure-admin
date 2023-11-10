<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useData } from "./data";
import { useHook } from "./hook";
import { ref } from "vue";
import Write from "./modules/Write.vue";
import UserWrite from "./modules/UserWrite.vue";

import AddFill from "@iconify-icons/ri/add-circle-line";
import Trash from "@iconify-icons/fa/trash";
import Edit from "@iconify-icons/fa/edit";
import Remove from "@iconify-icons/fa/remove";

defineOptions({
  name: "Position"
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
  tableObject,
  register,
  handleAdd,
  onAddPost,
  handleDel,
  handleSubmit,
  handleUserSubmit,
  setSearchParams,
  onEditPost,
  onDeletePost,
  onCurPostChange
} = useHook();
</script>

<template>
  <div class="flex justify-between main">
    <div class="w-[286px]">
      <el-card shadow="never" :body-style="{ height: 'calc(100vh - 120px)' }">
        <div class="mb-6 flex-bc x-2">
          <span v-auth="'添加岗位'" class="font-bold">岗位</span>
          <IconifyIconOffline :icon="AddFill" @click="onAddPost" class="pointer" />
        </div>
        <div v-if="postList.length">
          <div
            v-for="item in postList"
            :key="item.id"
            class="h-[40px] cursor-pointer hover:text-[#0094ff] hover:bg-[#ECF3F8] px-2 text-xs text-[#777] flex justify-between items-center rounded mb-[5px]"
            :class="activePost?.id == item.id ? '!text-[#0094ff] bg-[#ECF3F8]' : ''"
            @click="onCurPostChange(item.id)"
          >
            {{ item.name }}
            <div class="flex">
              <IconifyIconOffline v-auth="'修改'" :icon="Edit" @click.stop="onEditPost(item)" class="pointer mr-[4px]" />
              <IconifyIconOffline v-auth="'删除'" :icon="Remove" @click.stop="onDeletePost(item)" class="pointer" />
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="w-[calc(100%-300px)]">
      <!-- 查询区域 -->
      <mt-search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />

      <mt-table-bar :title="activePost?.name" :columns="tableColumns" @refresh="setSearchParams">
        <template #buttons>
          <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="handleAdd"> 添加用户 </el-button>
          <el-button type="primary" :icon="useRenderIcon(Trash)" @click="handleDel"> 批量删除 </el-button>
        </template>
        <template #default="{ size, dynamicColumns }">
          <mt-table
            row-key="id"
            :size="size"
            :columns="dynamicColumns"
            :data="tableObject.tableList"
            :loading="tableObject.loading"
            :pagination="{ total: tableObject.total }"
            v-model:pageSize="tableObject.pageSize"
            v-model:currentPage="tableObject.currentPage"
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

      <el-dialog
        v-if="userVisible"
        v-model="userVisible"
        :title="title"
        draggable
        mix-width="680px"
        width="750px"
        :close-on-click-modal="false"
      >
        <UserWrite
          ref="userWriteRef"
          :form-schema="memberFormSchema"
          :table-list="tableObject.tableList"
          :current-row="tableObject.currentRow"
          :post="{ postList, activePost }"
        />
        <template #footer>
          <el-button @click="userVisible = false">取消</el-button>
          <el-button type="primary" :loading="userLoading" @click="() => handleUserSubmit(userWriteRef)"> 确认 </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
