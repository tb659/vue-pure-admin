import dayjs from "dayjs";
import { reactive, ref } from "vue";
import { BUILT_IN_MAP, DICT_EMBED, STATUS_OPTIONS, STATUS_TYPE } from "@/utils/constants";
import { handleStatusChange } from "@/utils/tableStatusChange";
import { dictApi } from "@/api/system/dict";
import { useSearch } from "@/hooks/web/useSearch";
import { useForm } from "@/hooks/web/useForm";
import { addDialog, closeDialog } from "@/components/ReDialog";
import FormDialogDict from "@/views/components/FormDialog/dict/index.vue";
import { msg } from "@/utils/msg";

const { searchRegister, searchMethods } = useSearch();
const { formRegister, formMethods } = useForm();

export function useData() {
  const switchLoadMap = ref({});

  /** 远程获取加载状态 */
  const remoteMethodLoading = ref(false);
  /** form表单远程获取加载状态 */
  const searchOptions = ref([]);
  /** 初始search表单获取远程数据 */
  // querySearchRemoteMethod("search", "");

  /** 弹窗表选择数据事件 */
  const getSelections = ref(() => []);
  /** 弹窗表选择数据 */
  const formDialogSelections = ref([]);

  const searchSchema = reactive<FormSchema[]>([
    {
      label: "字典名称",
      field: "name",
      component: "Input",
      componentProps: {
        placeholder: "请输入字典名称",
      },
    },
    {
      label: "字典编码",
      field: "code",
      component: "Input",
      componentProps: {
        placeholder: "字典编码",
      },
    },
    {
      label: "父级字典编码",
      field: "parentCode",
      component: "Input",
      componentProps: {
        placeholder: "父级字典编码",
      },
    },
    {
      label: "字典状态",
      field: "status",
      component: "Select",
      componentProps: {
        placeholder: "请选择字典状态",
        options: STATUS_OPTIONS,
      },
    },
    {
      label: "处理表单改变 val * 2",
      field: "number",
      component: "InputNumber",
      colProps: { span: 8 },
      required: true,
      componentProps: {
        placeholder: "请输入",
        controlsPosition: "right",
        slots: {
          suffix: () => <span>RMB</span>,
        },
        onChange: val => {
          console.log(val);
          searchMethods.setValues({ number: val * 2 });
        },
      },
      hidden: () => true,
    },
    {
      label: "search表单远程下拉搜索",
      field: "search",
      component: "Select",
      componentProps: {
        placeholder: "请输入选择",
        options: [],
        // 已经查询所有数据了，可以直接filterable， 也可以远程搜索
        remote: true, // 如果不远程过滤需要先调接口查询初始化数据
        filterable: true,
        loading: remoteMethodLoading,
        remoteMethod: key => querySearchRemoteMethod("search", key),
      },
      hidden: () => true,
    },
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "form表单远程下拉搜索",
      field: "search",
      colProps: { span: 24 },
      component: "Select",
      componentProps: {
        placeholder: "请输入选择",
        options: searchOptions.value,
        // remote: true, // 不远程而使用本地搜索，需要write组件先remote
        filterable: true,
        loading: remoteMethodLoading,
        // 已经查询所有数据了，可以直接filterable， 也可以远程搜索
        remoteMethod: key => queryFormRemoteMethod("search", key),
      },
      hidden: () => true,
    },
    {
      label: "字典名称",
      field: "name",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入字典名称",
      },
    },
    {
      label: "字典编码",
      field: "code",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入字典编码",
      },
    },
    {
      label: "字典内容",
      field: "value",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入字典内容",
      },
    },
    {
      label: "父级字典编码",
      field: "parentCode",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入父级字典编码",
      },
    },
    {
      label: "字典状态",
      field: "status",
      value: STATUS_TYPE.ENABLED_V,
      component: "RadioGroup",
      colProps: { span: 24 },
      componentProps: {
        options: STATUS_OPTIONS,
      },
    },
    {
      label: "弹窗选数据",
      field: "dialogChooseData",
      component: "Select",
      colProps: { span: 24 },
      componentProps: {
        options: [],
        style: { width: "100%" },
        onClick: () => {
          addDialog({
            title: "选择字典",
            contentRenderer: () => (
              <FormDialogDict selections={formDialogSelections.value} onGetSels={func => (getSelections.value = func)} />
            ),
            // 默认确认按钮事件 优先低于 footerButtons
            beforeSure: async done => {
              const sels = await getSelections.value();
              if (!sels.length) {
                return msg.warning("请先勾选项目！");
              }
              formDialogSelections.value = sels;
              // 业务逻辑
              formMethods.setValues({ dialogChooseData: sels[0].name });
              // 关闭弹窗
              done();
            },
            // 自定义按钮 优先高于 beforeSure
            footerButtons: [
              {
                label: "取消",
                btnClick: ({ dialog: { options, index } }) => {
                  closeDialog(options, index);
                },
              },
              {
                label: "确定",
                type: "primary",
                loading: false,
                btnClick: async ({ dialog: { options, index }, button }) => {
                  console.log(options, index, button);
                  const sels = await getSelections.value();
                  if (!sels.length) {
                    return msg.warning("请先勾选项目！");
                  }
                  formDialogSelections.value = sels;
                  // 业务逻辑
                  button.btn.loading = true;
                  setTimeout(() => {
                    button.btn.loading = false;
                    formMethods.setValues({ dialogChooseData: sels[0].name });
                    // 关闭弹窗
                    closeDialog(options, index);
                  }, 1000);
                },
              },
            ],
          });
        },
      },
      hidden: () => true,
    },
    {
      label: "字典备注",
      field: "note",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入字典备注",
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
      // index: (index, tableDataLength, indexValue) => (index === tableDataLength - 1 ? "合计" : indexValue)
    },
    {
      label: "字典名称",
      field: "name",
      minWidth: 100,
    },
    {
      label: "字典编码",
      field: "code",
      minWidth: 150,
    },
    {
      label: "父级字典编码",
      field: "parentCode",
      minWidth: 120,
    },
    {
      label: "字典内容",
      field: "value",
      minWidth: 120,
    },
    {
      label: "字典备注",
      field: "note",
      minWidth: 120,
    },
    {
      label: "字典属性",
      field: "embed",
      width: 100,
      cellRenderer: scope => <div>{BUILT_IN_MAP[scope.row.embed].label}</div>,
    },
    {
      label: "字典状态",
      width: 120,
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
          disabled={scope.row.embed === DICT_EMBED}
        />
      ),
    },
    {
      label: "创建时间",
      width: 180,
      field: "crtDt",
      formatter: row => dayjs.unix(row.crtDt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      label: "操作",
      field: "operation",
      fixed: "right",
      width: 120,
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

  /** search输入框的值改变触发，远程获取数据 */
  async function querySearchRemoteMethod(field, key) {
    remoteMethodLoading.value = true;
    const res: Recordable = await dictApi.list({ name: key });
    remoteMethodLoading.value = false;
    const options = res.data.map(item => ({ label: item.name, value: item.id, type: "" }));
    searchMethods.setSchema([{ field, path: "componentProps.options", value: options }]);
  }
  /** form输入框的值改变触发，远程获取数据 */
  async function queryFormRemoteMethod(field, key) {
    remoteMethodLoading.value = true;
    const res: Recordable = await dictApi.list({ name: key });
    remoteMethodLoading.value = false;
    const options = res.data.map(item => ({ label: item.name, value: item.id, type: "" }));
    formMethods.setSchema([{ field, path: "componentProps.options", value: options }]);
  }
  return {
    formSchema,
    searchSchema,
    tableColumns,
    searchRegister,
    formRegister,
    formMethods,
  };
}
