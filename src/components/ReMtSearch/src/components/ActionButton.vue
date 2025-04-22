<script setup lang="ts">
import propTypes from "@/utils/propTypes";
import { transformI18n, $t } from "@/plugins/i18n";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Search from "~icons/fa/search";
import Refresh from "~icons/fa/refresh";
import ExportIcon from "~icons/fa-solid/file-export";
import Up from "~icons/fa/chevron-up";
import Down from "~icons/fa/chevron-down";

const emit = defineEmits(["search", "reset", "export", "expand"]);

defineProps({
  visible: propTypes.bool.def(true),
  showSearch: propTypes.bool.def(true),
  showReset: propTypes.bool.def(true),
  showExport: propTypes.bool.def(false),
  showExpand: propTypes.bool.def(false),
  searchLoading: propTypes.bool.def(false),
  resetLoading: propTypes.bool.def(false),
});
</script>

<template>
  <el-button v-if="showSearch" type="primary" :loading="searchLoading" :icon="useRenderIcon(Search)" @click="emit('search')">
    {{ transformI18n($t("form.query")) }}
  </el-button>
  <el-button v-if="showReset" :loading="resetLoading" plain :icon="useRenderIcon(Refresh)" @click="emit('reset')">
    {{ transformI18n($t("form.reset")) }}
  </el-button>
  <el-button v-if="showExport" plain :icon="useRenderIcon(ExportIcon)" @click="emit('export')">
    {{ transformI18n($t("form.export")) }}
  </el-button>
  <el-button v-if="showExpand" :icon="useRenderIcon(visible ? Up : Down)" text @click="emit('expand')">
    {{ transformI18n($t(visible ? "form.shrink" : "form.expand")) }}
  </el-button>
</template>
