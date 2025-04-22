import { msg } from "@/utils/msg";
import { userApi } from "@/api/system/user";
import { useTable } from "@/hooks/web/useTable";
import { positionApi } from "@/api/system/postition";
import { ref, unref, reactive, nextTick, toRefs } from "vue";

export function useHook() {
  const title = ref("岗位");
  const visible = ref(false);
  const loading = ref(false);
  const userVisible = ref(false);
  const userLoading = ref(false);
  const postList = ref([]);
  const state = reactive({
    activePost: {} as PositionData,
  });

  const { tableRegister, tableState, tableMethods } = useTable<UserData>({
    api: userApi,
    pageOrList: "list",
  });

  const { getList, setSearchParams, delItem, getSelections } = tableMethods;

  initPost();

  async function initPost() {
    postList.value = (await positionApi.list<PositionData[]>({})).data;
    state.activePost = postList.value[0];
    nextTick(() => {
      tableState.params.positionId = state.activePost.id;
      getList();
    });
  }

  async function onAddPost() {
    title.value = "添加岗位";
    tableState.currentRow = null;
    visible.value = true;
  }

  async function onEditPost(data) {
    title.value = "修改岗位";
    tableState.currentRow = data;
    visible.value = true;
  }

  async function onDeletePost(data) {
    msg.confirm("确定删除吗？", "系统提示", {
      confirmBack: () => {
        positionApi.deleteById(data.id).then(() => {
          msg.success();
          initPost();
        });
      },
    });
  }

  async function onCurPostChange(id) {
    state.activePost = postList.value.filter(post => post.id === id)[0];
    tableState.params.positionId = state.activePost.id;
    getList();
  }

  async function handleSubmit(writeRef) {
    const write = unref(writeRef);
    const formData = await write?.submit();
    if (formData) {
      loading.value = true;
      const save = formData.id ? "update" : "create";
      const res = await positionApi[save](formData)
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
  }

  function handleAdd() {
    title.value = "添加用户";
    tableState.currentRow = null;
    userVisible.value = true;
  }

  async function handleDel() {
    const sels = await getSelections();
    const ids = sels.map(sel => sel.id);
    delItem({ ids: { idList: ids }, multiple: true });
  }

  return {
    title,
    visible,
    loading,
    userVisible,
    userLoading,
    postList,
    tableState,
    ...toRefs(state),
    tableRegister,
    handleAdd,
    handleDel,
    handleSubmit,
    setSearchParams,
    onAddPost,
    onEditPost,
    onDeletePost,
    onCurPostChange,
  };
}
