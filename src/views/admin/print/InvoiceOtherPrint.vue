<script setup lang="ts">
import { useRoute } from "vue-router";
import { nextTick, ref, watch } from "vue";

import Print from "@/utils/print";

defineOptions({ name: "InvoiceZhaoBiaoDaiLiPrint" });

const route = useRoute();

// 打印dom
const printEl = ref(null);
// 打印标题
const title = ref("打印");
/** 获取发票详情 */
async function getDetailInfo(serviceId) {
  if (!serviceId) return;
  await nextTick();
  Print(printEl.value, { printDoneCallBack: () => window.close() }).toPrint;
}

watch(
  () => route.query,
  async query => {
    if (query.serviceId) {
      getDetailInfo(+query.serviceId);
    }
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <div ref="printEl" class="print-dom">
    {{ title }}
  </div>
</template>

<style lang="scss" scoped>
.print-dom {
  @apply w-[210mm] h-[297mm] m-[auto];

  padding: 1px;

  .border {
    border: 1px solid #000;
  }

  .bt {
    border-top: 1px solid #000;
  }

  .br {
    border-right: 1px solid #000;
  }

  .bb {
    border-bottom: 1px solid #000;
  }

  .bl {
    border-left: 1px solid #000;
  }
}
</style>
