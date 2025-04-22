import { msg } from "./msg";
import { STATUS_TYPE } from "@/utils/constants";

function handleStatusChange(data) {
  const isDisabled = data.row.status === STATUS_TYPE.DISABLED_V;
  const disabledTxt = data.disableText || "禁用";
  const enabledTxt = data.enableText || "启用";
  const statusTxt = isDisabled ? disabledTxt : enabledTxt;
  const isTree: boolean = data.isTree || false;
  let info = `确定要<strong>${statusTxt}</strong><strong style='color:var(--el-color-primary)'>${data.name}</strong>吗?`;
  info += isTree
    ? `<strong>${statusTxt}</strong>后，子级数据<strong style='color:var(--el-color-primary)'>${
        isDisabled ? "" : "不"
      }同步</strong><strong>${statusTxt}</strong>`
    : "";

  msg.confirm(info, "系统提示", {
    type: "warning",
    dangerouslyUseHTMLString: true,
    draggable: true,
    cancelBack: () => (data.row.status = isDisabled ? STATUS_TYPE.ENABLED_V : STATUS_TYPE.DISABLED_V),
    confirmBack: async () => {
      data.switchLoadMap[data.index] = Object.assign({}, data.switchLoadMap[data.index], {
        loading: true,
      });
      const res = await data.api[isDisabled ? "disableBatch" : "enableBatch"](data.ids)
        .catch(() => (data.row.status = isDisabled ? STATUS_TYPE.ENABLED_V : STATUS_TYPE.DISABLED_V))
        .finally(() => {
          data.switchLoadMap[data.index] = Object.assign({}, data.switchLoadMap[data.index], { loading: false });
        });
      if (res) {
        let info = `已成功修改${data.name}`;
        // let info = `已成功修改${data.name + isTree && disabledTxt ? "及子级数据" : ""}状态`;
        info += isTree && disabledTxt ? "及子级数据" : "";
        info += "状态";
        msg.success(info);
        isTree && disabledTxt && location.reload();
      }
    },
  });
}

export { handleStatusChange };
