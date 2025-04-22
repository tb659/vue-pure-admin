import { reactive } from "vue";
import { STATUS_OPTIONS, STATUS_TYPE } from "@/utils/constants";

export function useData() {
  const searchSchema = reactive<FormSchema[]>([
    {
      label: "用户名称",
      field: "realName",
      component: "Input",
      componentProps: {
        placeholder: "请输入用户名称",
      },
    },
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "岗位名称",
      field: "name",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "输入岗位名称",
      },
      required: true,
    },
    {
      label: "岗位编号",
      field: "code",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "输入岗位编号",
      },
      required: true,
    },
    {
      label: "备注",
      field: "note",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "输入岗位备注",
        type: "textarea",
        rows: 3,
        style: {
          marginBottom: "30px",
        },
      },
    },
    {
      label: "状态",
      field: "status",
      component: "RadioGroup",
      value: STATUS_TYPE.ENABLED_V,
      colProps: { span: 24 },
      componentProps: {
        options: STATUS_OPTIONS,
      },
      required: true,
    },
  ]);

  const memberFormSchema = reactive<FormSchema[]>([
    {
      label: "岗位名称",
      field: "positionId",
      component: "Select",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "选择岗位",
        operation: [],
      },
    },
    {
      label: "添加成员",
      field: "userIds",
      component: "Select",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "选择成员",
        options: [],
        multiple: true,
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
        style: {
          height: "auto",
        },
      },
      required: true,
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
      label: "ID",
      field: "id",
    },
    {
      label: "用户姓名",
      field: "realName",
    },
    {
      label: "用户帐号/手机号",
      field: "username",
    },
    {
      label: "部门",
      field: "deptName",
    },
    {
      label: "工号",
      field: "jobNumber",
    },
    {
      label: "角色",
      field: "roleNames",
    },
  ];

  return {
    formSchema,
    memberFormSchema,
    searchSchema,
    tableColumns,
  };
}
