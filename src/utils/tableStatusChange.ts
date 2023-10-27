import { ElMessageBox } from "element-plus";
import { msg } from "./message";

function handleStatusChange({ row, index, switchLoadMap, name, api }) {
  ElMessageBox.confirm(
    `确定要<strong>${
      row.status === 0 ? "禁用" : "启用"
    }</strong><strong style='color:var(--el-color-primary)'>${name}</strong>吗?`,
    "系统提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString: true,
      draggable: true
    }
  )
    .then(async () => {
      switchLoadMap[index] = Object.assign({}, switchLoadMap[index], {
        loading: true
      });
      const res = await api[row.status === 0 ? "disableById" : "enableById"](row.id)
        .catch(() => {
          row.status === 0 ? (row.status = 1) : (row.status = 0);
        })
        .finally(() => {
          switchLoadMap[index] = Object.assign({}, switchLoadMap[index], { loading: false });
        });
      if (res) {
        msg.success(`已成功修改${name}状态`);
      }
    })
    .catch(() => {
      row.status === 0 ? (row.status = 1) : (row.status = 0);
    });
}

export { handleStatusChange };
