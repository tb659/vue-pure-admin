import{aw as l,L as h,W as n}from"./index-fa5d6b3f.js";function c(){const i=VueRouter.useRoute(),e=VueRouter.useRouter(),s=l(i.params)?i.query:i.params;function o(t,u){Object.keys(t).forEach(a=>{h(t[a])||(t[a]=t[a].toString())}),u==="query"?(n().handleTags("push",{path:"/tabs/query-detail",name:"TabQueryDetail",query:t,meta:{title:{zh:`No.${t.id} - 详情信息`,en:`No.${t.id} - DetailInfo`},dynamicLevel:3}}),e.push({name:"TabQueryDetail",query:t})):u==="params"&&(n().handleTags("push",{path:"/tabs/params-detail/:id",name:"TabParamsDetail",params:t,meta:{title:{zh:`No.${t.id} - 详情信息`,en:`No.${t.id} - DetailInfo`}}}),e.push({name:"TabParamsDetail",params:t}))}return{toDetail:o,initToDetail:t=>{s&&o(s,t)},getParameter:s,router:e}}export{c as u};
