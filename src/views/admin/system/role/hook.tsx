import { RoleData } from "@/api/system/role/types";
import { useTable } from "@/hooks/web/useTable";
import { roleApi } from "@/api/system/role";
import { ref, unref } from "vue";
import { dictApi } from "@/api/system/dict";
import { DictData } from "@/api/system/dict/types";
import { msg } from "@/utils/message";
import { ADMIN_DICT_EDIT_CODE, ADMIN_ROLE_EMBED, ADMIN_USER_ROOT } from "@/utils/common";
import { useUserStoreHook } from "@/store/modules/user";

export function useHook() {
  const title = ref("角色");
  const visible = ref(false);
  const loading = ref(false);
  const adminEditFlag = ref(false);

  const { register, tableObject, methods } = useTable<RoleData>({
    api: roleApi,
    pageOrList: "page",
    afterRequest: afterRequest
  });

  const operationList: TableOperation[] = [
    {
      label: "修改",
      type: "primary",
      action: handleEdit,
      disabled: ({ embed }) => handleBtnDisabled(embed)
    },
    {
      label: "删除",
      type: "danger",
      action: ({ id }) => methods.delItem({ ids: id }),
      disabled: ({ embed }) => handleBtnDisabled(embed)
    }
  ];

  const { getList, setSearchParams } = methods;

  getList();

  async function afterRequest(list) {
    const role = list.filter(v => v.embed === ADMIN_ROLE_EMBED)[0];
    // 当前列表存在admin判断是否可以操作
    if (role) {
      const res = await dictApi.list<DictData[]>({ code: ADMIN_DICT_EDIT_CODE });
      if (res?.data?.length) {
        adminEditFlag.value = !res.data[0].status;
      }
    }
    return list;
  }

  function handleBtnDisabled(v) {
    return v === ADMIN_ROLE_EMBED ? adminEditFlag.value || useUserStoreHook().userInfo.root !== ADMIN_USER_ROOT : false;
  }

  function handleAdd() {
    title.value = "添加角色";
    tableObject.currentRow = null;
    visible.value = true;
  }

  function handleEdit(data) {
    title.value = "修改角色";
    tableObject.currentRow = data;
    visible.value = true;
  }

  async function handleSubmit(writeRef) {
    const write = unref(writeRef);
    await write?.elFormRef?.validate(async isValid => {
      if (isValid) {
        loading.value = true;
        const data = (await write.getFormData()) as RoleData;
        const keys = write.treeRef.getCheckedKeys().concat(write.treeRef.getHalfCheckedKeys());
        const list = write.getList().filter(v => keys.filter(k => v.id === k).length > 0);
        data.resourceList = list.map(v => ({ id: v.id, permissions: v.type }));
        const save = data.id ? "update" : "create";
        const res = await roleApi[save](data)
          .catch(() => {})
          .finally(() => {
            loading.value = false;
          });
        if (res) {
          visible.value = false;
          msg.success();
          getList();
        }
      }
    });
  }

  return {
    title,
    visible,
    loading,
    tableObject,
    operationList,
    register,
    handleAdd,
    handleSubmit,
    setSearchParams
  };
}
