<script setup lang="ts">
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";
import { nextTick, ref, reactive, watch } from "vue";
import { useData } from "../data";

defineOptions({ name: "WriteForm" });

const { deptOptions, roleOptions } = useData();
const props = defineProps({
  currentRow: {
    type: Object,
    default: () => null,
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => [],
  },
});

const rules = reactive({});
props.formSchema
  .filter(schema => schema.required)
  .map(schema => (rules[schema.field] = [required(schema.componentProps?.placeholder)]));

const { formRegister, formMethods } = useForm();
const { setValues, getFormData, getElFormExpose } = formMethods;

const formModel = ref({
  dept: "",
  role: "",
});

const watchForm = async (form, oldForm) => {
  if (form.userType !== oldForm.userType) {
    console.log(form, oldForm);
    const elForm = await getElFormExpose();
    elForm.clearValidate();
  }
};

watch(
  () => props.currentRow,
  async currentRow => {
    if (!currentRow) return;
    await nextTick();
    console.log("currentRow", currentRow);
    setValues({ ...currentRow.formData, copyState: currentRow.copyState });
    currentRow?.formData?.role && (formModel.value = currentRow.formData.role);
  },
  { deep: true, immediate: true },
);

const submit = async () => {
  const elForm = await getElFormExpose();
  let flag = false;
  const valid = await elForm?.validate().catch(async err => {
    console.log(err);
    if (err.role && formModel.value.dept && formModel.value.role) {
      elForm.clearValidate("role");
      flag = true;
    }
  });
  if (valid || flag) {
    const formData = await getFormData();
    flag && (formData.role = formModel.value);
    return formData;
  }
};

defineExpose({
  submit,
  formModel,
});
</script>

<template>
  <MtForm label-position="top" :rules="rules" :schema="formSchema" @register="formRegister" @watch-form="watchForm">
    <template #role>
      <el-row :gutter="8">
        <el-col :span="12">
          <el-tree-select
            v-model="formModel.dept"
            :data="deptOptions"
            check-strictly
            filterable
            placeholder="请选择部门"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="12">
          <el-select v-model="formModel.role" placeholder="请选择角色" :teleported="false" style="width: 100%">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
      </el-row>
    </template>
  </MtForm>
</template>
