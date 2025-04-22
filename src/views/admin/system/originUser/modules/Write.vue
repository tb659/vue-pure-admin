<script setup lang="ts">
import { reactive, watch } from "vue";
import { roleApi } from "@/api/system/role";
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";

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

const rules = reactive({});
props.formSchema
  .filter(schema => schema.required)
  .map(schema => (rules[schema.field] = [required(schema.componentProps?.placeholder)]));

const { formRegister, formMethods } = useForm();
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods;

async function getRole() {
  const res = await roleApi.list<RoleData[]>({});
  if (res) {
    setSchema([
      {
        field: "roleList",
        path: "componentProps.options",
        value: res.data.map(v => ({ label: v.name, value: v.id })),
      },
    ]);
  }
}

getRole();

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
    const formData: UserData = await getFormData();
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
