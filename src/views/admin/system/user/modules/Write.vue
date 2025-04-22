<script setup lang="ts">
import dayjs from "dayjs";
import { reactive, watch } from "vue";
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";
import { SEX_MAP, USER_MAP } from "@/utils/constants";
import { useData } from "../data";
defineOptions({
  name: "WriteForm",
});

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<UserData>>,
    default: () => null,
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => [],
  },
});
const { deptOptions } = useData();
const rules = reactive({});
props.formSchema
  .filter(schema => schema.required)
  .map(schema => (rules[schema.field] = [required(schema.componentProps?.placeholder)]));

const { formRegister, formMethods } = useForm();
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods;

watch(
  () => props.currentRow,
  currentRow => {
    setSchema([
      { field: "realName", path: "componentProps.disabled", value: true },
      { field: "jobNumber", path: "componentProps.disabled", value: true },
      { field: "username", path: "componentProps.disabled", value: true },
    ]);
    setValues(currentRow);
  },
  { deep: true, immediate: true },
);

const submit = async () => {
  const elForm = await getElFormExpose();
  const valid = await elForm?.validate().catch(err => {
    console.log(err);
  });
  if (valid) {
    const formData: UserData = await getFormData();
    if (props.currentRow) delete formData.password; // 修改时不操作密码
    return formData;
  }
};

defineExpose({
  submit,
});
// form表单监听
const watchForm = (newForm, oldForm) => {
  // 所属部门切换
  if (newForm.deptId && newForm.deptId !== oldForm.deptId) {
    const deptRow = deptOptions.value.filter(item => item.value === newForm.deptId);
    // 部门编号（）
    setValues({ deptCode: deptRow.length ? deptRow[0].orgCode : "--" });
  }
};
</script>

<template>
  <div class="mb-[16px] rounded overflow-hidden">
    <div class="h-[50px] leading-[50px] px-[16px] text-[#01ABCE] border-[#01ABCE] border-l-4">基础信息</div>
  </div>
  <MtForm :rules="rules" :schema="formSchema" @register="formRegister" @watch-form="watchForm" />
  <div v-if="currentRow" class="mb-[16px] rounded overflow-hidden">
    <div class="h-[50px] leading-[50px] px-[16px] text-[#01ABCE] border-[#01ABCE] border-l-4">员工信息</div>
  </div>
  <div v-if="currentRow" class="flex flex-wrap w-[100%] border-t-[1px] border-l-[1px] border-[#ddd]">
    <div class="flex w-[33.33%]">
      <div class="label">员工工号</div>
      <div class="value">{{ currentRow.jobNumber || "--" }}</div>
    </div>
    <div class="flex w-[33.33%]">
      <div class="label">员工类型</div>
      <div class="value">
        {{ currentRow.userType ? USER_MAP[currentRow.userType].label : "--" }}
      </div>
    </div>
    <div class="flex w-[33.33%]">
      <div class="label">员工状态</div>
      <div class="value">{{ currentRow.employeeStatus || "--" }}</div>
    </div>
    <div class="flex w-[33.33%]">
      <div class="label">性别</div>
      <div class="value">
        {{ currentRow.sex ? SEX_MAP[currentRow.sex].label : "--" }}
      </div>
    </div>
    <div class="flex w-[33.33%]">
      <div class="label">出生日期</div>
      <div class="value">
        {{ currentRow.birth ? dayjs(currentRow.birth).format("YYYY-MM-DD ") : "--" }}
      </div>
    </div>
    <div class="flex w-[33.33%]">
      <div class="label">年龄(岁)</div>
      <div class="value">{{ currentRow.age || "--" }}</div>
    </div>
    <div class="flex w-[33.33%]">
      <div class="label">政治面貌</div>
      <div class="value">{{ currentRow.politicalStatus || "--" }}</div>
    </div>
    <!-- <div class="flex w-[33.33%]">
      <div class="label">入党时间</div>
      <div class="value">{{ currentRow.rdsj || "--" }}</div>
    </div> -->
    <!-- TODO -->
    <div class="flex w-[33.33%]">
      <div class="label">转正日期</div>
      <div class="value">{{ currentRow.zzrq || "--" }}</div>
    </div>
    <!-- TODO -->
    <div class="flex w-[33.33%]">
      <div class="label">司龄</div>
      <div class="value">{{ currentRow.sl || "--" }}</div>
    </div>
    <div class="flex w-[33.33%]">
      <div class="label">参加工作日期</div>
      <div class="value">
        {{ currentRow.joinDate ? dayjs(currentRow.joinDate).format("YYYY-MM-DD ") : "--" }}
      </div>
    </div>
    <div class="flex w-[33.33%]">
      <div class="label">累计工作年限</div>
      <div class="value">{{ currentRow.workDay || "--" }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.label {
  @apply flex items-center justify-center border-b-[1px] border-r-[1px] border-[#ddd] w-[150px] min-h-[40px] bg-[#F6F6F6];
}

.value {
  @apply flex items-center border-b-[1px] border-r-[1px] border-[#ddd] w-[calc(100%-150px)] px-[16px];
}
</style>
