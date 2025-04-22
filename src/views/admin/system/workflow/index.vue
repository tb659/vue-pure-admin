<script setup lang="ts">
/**
 * 审批流程-列表
 */
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useData } from "./data";
import { useHook } from "./hook";
import { ref, onMounted } from "vue";
import Write from "./modules/Write.vue";
import { DIALOG_WIDTH_TYPE } from "@/utils/constants";
// import { useCommonStoreHook } from "@/store/modules/common";

import AddFill from "~icons/ri/add-circle-line";
import Trash from "~icons/fa/trash";

defineOptions({
  name: "Workflow",
});

const writeRef = ref<ComponentRef<typeof Write>>();

const { searchSchema, formSchema, tableColumns } = useData();

const { title, visible, loading, handleAdd, handleDel, handleSubmit, tableState, operationList, tableRegister, setSearchParams } =
  useHook();

const showButton = ref(false);
onMounted(() => {
  // showButton.value = useCommonStoreHook().dictList.filter(item => item.code === "show_workflow_permmission_button").length > 0;
});
</script>

<template>
  <div class="main">
    <!-- 查询区域 -->
    <MtSearch :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <el-button v-if="showButton" v-auth="'添加'" type="primary" :icon="useRenderIcon(AddFill)" @click="handleAdd">
      添加
    </el-button>
    <el-button v-if="showButton" v-auth="'删除'" type="primary" :icon="useRenderIcon(Trash)" @click="handleDel"> 删除 </el-button>

    <MtTable
      row-key="id"
      :columns="tableColumns"
      :operations="operationList"
      :data="tableState.tableList"
      :loading="tableState.loading"
      @register="tableRegister"
    />
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
