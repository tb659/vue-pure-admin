<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

// 发票管理-发票申请-其他类型收费收取通知
import InvoiceOtherPrint from "./InvoiceOtherPrint.vue";

defineOptions({ name: "Print" });

interface Data {
  serviceId?: number;
}

const route = useRoute();
const type = ref("");
const data = ref<Data>({});

watch(
  () => route.query,
  async query => {
    type.value = (query.type as string) || "";
    data.value.serviceId = (+query.serviceId as number) || null;
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <!-- 发票管理-发票申请-其他类型收费收取通知 -->
  <InvoiceOtherPrint v-if="type === 'InvoiceOtherPrint'" />
</template>

<style lang="scss" scoped>
//
</style>
