import dayjs from "dayjs";
import { reactive, ref } from "vue";
import { userApi } from "@/api/system/user";
import { STATUS_TYPE } from "@/utils/constants";

/** 用户数据（操作人） */
const remoteLoading_user = ref<boolean>(false);
const userOptions = ref<any[]>([]);
/** 输入框的值改变触发，远程获取数据 */
function searchUserData(key) {
  remoteLoading_user.value = true;
  userApi.list<any[]>({ status: STATUS_TYPE.ENABLED_V, realName: key }).then(res => {
    remoteLoading_user.value = false;
    const data = res.data.map(item => item);
    userOptions.value = data.map(item => ({ label: item.realName, value: item.id }));
  });
}
export function useData() {
  const searchSchema = reactive<FormSchema[]>([
    {
      label: "",
      field: "module",
      component: "Input",
      componentProps: {
        placeholder: "操作模块",
      },
    },
    {
      label: "",
      field: "userId",
      component: "Select",
      componentProps: {
        placeholder: "操作人",
        options: userOptions.value,
        remote: true,
        filterable: true,
        loading: remoteLoading_user.value,
        remoteMethod: searchUserData,
        optionApi: () => userOptions.value,
      },
    },
  ]);

  const formSchema = reactive<FormSchema[]>([]);

  const tableColumns: TableColumn[] = [
    // {
    //   label: "勾选",
    //   type: "selection",
    //   width: 55,
    //   align: "left",
    //   fixed: "left"
    // },
    {
      label: "序号",
      type: "index",
      width: 70,
      initHidden: true,
    },
    {
      label: "操作内容",
      field: "name",
      minWidth: 100,
    },
    {
      label: "操作人",
      field: "code",
      minWidth: 150,
    },
    {
      label: "操作时间",
      width: 180,
      formatter: row => dayjs.unix(row.modDt).format("YYYY-MM-DD HH:mm:ss"),
    },
    // {
    //   label: "操作",
    //   field: "operation",
    //   fixed: "right",
    //   width: 120
    // }
  ];

  return {
    formSchema,
    searchSchema,
    tableColumns,
  };
}
