<script setup lang="ts">
import { ref, watch } from "vue";
import propTypes from "@/utils/propTypes";
import { useNav } from "@/layout/hooks/useNav";

const props = defineProps({
  visible: propTypes.bool.def(false)
});

const passwordVisible = ref(false);

const { rules, ruleForm, resetForm, ruleFormRef, passwordSubmit, passwordLoading } = useNav();

watch(
  () => props.visible,
  (bool: boolean) => {
    passwordVisible.value = bool;
  }
);
</script>

<template>
  <el-dialog
    v-if="passwordVisible"
    v-model="passwordVisible"
    title="修改密码"
    width="400px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="70px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="ruleForm.oldPassword" type="password" autocomplete="off" placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="ruleForm.newPassword" type="password" autocomplete="off" placeholder="请输入新密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="passwordVisible = false">取 消</el-button>
        <el-button @click="resetForm">重 置</el-button>
        <el-button type="primary" :loading="passwordLoading" @click="passwordSubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
