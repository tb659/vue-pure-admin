import{_ as m}from"./index-fa5d6b3f.js";const d=["element-loading-text"],V=["src"],v=Vue.defineComponent({name:"FrameView",__name:"frameView",setup(p){var c,f,s;const{t:i}=VueI18n.useI18n(),r=Vue.ref(!0),t=VueRouter.useRoute(),o=Vue.ref(""),u=Vue.ref(null);(c=Vue.unref(t.meta))!=null&&c.frameSrc&&(o.value=(f=Vue.unref(t.meta))==null?void 0:f.frameSrc),((s=Vue.unref(t.meta))==null?void 0:s.frameLoading)===!1&&n();function n(){r.value=!1}function l(){Vue.nextTick(()=>{const e=Vue.unref(u);if(!e)return;const a=e;a.attachEvent?a.attachEvent("onload",()=>{n()}):e.onload=()=>{n()}})}return Vue.onMounted(()=>{l()}),(e,a)=>{const _=Vue.resolveDirective("loading");return Vue.withDirectives((Vue.openBlock(),Vue.createElementBlock("div",{class:"frame","element-loading-text":Vue.unref(i)("status.hsLoad")},[Vue.createElementVNode("iframe",{src:o.value,class:"frame-iframe",ref_key:"frameRef",ref:u},null,8,V)],8,d)),[[_,r.value]])}}});const h=m(v,[["__scopeId","data-v-94a6f1bc"]]);export{h as default};
