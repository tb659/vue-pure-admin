import{b as r}from"./data-5870e2fd.js";import{K as l,w as s,l as p}from"./index-fa5d6b3f.js";function i(e){const t=Vue.ref(l(r,!0)),a=[{label:"ID",prop:"id"},{label:"日期",prop:"date"},{label:"姓名",prop:"name"},{label:"地址",prop:"address"}];return Vue.onMounted(()=>{s().then(()=>{const{setWatermark:o}=p(e.value.getTableDoms().tableWrapper);o("编程即艺术",{font:"16px Microsoft YaHei",globalAlpha:.8,forever:!0,width:252,height:80})})}),{columns:a,dataList:t}}export{i as useColumns};
