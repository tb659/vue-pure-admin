<script setup lang="ts">
import { reactive, watch, ref, unref } from "vue";
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";
import { MenuData } from "@/api/system/menu/types";
import { HOME_DERECTORY, MENU_TYPE_MAP, MENU_TYPE } from "@/utils/common";
import { cloneDeep } from "@pureadmin/utils";

defineOptions({
  name: "WriteForm"
});

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<MenuData>>,
    default: () => null
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  tableList: {
    type: Array as PropType<MenuData[]>,
    default: () => []
  }
});

const rules = reactive({});
props.formSchema.filter(schema => schema.required).map(schema => (rules[schema.prop] = [required()]));

const { register, methods, elFormRef } = useForm({
  schema: props.formSchema
});

const formModel = ref<MenuData>({});

const watchForm = form => {
  formModel.value = form;
  /** 处理菜单label */
  const label = MENU_TYPE_MAP[form.type].label;
  label &&
    methods.setSchema([
      { prop: "icon", path: "label", value: label + "图标" },
      { prop: "name", path: "label", value: label + "名称" },
      { prop: "name", path: "componentProps.placeholder", value: `请输入${label}` }
    ]);
};

watch(
  () => unref(formModel).type,
  (type, val) => {
    console.log(type, val);
  }
);
watch(
  () => props.currentRow,
  currentRow => {
    /** 原始数据中过滤非按钮菜单 */
    HOME_DERECTORY[0].children = cloneDeep(props.tableList).filter(v => v.type !== MENU_TYPE.B_V);
    methods.setSchema([{ prop: "parentId", path: "componentProps.data", value: HOME_DERECTORY }]);
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
  <mt-form :rules="rules" @register="register" @watch-form="watchForm" />
</template>
