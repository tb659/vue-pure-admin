import dayjs from "dayjs";
import { reactive, ref } from "vue";
import { hasAuth } from "@/router/utils";
import { dictApi } from "@/api/system/dict";
import { handleStatusChange } from "@/utils/tableStatusChange";
import { STATUS_MAP, STATUS_OPTIONS, STATUS_TYPE } from "@/utils/constants";

export function useData() {
  const switchLoadMap = ref({});

  const searchSchema = reactive<FormSchema[]>([
    {
      label: "机构名称",
      field: "corpName",
      component: "Input",
      componentProps: {
        placeholder: "请输入机构名称",
      },
    },
    {
      label: "机构状态",
      field: "status",
      component: "Select",
      componentProps: {
        placeholder: "请选择机构状态",
        options: STATUS_OPTIONS,
      },
    },
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "机构名称",
      field: "corpName",
      component: "Input",
      colProps: { span: 12 },
      componentProps: {
        placeholder: "输入机构名称",
      },
      required: true,
    },
    {
      label: "机构简称",
      field: "shortName",
      component: "Input",
      colProps: { span: 12 },
      componentProps: {
        placeholder: "输入机构简称",
      },
      hidden: () => true,
    },
    {
      label: "机构编号",
      field: "corpCode",
      component: "Input",
      colProps: { span: 12 },
      componentProps: {
        placeholder: "输入机构编号",
      },
      required: true,
    },
    {
      label: "机构地址",
      field: "address",
      component: "Input",
      colProps: { span: 12 },
      componentProps: {
        placeholder: "输入机构地址",
      },
      hidden: () => true,
    },
    {
      label: "传真电话",
      field: "fax",
      component: "Input",
      colProps: { span: 12 },
      componentProps: {
        placeholder: "输入传真电话",
      },
      hidden: () => true,
    },
    {
      label: "企业电话",
      field: "phone",
      component: "Input",
      colProps: { span: 12 },
      componentProps: {
        placeholder: "输入企业电话",
      },
    },
    {
      label: "管理员账号",
      field: "username",
      component: "Input",
      colProps: { span: 12 },
      componentProps: {
        placeholder: "输入管理员账号",
        disabled: false,
      },
      required: true,
    },
    {
      label: "账号密码",
      field: "password",
      component: "Input",
      colProps: { span: 12 },
      componentProps: {
        placeholder: "输入账号密码",
        disabled: false,
      },
      required: true,
    },
    {
      label: "机构状态",
      field: "status",
      component: "RadioGroup",
      value: STATUS_TYPE.ENABLED_V,
      colProps: { span: 12 },
      componentProps: {
        options: STATUS_OPTIONS,
      },
      required: true,
    },
    {
      label: "资源列表",
      field: "resourceList",
      colProps: { span: 24 },
      slots: { auth: true },
    },
  ]);

  const tableColumns: TableColumn[] = [
    {
      label: "勾选",
      type: "selection",
      width: 55,
      align: "left",
      fixed: "left",
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      initHidden: true,
    },
    {
      label: "机构编号",
      field: "corpCode",
    },
    {
      label: "机构名称",
      field: "corpName",
    },
    {
      label: "机构电话",
      field: "phone",
      width: 110,
    },
    {
      label: "创建人",
      field: "crtUserName",
      width: 70,
    },
    {
      label: "修改人",
      field: "modUserName",
      width: 80,
    },
    {
      label: "创建时间",
      field: "crtDt",
      width: 180,
      formatter: row => dayjs.unix(row.crtDt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      label: "修改时间",
      field: "modDt",
      width: 180,
      formatter: row => dayjs.unix(row.modDt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      label: "状态",
      minWidth: 130,
      cellRenderer: scope => (
        <el-switch
          size={scope.$props.size || "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={STATUS_TYPE.ENABLED_V}
          inactive-value={STATUS_TYPE.DISABLED_V}
          active-text="已启用"
          inactive-text="已禁用"
          inline-prompt
          onChange={() => onStatusChange(scope as any)}
          disabled={!hasAuth(STATUS_MAP[scope.row.status].label)}
        />
      ),
    },
    {
      label: "操作",
      field: "operation",
      fixed: "right",
      width: 140,
    },
  ];

  function onStatusChange({ row, index }) {
    const ids = [row.id];
    const data = {
      row,
      index,
      name: row.name,
      api: dictApi,
      switchLoadMap: switchLoadMap.value,
      ids: { idList: ids },
    };
    console.log(row, data);
    handleStatusChange(data);
  }

  return {
    formSchema,
    searchSchema,
    tableColumns,
  };
}
