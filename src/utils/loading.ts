import { ElLoading } from "element-plus";

const loadOption = {
  lock: true,
  text: "Loading",
  background: "rgba(0, 0, 0, 0.7)",
};
let loading;
let loadingCount = 0;
const startLoading = (text = "Loading...") => {
  loading = ElLoading.service({
    ...loadOption,
    text,
  });
};
const endLoading = () => {
  loading.close();
};
export const showLoading = (text = "Loading...") => {
  if (loadingCount == 0) {
    startLoading(text);
  }
  loadingCount += 1;
};
export const hideLoading = () => {
  if (loadingCount <= 0) {
    return;
  }
  loadingCount -= 1;
  if (loadingCount == 0) {
    endLoading();
  }
};
