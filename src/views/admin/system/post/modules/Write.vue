<script setup lang="ts">
import { reactive, watch } from "vue";
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";
import { PositionData } from "@/api/system/postition/types";

defineOptions({
  name: "WriteForm"
});

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<PositionData>>,
    default: () => null
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  }
});

const rules = reactive({});
props.formSchema.filter(schema => schema.required).map(schema => (rules[schema.prop] = [required()]));

const { register, methods, elFormRef } = useForm({
  schema: props.formSchema
});

watch(
  () => props.currentRow,
  currentRow => {
    if (!currentRow) return;
    methods.setValue(currentRow);
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
