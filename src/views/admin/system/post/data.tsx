import { reactive } from "vue";
import { STATUS_OPTIONS } from "@/utils/common";

export function useData() {
  const searchSchema = reactive<FormSchema[]>([
    {
      label: "用户名称",
      prop: "realName",
      component: "Input",
      componentProps: {
        placeholder: "请输入用户名称"
      }
    }
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "岗位名称",
      prop: "name",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "输入岗位名称"
      },
      required: true
    },
    {
      label: "岗位编号",
      prop: "code",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "输入岗位编号"
      },
      required: true
    },
    {
      label: "备注",
      prop: "note",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "输入岗位备注",
        type: "textarea",
        rows: 3,
        style: {
          marginBottom: "30px"
        }
      }
    },
    {
      label: "状态",
      prop: "status",
      component: "Radio",
      value: 1,
      colProps: { span: 24 },
      componentProps: {
        options: STATUS_OPTIONS
      },
      required: true
    }
  ]);

  const memberFormSchema = reactive<FormSchema[]>([
    {
      label: "岗位名称",
      prop: "positionId",
      component: "Select",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "选择岗位",
        operation: []
      }
    },
    {
      label: "添加成员",
      prop: "userIds",
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
          height: "auto"
        }
      },
      required: true
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
      label: "ID",
      prop: "id"
    },
    {
      label: "用户姓名",
      prop: "realName"
    },
    {
      label: "用户帐号/手机号",
      prop: "username"
    },
    {
      label: "部门",
      prop: "deptName"
    },
    {
      label: "工号",
      prop: "jobNumber"
    },
    {
      label: "角色",
      prop: "roleNames"
    }
  ];

  return {
    formSchema,
    memberFormSchema,
    searchSchema,
    tableColumns
  };
}
