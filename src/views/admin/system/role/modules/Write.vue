<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";
import { RoleData } from "@/api/system/role/types";
import { menuApi } from "@/api/system/menu";
import { MenuData } from "@/api/system/menu/types";
import { eachTree, listToTree } from "@/utils/tree";

defineOptions({
  name: "WriteForm"
});

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<RoleData>>,
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

const treeRef = ref(null);
const menuData = ref<MenuData[]>([]);
const menuList = ref<MenuData[]>([]);
const defaultExpandedKeys = ref([]);
const checked = ref(false);

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
      // // 按钮权限
      // const permissionIdByB = props.currentRow.resourceList.filter(v => +v.permissions === MENU_TYPE.B_V).map(v => v.id);
      // // 菜单权限
      // const permissionIdByM = props.currentRow.resourceList.filter(v => +v.permissions === MENU_TYPE.M_V).map(v => v.id);
      // // 不包含按钮的菜单
      // const menuIdByM = treeToList(menuData.value)
      //   .filter(menu => menu.type === MENU_TYPE.M_V && !menu.children)
      //   .map(menu => menu.id);
      // // 过滤菜单权限
      // const ids = menuIdByM.filter(menuId => permissionIdByM.filter(permId => menuId === permId).length);
      // defaultExpandedKeys.value = permissionIdByB.concat(ids);
      defaultExpandedKeys.value = props.currentRow.resourceList.map(v => v.id);
      eachTree(list, item => {
        if (item.children?.length && defaultExpandedKeys.value.includes(item.id)) {
          const index = defaultExpandedKeys.value.findIndex(v => v === item.id);
          defaultExpandedKeys.value.splice(index, 1);
        }
      });
      treeRef.value.setCheckedKeys(defaultExpandedKeys.value);
    }
  }
);

watch(
  () => props.currentRow,
  currentRow => {
    if (!currentRow) return;
    methods.setValue(currentRow);
  },
  { deep: true, immediate: true }
);

watch(
  () => checked.value,
  checked => {
    if (checked) {
      treeRef.value.setCheckedKeys(menuList.value.map(menu => menu.id));
    } else {
      treeRef.value.setCheckedKeys([]);
    }
  }
);

defineExpose({
  elFormRef,
  getFormData: methods.getFormData,
  treeRef,
  getList: () => menuList.value
});
</script>

<template>
  <mt-form :rules="rules" @register="register">
    <template #resourceList>
      <el-checkbox v-model="checked">全选</el-checkbox>
      <el-tree
        ref="treeRef"
        show-checkbox
        node-key="id"
        :data="menuData"
        :props="{ label: 'name' }"
        style="width: 100%; max-height: 300px; overflow-y: scroll"
        :default-expanded-keys="defaultExpandedKeys"
      />
    </template>
  </mt-form>
</template>
