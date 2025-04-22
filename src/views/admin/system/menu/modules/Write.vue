<script setup lang="ts">
import { reactive, watch } from "vue";
import { cloneDeep } from "@pureadmin/utils";

import { useData } from "../data";
import { eachTree } from "@/utils/tree";
import { required } from "@/utils/validator";
import { HOME_DERECTORY, MENU_TYPE, MENU_LINK_TYPE } from "@/utils/constants";

defineOptions({
  name: "WriteForm",
});

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<MenuData>>,
    default: () => null,
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => [],
  },
  tableList: {
    type: Array as PropType<MenuData[]>,
    default: () => [],
  },
});

const rules = reactive({});
props.formSchema
  .filter(schema => schema.required)
  .map(schema => (rules[schema.field] = [required(schema.componentProps?.placeholder)]));

const { formRegister, formMethods } = useData();
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods;

watch(
  () => props.currentRow,
  currentRow => {
    /** 原始数据中过滤非按钮菜单 */
    HOME_DERECTORY[0].children = cloneDeep(props.tableList).filter(v => v.type !== MENU_TYPE.B_V);
    if (currentRow) {
      // 控制不能选择父级为自身和自身子级
      eachTree(HOME_DERECTORY[0].children, item => {
        if (item.id === currentRow.id) {
          item.disabled = true;
          item.children && eachTree(item.children, item => (item.disabled = true));
        }
      });
    }
    setSchema([{ field: "parentId", path: "componentProps.data", value: HOME_DERECTORY }]);
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
    const formData = await getFormData();
    const meta = {
      url: "",
      frameSrc: "",
      rank: formData.code,
      icon: formData.icon || "",
      title: formData.name || "",
      showLink: formData.showLink ?? false,
      keepAlive: formData.keepAlive ?? false,
      showParent: formData.showParent ?? false,
      hiddenTag: formData.hiddenTag ?? false,
      fixedTag: formData.fixedTag ?? false,
    };
    if (formData.frameType === MENU_LINK_TYPE.OUT_V) {
      meta.url = formData.path;
      formData.path = `/${formData.cname}`;
    } else if (formData.frameType === MENU_LINK_TYPE.IN_V) {
      meta.frameSrc = formData.path;
      formData.path = `/${formData.cname}`;
    }
    const reqData: MenuData = {
      ...formData,
      permissions: "0",
      note: JSON.stringify({
        component: formData.component || "",
        cname: formData.cname || "",
        path: formData.path || "",
        redirect: formData.redirect || "",
        frameType: formData.frameType,
        note: formData.note,
        meta,
      }),
    };
    if (!reqData.id) {
      reqData.domain = "";
      reqData.defaultAssign = 1;
    }
    return reqData;
  }
};

defineExpose({
  submit,
});
</script>

<template>
  <MtForm :rules="rules" :schema="formSchema" @register="formRegister" />
</template>
