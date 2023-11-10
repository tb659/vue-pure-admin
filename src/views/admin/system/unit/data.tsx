import dayjs from "dayjs";
import { reactive, ref } from "vue";
import { hasAuth } from "@/router/utils";
import { dictApi } from "@/api/system/dict";
import { handleStatusChange } from "@/utils/tableStatusChange";
import { STATUS_MAP, STATUS_OPTIONS, STATUS_TYPE } from "@/utils/common";

export function useData() {
  const switchLoadMap = ref({});

  const searchSchema = reactive<FormSchema[]>([
    {
      label: "机构名称",
      prop: "corpName",
      component: "Input",
      componentProps: {
        placeholder: "请输入机构名称"
      }
    },
    {
      label: "机构状态",
      prop: "status",
      component: "Select",
      componentProps: {
        placeholder: "请选择机构状态",
        options: STATUS_OPTIONS
      }
    }
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "机构名称",
      prop: "corpName",
      component: "Input",
      colProps: { span: 12 },
      componentProps: { placeholder: "输入机构名称" },
      required: true
    },
    {
      label: "机构简称",
      prop: "shortName",
      component: "Input",
      colProps: { span: 12 },
      componentProps: { placeholder: "输入机构简称" },
      hidden: () => true
    },
    {
      label: "机构编号",
      prop: "corpCode",
      component: "Input",
      colProps: { span: 12 },
      componentProps: { placeholder: "输入机构编号" },
      required: true
    },
    {
      label: "机构地址",
      prop: "address",
      component: "Input",
      colProps: { span: 12 },
      componentProps: { placeholder: "输入机构地址" },
      hidden: () => true
    },
    {
      label: "传真电话",
      prop: "fax",
      component: "Input",
      colProps: { span: 12 },
      componentProps: { placeholder: "输入传真电话" },
      hidden: () => true
    },
    {
      label: "企业电话",
      prop: "phone",
      component: "Input",
      colProps: { span: 12 },
      componentProps: { placeholder: "输入企业电话" }
    },
    {
      label: "管理员账号",
      prop: "username",
      component: "Input",
      colProps: { span: 12 },
      componentProps: { placeholder: "输入管理员账号", disabled: false },
      required: true
    },
    {
      label: "账号密码",
      prop: "password",
      component: "Input",
      colProps: { span: 12 },
      componentProps: { placeholder: "输入账号密码", disabled: false },
      required: true
    },
    {
      label: "机构状态",
      prop: "status",
      component: "Radio",
      value: 1,
      colProps: { span: 24 },
      componentProps: { options: STATUS_OPTIONS },
      required: true
    },
    {
      label: "资源列表",
      prop: "resourceList",
      colProps: { span: 24 },
      slots: { auth: true }
    }
  ]);

  const tableColumns: TableColumn[] = [
    {
      label: "勾选",
      type: "selection",
      width: 55,
      align: "left",
      fixed: "left"
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      initHidden: true
    },
    {
      label: "机构编号",
      prop: "corpCode"
    },
    {
      label: "机构名称",
      prop: "corpName"
    },
    {
      label: "机构电话",
      prop: "phone",
      width: 110
    },
    {
      label: "创建人",
      prop: "crtUserName",
      width: 70
    },
    {
      label: "修改人",
      prop: "modUserName",
      width: 80
    },
    {
      label: "创建时间",
      prop: "crtDt",
      width: 180,
      formatter: row => dayjs.unix(row.crtDt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "修改时间",
      prop: "modDt",
      width: 180,
      formatter: row => dayjs.unix(row.crtDt).format("YYYY-MM-DD HH:mm:ss")
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
      )
    },
    {
      label: "操作",
      prop: "operation",
      fixed: "right",
      width: 140
    }
  ];

  function onStatusChange({ row, index }) {
    handleStatusChange({
      row,
      index,
      name: row.name,
      api: dictApi,
      switchLoadMap: switchLoadMap.value
    });
  }

  return {
    formSchema,
    searchSchema,
    tableColumns
  };
}
