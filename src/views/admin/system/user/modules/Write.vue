<script setup lang="ts">
import type { UserData } from "@/api/system/user/types";
import type { RoleData } from "@/api/system/role/types";
import { reactive, watch } from "vue";
import { roleApi } from "@/api/system/role";
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";

defineOptions({
  name: "WriteForm"
});

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<UserData>>,
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

async function getRole() {
  const res = await roleApi.list<RoleData[]>({});
  if (res) {
    methods.setSchema([
      {
        prop: "roleList",
        path: "componentProps.options",
        value: res.data.map(v => ({ label: v.name, value: v.id }))
      }
    ]);
  }
}

getRole();

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
