import{m as o}from"./message-06c300cd.js";import{t as m}from"./data-c7cd4042.js";import{r as d,y as i,f as t,b as s,g as r,F as p}from"./index-3eff57df.js";function y(){const a=d(""),n=i(()=>m.filter(e=>!a.value||e.name.toLowerCase().includes(a.value.toLowerCase()))),u=(e,l)=>{o(`您编辑了第 ${e} 行，数据为：${JSON.stringify(l)}`,{type:"success"})},c=(e,l)=>{o(`您删除了第 ${e} 行，数据为：${JSON.stringify(l)}`)};return{columns:[{label:"日期",prop:"date"},{label:"姓名",prop:"name"},{label:"地址",prop:"address"},{align:"right",headerRenderer:()=>t(s("el-input"),{modelValue:a.value,"onUpdate:modelValue":e=>a.value=e,size:"small",clearable:!0,placeholder:"Type to search"},null),cellRenderer:({index:e,row:l})=>t(p,null,[t(s("el-button"),{size:"small",onClick:()=>u(e+1,l)},{default:()=>[r("Edit")]}),t(s("el-button"),{size:"small",type:"danger",onClick:()=>c(e+1,l)},{default:()=>[r("Delete")]})])}],filterTableData:n}}export{y as useColumns};
