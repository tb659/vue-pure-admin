import{F as r}from"./index-fa5d6b3f.js";function c(){const{isDark:e}=r(),o=Vue.computed(()=>({"--el-switch-on-color":"#6abe39","--el-switch-off-color":"#e84749"})),t=Vue.computed(()=>l=>l===1?{"--el-tag-text-color":e.value?"#6abe39":"#389e0d","--el-tag-bg-color":e.value?"#172412":"#f6ffed","--el-tag-border-color":e.value?"#274a17":"#b7eb8f"}:{"--el-tag-text-color":e.value?"#e84749":"#cf1322","--el-tag-bg-color":e.value?"#2b1316":"#fff1f0","--el-tag-border-color":e.value?"#58191c":"#ffa39e"});return{isDark:e,switchStyle:o,tagStyle:t}}export{c as u};
