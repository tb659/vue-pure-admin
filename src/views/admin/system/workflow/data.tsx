import dayjs from "dayjs";
import { reactive } from "vue";
import { WORKFLOW_STATUS_MAP, WORKFLOW_STATUS_OPTIONS, WORKFLOW_STATUS_TYPE, WORKFLOW_CODE } from "@/utils/constants";
import { useCommonStoreHook } from "@/store/modules/common";

export function useData() {
  const workflowOptions = useCommonStoreHook().dictList.filter(item => item.code.includes(WORKFLOW_CODE));
  const searchSchema = reactive<FormSchema[]>([
    {
      label: "审批流程",
      field: "name",
      component: "Input",
      componentProps: {
        placeholder: "请输入审批流程",
      },
    },
    {
      label: "全部状态",
      field: "status",
      component: "Select",
      componentProps: {
        placeholder: "请选择全部状态",
        options: WORKFLOW_STATUS_OPTIONS,
      },
    },
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "流程名称",
      field: "type",
      component: "Select",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请选择流程名称",
        options: workflowOptions,
      },
    },
    {
      label: "流程状态",
      field: "status",
      value: WORKFLOW_STATUS_TYPE.ENABLED_V,
      component: "RadioGroup",
      colProps: { span: 24 },
      componentProps: {
        options: WORKFLOW_STATUS_OPTIONS,
      },
    },
    {
      label: "流程备注",
      field: "note",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入流程备注",
        type: "textarea",
        rows: 2,
      },
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
      label: "审批流程名称",
      field: "name",
    },
    {
      label: "审批流程状态",
      field: "status",
      cellRenderer: ({ row }) => (
        <el-tag plain size="small" type={WORKFLOW_STATUS_MAP[row.status].type}>
          {WORKFLOW_STATUS_MAP[row.status].label}
        </el-tag>
      ),
    },
    {
      label: "审批流程备注",
      field: "note",
    },
    {
      label: "最后修改时间",
      field: "modDt",
      formatter: row => dayjs.unix(row.modDt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      label: "操作",
      field: "operation",
      fixed: "right",
      width: 120,
    },
  ];

  return {
    workflowOptions,
    searchSchema,
    formSchema,
    tableColumns,
  };
}
