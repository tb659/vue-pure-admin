<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { menuApi } from "@/api/system/menu";
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";
import { eachTree, listToTree } from "@/utils/tree";

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
  .map(schema => (rules[schema.field] = [required(schema.componentProps?.placeholder)]));

const { formRegister, formMethods } = useForm();
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods;

const treeRef = ref(null);
const checked = ref(false);
const menuData = ref<MenuData[]>([]);
const menuList = ref<MenuData[]>([]);
const defaultExpandedKeys = ref([]);

async function getMenu() {
  const res = await menuApi.list<MenuData[]>({});
  if (res) {
    menuList.value = res.data;
    menuData.value = listToTree(res.data);
  }
}
getMenu();

watch(
  () => menuData.value,
  list => {
    if (!props.currentRow?.resourceList) return;
    if (list.length && treeRef.value) {
      defaultExpandedKeys.value = props.currentRow.resourceList.map(v => v.id);
      eachTree(list, item => {
        if (item.children?.length && defaultExpandedKeys.value.includes(item.id)) {
          const index = defaultExpandedKeys.value.findIndex(v => v === item.id);
          defaultExpandedKeys.value.splice(index, 1);
        }
      });
      treeRef.value.setCheckedKeys(defaultExpandedKeys.value);
    }
  },
);

watch(
  () => props.currentRow,
  currentRow => {
    if (currentRow) {
      setValues(currentRow);
      setSchema([
        { field: "username", path: "hidden", value: () => true },
        { field: "password", path: "hidden", value: () => true },
      ]);
    } else {
      setSchema([
        { field: "username", path: "componentProps.disabled", value: false },
        { field: "password", path: "componentProps.disabled", value: false },
      ]);
    }
  },
  { deep: true, immediate: true },
);

watch(
  () => checked.value,
  checked => {
    if (checked) {
      treeRef.value.setCheckedKeys(menuList.value.map(menu => menu.id));
    } else {
      treeRef.value.setCheckedKeys([]);
    }
  },
);

const submit = async () => {
  const elForm = await getElFormExpose();
  const valid = await elForm?.validate().catch(err => {
    console.log(err);
  });
  if (valid) {
    const formData: CorpsData = await getFormData();
    const keys = treeRef.value.getCheckedKeys().concat(treeRef.value.getHalfCheckedKeys());
    const list = menuList.value.filter(v => keys.filter(k => v.id === k).length > 0);
    formData.resourceList = list.map(v => ({ id: v.id, permissions: v.type + "" }));
    return formData;
  }
};

defineExpose({
  submit,
});
</script>

<template>
  <MtForm :rules="rules" :schema="formSchema" @register="formRegister">
    <template #resourceList>
      <el-checkbox v-model="checked">全选</el-checkbox>
      <el-tree
        ref="treeRef"
        node-key="id"
        show-checkbox
        :data="menuData"
        :props="{ label: 'name' }"
        style="width: 100%; max-height: 300px; overflow-y: scroll"
        :default-expanded-keys="defaultExpandedKeys"
      />
    </template>
  </MtForm>
</template>
