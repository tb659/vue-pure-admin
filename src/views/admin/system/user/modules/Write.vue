<script setup lang="ts">
import { reactive, watch } from "vue";
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";
import { UserData } from "@/api/system/user/types";
import { roleApi } from "@/api/system/role";
import { RoleData } from "@/api/system/role/types";

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

const rules = reactive({
  name: [required()],
  code: [required()]
});

const { register, methods, elFormRef } = useForm({
  schema: props.formSchema
});

const { setValue, setSchema } = methods;

async function getRole() {
  const res = await roleApi.list<RoleData[]>({});
  if (res) {
    setSchema([
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
