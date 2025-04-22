<script setup lang="ts">
import { reactive, watch } from "vue";
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";
import { HOME_DERECTORY } from "@/utils/constants";
import { eachTree } from "@/utils/tree";
import { cloneDeep } from "@pureadmin/utils";

defineOptions({
  name: "WriteForm",
});

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<MenuData>>,
    default: () => null,
  },
  tableList: {
    type: Array,
    default: () => [],
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
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods;

watch(
  () => props.currentRow,
  currentRow => {
    if (!currentRow) return;
    /** 原始数据中过滤非按钮菜单 */
    HOME_DERECTORY[0].children = cloneDeep(props.tableList);
    if (currentRow) {
      // 控制不能选择父级为自身和自身子级
      eachTree(HOME_DERECTORY[0].children, item => {
        if (item.id === currentRow.id) {
          item.disabled = true;
          item.children && eachTree(item.children, item => (item.disabled = true));
        }
      });
    }
    setSchema([{ field: "parentDeptId", path: "componentProps.data", value: HOME_DERECTORY }]);
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
    const formData: DeptData = await getFormData();
    return formData;
  }
};

defineExpose({
  submit,
});
</script>

<template>
  <MtForm :rules="rules" :schema="formSchema" @register="formRegister" />
</template>
