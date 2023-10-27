<script setup lang="ts">
import { reactive, watch } from "vue";
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";
import { DictData } from "@/api/system/dict/types";

defineOptions({
  name: "WriteForm"
});

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<DictData>>,
    default: () => null
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  }
});

const rules = reactive({
  name: [required()],
  code: [required()],
  value: [required()]
});

const { register, methods, elFormRef } = useForm({
  schema: props.formSchema
});

watch(
  () => props.currentRow,
  currentRow => {
    const { setValue } = methods;
    if (!currentRow) return;
    setValue(currentRow);
  },
  { deep: true, immediate: true }
);

defineExpose({
  elFormRef,
  getFormData: methods.getFormData
});
</script>

<template>
  <mt-form :rules="rules" @register="register" />
</template>
