<script setup lang="ts">
import { reactive, watch } from "vue";
import { required } from "@/utils/validator";
import { useData } from "../data";
import { isFunction } from "@/utils/is";

defineOptions({
  name: "WriteForm",
});

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<DictData>>,
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
  .map(schema => {
    rules[schema.field] = [required(schema.componentProps?.placeholder)];
    schema["requiredCopy"] = [required(schema.componentProps?.placeholder)];
  });

const { formRegister, formMethods } = useData();
const { setValues, getFormData, getElFormExpose } = formMethods;

watch(
  () => props.currentRow,
  currentRow => {
    /** 表单数据远程，在打开表单时获取 使用 romote 时不需要初始化请求，而是每次聚焦请求 */
    props.formSchema.forEach((schema: FormSchema) => {
      if (isFunction(schema.componentProps?.remoteMethod)) {
        schema.componentProps?.remoteMethod("");
      }
    });
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
    const formData: DictData = await getFormData();
    return formData;
  }
};
// function emitValue(val) {
//   console.log(val);
// }

defineExpose({
  submit,
});
</script>

<template>
  <div>
    <!-- <mt-upload list-type="list" multiple @emitValue="emitValue" /> -->
    <MtForm :rules="rules" :schema="formSchema" @register="formRegister" />
  </div>
</template>
