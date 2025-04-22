<script setup lang="ts">
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";
import { reactive, watch } from "vue";

defineOptions({
  name: "WriteForm",
});

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<WorkflowData>>,
    default: () => null,
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => [],
  },
  tableList: {
    type: Array as PropType<WorkflowData[]>,
    default: () => [],
  },
});

const rules = reactive({});
props.formSchema
  .filter(schema => schema.required)
  .map(schema => (rules[schema.field] = [required(schema.componentProps?.placeholder)]));

const { formRegister, formMethods } = useForm();
const { setValues, getFormData, getElFormExpose } = formMethods;

watch(
  () => props.currentRow,
  currentRow => {
    if (!currentRow) return;
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
    const formData: WorkflowData = await getFormData();
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
