import { useTable } from "@/hooks/web/useTable";
import { ref, unref, reactive, nextTick, toRefs } from "vue";
import { msg } from "@/utils/message";
import { positionApi } from "@/api/system/postition";
import { PositionData } from "@/api/system/postition/types";
import { userApi } from "@/api/system/user";
import { UserData } from "@/api/system/user/types";

export function useHook() {
  const title = ref("岗位");
  const visible = ref(false);
  const loading = ref(false);
  const userVisible = ref(false);
  const userLoading = ref(false);
  const postList = ref([]);
  const state = reactive({
    activePost: {} as PositionData
  });

  const { register, tableObject, methods } = useTable<UserData>({
    api: userApi,
    pageOrList: "list"
  });

  const { getList, setSearchParams, delItem, getSelections } = methods;

  initPost();

  async function initPost() {
    postList.value = (await positionApi.list<PositionData[]>({})).data;
    state.activePost = postList.value[0];
    nextTick(() => {
      tableObject.params.positionId = state.activePost.id;
      getList();
    });
  }

  async function onAddPost() {
    title.value = "添加岗位";
    tableObject.currentRow = null;
    visible.value = true;
  }

  async function onEditPost(data) {
    title.value = "修改岗位";
    tableObject.currentRow = data;
    visible.value = true;
  }

  async function onDeletePost(data) {
    msg.confirm("确定删除吗？", "系统提示", {
      callback: () => {
        positionApi.deleteById(data.id).then(() => {
          msg.success();
          initPost();
        });
      }
    });
  }

  async function onCurPostChange(id) {
    state.activePost = postList.value.filter(post => post.id === id)[0];
    tableObject.params.positionId = state.activePost.id;
    getList();
  }

  async function handleSubmit(writeRef) {
    const write = unref(writeRef);
    await write?.elFormRef?.validate(async isValid => {
      if (isValid) {
        loading.value = true;
        const data = await write?.getFormData();
        const save = data.id ? "update" : "create";
        const res = await positionApi[save](data)
          .catch(() => {})
          .finally(() => {
            loading.value = false;
          });
        if (res) {
          visible.value = false;
          msg.success();
          initPost();
        }
      }
    });
  }

  function handleAdd() {
    title.value = "添加用户";
    tableObject.currentRow = null;
    userVisible.value = true;
  }

  async function handleDel() {
    const sels = await getSelections();
    const ids = sels.map(sel => sel.id);
    delItem({ ids: { idList: ids }, multiple: true });
  }

  async function handleUserSubmit(writeRef) {
    const write = unref(writeRef);
    await write?.elFormRef?.validate(async isValid => {
      if (isValid) {
        userLoading.value = true;
        const data = await write?.getFormData();
        const save = data.id ? "update" : "create";
        const res = await positionApi[save](data)
          .catch(() => {})
          .finally(() => {
            userLoading.value = false;
          });
        if (res) {
          userVisible.value = false;
          msg.success();
          initPost();
        }
      }
    });
  }

  return {
    title,
    visible,
    loading,
    userVisible,
    userLoading,
    postList,
    tableObject,
    ...toRefs(state),
    register,
    handleAdd,
    handleDel,
    handleSubmit,
    handleUserSubmit,
    setSearchParams,
    onAddPost,
    onEditPost,
    onDeletePost,
    onCurPostChange
  };
}
