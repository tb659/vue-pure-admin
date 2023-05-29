import{a as N}from"./data-5870e2fd.js";import{K as F}from"./index-fa5d6b3f.js";import{m as W}from"./message-6f31e976.js";/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function S(e,_,i,o){function u(v){return v instanceof i?v:new i(function(n){n(v)})}return new(i||(i=Promise))(function(v,n){function c(s){try{p(o.next(s))}catch(h){n(h)}}function r(s){try{p(o.throw(s))}catch(h){n(h)}}function p(s){s.done?v(s.value):u(s.value).then(c,r)}p((o=o.apply(e,_||[])).next())})}function $(e,_,i){let o=document.createElement(e);return o.setAttribute("class",_),i&&(o.innerText=i),o}const B=function(e){let _=Array.isArray(e)?[]:{};if(e&&typeof e=="object")for(let i in e)e.hasOwnProperty(i)&&(e[i]&&typeof e[i]=="object"?_[i]=B(e[i]):_[i]=e[i]);return _};var f=Vue.defineComponent({name:"MouseMenu",props:{appendToBody:{type:Boolean,default:!0},menuWidth:{type:Number,default:200},menuList:{type:Array,required:!0},menuHiddenFn:{type:Function},hasIcon:{type:Boolean,default:!1},iconType:{type:String,default:"font-icon"},menuWrapperCss:Object,menuItemCss:Object,el:{type:Object,required:!0},params:{type:[String,Number,Array,Object]},useLongPressInMobile:Boolean,longPressDuration:Number,injectCloseListener:{type:Boolean,default:!0},customClass:String,disabled:{type:Function}},setup(e){const _=Vue.ref(0),i=Vue.ref(0),o=Vue.ref(!1),u=Vue.ref(0),v=Vue.ref(0),n=Vue.ref(!1),c=Vue.ref(null),r=Vue.ref([]),p=Vue.computed(()=>e.menuList.some(a=>a.children&&a.children.length>0)),s=Vue.ref(10),h=Vue.ref();Vue.watch(n,a=>S(this,void 0,void 0,function*(){var l,d;if(a){yield Vue.nextTick();let m=h.value;e.menuWrapperCss&&Object.keys(e.menuWrapperCss).map(b=>{m.style.setProperty(`--menu-${b}`,e.menuWrapperCss&&e.menuWrapperCss[b])}),e.menuItemCss&&Object.keys(e.menuItemCss).map(b=>{m.style.setProperty(`--menu-item-${b}`,e.menuItemCss&&e.menuItemCss[b])});let t=(d=(l=e.menuItemCss)===null||l===void 0?void 0:l.arrowSize)===null||d===void 0?void 0:d.match(/\d+/);t?s.value=~~t[0]||10:s.value=10,m.style.setProperty("--menu-item-arrowRealSize",s.value/2+"px")}}));const x=(a,l)=>{a.disabled||(a.fn&&typeof a.fn=="function"&&a.fn(e.params,c.value,e.el,l),n.value=!1)},M=(a,l)=>{a.disabled||(a.fn&&typeof a.fn=="function"&&!a.disabled&&(a.fn(e.params,c.value,e.el,l),o.value=!1),n.value=!1)},z=(a,l)=>{if(l.children&&!l.disabled){o.value=!0;const d=a.currentTarget;if(!d)return;const{offsetWidth:m}=d,t=d.querySelector(".__menu__sub__wrapper");if(!t)return;const{offsetWidth:b,offsetHeight:V}=t,{innerWidth:T,innerHeight:C}=window,{top:k,left:y}=d.getBoundingClientRect();y+m+b>T-5?_.value=y-b+5:_.value=y+m,k+V>C-5?i.value=C-V:i.value=k+5}},g=(a,l,d,m)=>a.map(t=>(t.children&&(t.children=g(t.children,l,d,m)),t.label&&typeof t.label=="function"&&(t.label=t.label(m,l,d)),t.tips&&typeof t.tips=="function"&&(t.tips=t.tips(m,l,d)),t.icon&&typeof t.icon=="function"&&(t.icon=t.icon(m,l,d)),t.hidden&&typeof t.hidden=="function"&&(t.hidden=t.hidden(m,l,d)),t.disabled&&typeof t.disabled=="function"&&(t.disabled=t.disabled(m,l,d)),t)),E=(a=0,l=0)=>S(this,void 0,void 0,function*(){if(c.value=document.elementFromPoint(a-1,l-1),e.menuHiddenFn?n.value=!e.menuHiddenFn(e.params,c.value,e.el):n.value=!0,!n.value)return;r.value=B(e.menuList),r.value=g(r.value,c.value,e.el,e.params),yield Vue.nextTick();const{innerWidth:d,innerHeight:m}=window,b=h.value.offsetHeight,V=e.menuWidth||200;v.value=a+V+1>d?d-V-5:a+1,u.value=l+b+1>m?m-b-5:l+1}),L=()=>{n.value=!1},w=a=>{h.value&&!h.value.contains(a.currentTarget)&&(n.value=!1,document.oncontextmenu=null)};return Vue.watch(()=>e.injectCloseListener,a=>{a?document.addEventListener("mousedown",w):document.removeEventListener("mousedown",w)},{immediate:!0}),Vue.onUnmounted(()=>{document.removeEventListener("mousedown",w)}),{subLeft:_,subTop:i,hoverFlag:o,menuTop:u,menuLeft:v,showMenu:n,clickDomEl:c,calcMenuList:r,arrowSize:s,hasSubMenu:p,MenuWrapper:h,handleMenuItemClick:x,handleSubMenuItemClick:M,handleMenuMouseEnter:z,show:E,close:L}}});Vue.pushScopeId("data-v-3d21bc0a");const H=["onMousedown","onMouseenter"],O={key:0,class:"__menu__item-icon"},D=["innerHTML"],I={class:"__menu__item-label"},A={class:"__menu__item-tips"},R={class:"__menu__item-arrow-after"},j=["onMousedown"],q={class:"__menu__sub__item-label"},P={class:"__menu__sub__item-tips"};Vue.popScopeId();function K(e,_,i,o,u,v){return Vue.openBlock(),Vue.createBlock(Vue.Teleport,{to:"body",disabled:!e.appendToBody},[e.showMenu?(Vue.openBlock(),Vue.createElementBlock("div",{key:0,ref:"MenuWrapper",class:Vue.normalizeClass(["__menu__wrapper",e.customClass]),style:Vue.normalizeStyle({width:`${e.menuWidth}px`,top:`${e.menuTop}px`,left:`${e.menuLeft}px`})},[(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(e.calcMenuList,(n,c)=>(Vue.openBlock(),Vue.createElementBlock(Vue.Fragment,null,[!n.hidden&&!n.line?(Vue.openBlock(),Vue.createElementBlock("div",{key:c,class:Vue.normalizeClass(["__menu__item",n.disabled&&"disabled",n.customClass]),onMousedown:Vue.withModifiers(r=>e.handleMenuItemClick(n,r),["stop"]),onMouseenter:r=>e.handleMenuMouseEnter(r,n)},[e.hasIcon?(Vue.openBlock(),Vue.createElementBlock("div",O,[e.iconType==="font-icon"?Vue.withDirectives((Vue.openBlock(),Vue.createElementBlock("i",{key:0,class:Vue.normalizeClass(n.icon)},null,2)),[[Vue.vShow,n.icon]]):e.iconType==="svg-icon"?Vue.withDirectives((Vue.openBlock(),Vue.createElementBlock("div",{key:1,class:"__menu__item-icon-svg",innerHTML:n.icon},null,8,D)),[[Vue.vShow,n.icon]]):e.iconType==="vnode-icon"?(Vue.openBlock(),Vue.createBlock(Vue.resolveDynamicComponent(n.icon),{key:2})):Vue.createCommentVNode("v-if",!0)])):Vue.createCommentVNode("v-if",!0),Vue.createElementVNode("span",I,Vue.toDisplayString(n.label),1),Vue.createElementVNode("span",A,Vue.toDisplayString(n.tips||""),1),e.hasSubMenu?(Vue.openBlock(),Vue.createElementBlock("span",{key:1,class:Vue.normalizeClass(["__menu__item-arrow",{show:e.hasSubMenu&&n.children}]),style:Vue.normalizeStyle({width:e.arrowSize+"px",height:e.arrowSize+"px"})},[Vue.withDirectives(Vue.createElementVNode("span",R,null,512),[[Vue.vShow,e.hasSubMenu&&n.children]])],6)):Vue.createCommentVNode("v-if",!0),n.children&&n.children.length>0?Vue.withDirectives((Vue.openBlock(),Vue.createElementBlock("div",{key:2,class:"__menu__sub__wrapper",style:Vue.normalizeStyle({top:`${e.subTop}px`,left:`${e.subLeft}px`})},[(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(n.children,(r,p)=>(Vue.openBlock(),Vue.createElementBlock(Vue.Fragment,null,[!r.hidden&&!r.line?(Vue.openBlock(),Vue.createElementBlock("div",{key:p,class:Vue.normalizeClass(["__menu__sub__item",r.disabled&&"disabled",r.customClass]),onMousedown:Vue.withModifiers(s=>e.handleSubMenuItemClick(r,s),["stop"])},[Vue.createElementVNode("span",q,Vue.toDisplayString(r.label),1),Vue.createElementVNode("span",P,Vue.toDisplayString(r.tips||""),1)],42,j)):Vue.createCommentVNode("v-if",!0),r.line?(Vue.openBlock(),Vue.createElementBlock("div",{key:p,class:"__menu__line"})):Vue.createCommentVNode("v-if",!0)],64))),256))],4)),[[Vue.vShow,e.hoverFlag]]):Vue.createCommentVNode("v-if",!0)],42,H)):Vue.createCommentVNode("v-if",!0),!n.hidden&&n.line?(Vue.openBlock(),Vue.createElementBlock("div",{key:c,class:"__menu__line"})):Vue.createCommentVNode("v-if",!0)],64))),256))],6)):Vue.createCommentVNode("v-if",!0)],8,["disabled"])}function J(e,_){_===void 0&&(_={});var i=_.insertAt;if(!(!e||typeof document>"u")){var o=document.head||document.getElementsByTagName("head")[0],u=document.createElement("style");u.type="text/css",i==="top"&&o.firstChild?o.insertBefore(u,o.firstChild):o.appendChild(u),u.styleSheet?u.styleSheet.cssText=e:u.appendChild(document.createTextNode(e))}}var U=`.__menu__mask[data-v-3d21bc0a] {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
}
.__menu__wrapper[data-v-3d21bc0a] {
  --menu-background: #c8f2f0;
  --menu-boxShadow: 0 1px 5px #888;
  --menu-padding: 5px 0;
  --menu-borderRadius: 0;
  --menu-item-height: 30px;
  --menu-item-padding: 0 10px;
  --menu-item-iconSize: 20px;
  --menu-item-iconFontSize: 14px;
  --menu-item-iconColor: #484852;
  --menu-item-labelColor: #484852;
  --menu-item-labelFontSize: 14px;
  --menu-item-tipsColor: #889;
  --menu-item-tipsFontSize: 12px;
  --menu-item-arrowColor: #484852;
  --menu-item-disabledColor: #bcc;
  --menu-item-hoverBackground: rgba(255, 255, 255, 0.8);
  --menu-item-hoverIconColor: inherit;
  --menu-item-hoverLabelColor: inherit;
  --menu-item-hoverTipsColor: inherit;
  --menu-item-hoverArrowColor: inherit;
  --menu-lineColor: #ccc;
  --menu-lineMargin: 5px 0;
}
.__menu__wrapper[data-v-3d21bc0a] {
  position: fixed;
  width: 200px;
  background: var(--menu-background);
  box-shadow: var(--menu-boxShadow);
  padding: var(--menu-padding);
  border-radius: var(--menu-borderRadius);
  z-index: 99999;
}
.__menu__line[data-v-3d21bc0a],
.__menu__sub__line[data-v-3d21bc0a] {
  border-top: 1px solid var(--menu-lineColor);
  margin: var(--menu-lineMargin);
}
.__menu__item[data-v-3d21bc0a],
.__menu__sub__item[data-v-3d21bc0a] {
  display: flex;
  height: var(--menu-item-height);
  align-items: center;
  cursor: pointer;
  padding: var(--menu-item-padding);
}
.__menu__item .__menu__item-icon[data-v-3d21bc0a],
.__menu__sub__item .__menu__item-icon[data-v-3d21bc0a] {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--menu-item-iconColor);
  width: var(--menu-item-iconSize);
  height: var(--menu-item-iconSize);
}
.__menu__item .__menu__item-icon i[data-v-3d21bc0a],
.__menu__sub__item .__menu__item-icon i[data-v-3d21bc0a] {
  font-size: var(--menu-item-iconFontSize);
}
.__menu__item .__menu__item-icon .__menu__item-icon-svg[data-v-3d21bc0a],
.__menu__sub__item .__menu__item-icon .__menu__item-icon-svg[data-v-3d21bc0a] {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.__menu__item .__menu__item-label[data-v-3d21bc0a],
.__menu__item .__menu__sub__item-label[data-v-3d21bc0a],
.__menu__sub__item .__menu__item-label[data-v-3d21bc0a],
.__menu__sub__item .__menu__sub__item-label[data-v-3d21bc0a] {
  width: 100%;
  max-height: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  font-size: var(--menu-item-labelFontSize);
  color: var(--menu-item-labelColor);
  margin-right: 5px;
  overflow: hidden;
}
.__menu__item .__menu__item-tips[data-v-3d21bc0a],
.__menu__item .__menu__sub__item-tips[data-v-3d21bc0a],
.__menu__sub__item .__menu__item-tips[data-v-3d21bc0a],
.__menu__sub__item .__menu__sub__item-tips[data-v-3d21bc0a] {
  font-size: var(--menu-item-tipsFontSize);
  color: var(--menu-item-tipsColor);
}
.__menu__item .__menu__item-arrow[data-v-3d21bc0a],
.__menu__sub__item .__menu__item-arrow[data-v-3d21bc0a] {
  width: 10px;
  height: 10px;
  margin-left: 5px;
  position: relative;
}
.__menu__item.disabled[data-v-3d21bc0a],
.__menu__sub__item.disabled[data-v-3d21bc0a] {
  cursor: not-allowed;
}
.__menu__item.disabled .__menu__item-icon[data-v-3d21bc0a],
.__menu__item.disabled .__menu__item-label[data-v-3d21bc0a],
.__menu__item.disabled .__menu__sub__item-label[data-v-3d21bc0a],
.__menu__item.disabled .__menu__item-tips[data-v-3d21bc0a],
.__menu__item.disabled .__menu__sub__item-tips[data-v-3d21bc0a],
.__menu__sub__item.disabled .__menu__item-icon[data-v-3d21bc0a],
.__menu__sub__item.disabled .__menu__item-label[data-v-3d21bc0a],
.__menu__sub__item.disabled .__menu__sub__item-label[data-v-3d21bc0a],
.__menu__sub__item.disabled .__menu__item-tips[data-v-3d21bc0a],
.__menu__sub__item.disabled .__menu__sub__item-tips[data-v-3d21bc0a] {
  color: var(--menu-item-disabledColor);
}
.__menu__item.disabled .__menu__item-arrow .__menu__item-arrow-after[data-v-3d21bc0a],
.__menu__sub__item.disabled .__menu__item-arrow .__menu__item-arrow-after[data-v-3d21bc0a] {
  border-left: var(--menu-item-arrowRealSize) solid var(--menu-item-disabledColor);
}
.__menu__item[data-v-3d21bc0a]:not(.disabled):hover {
  background: var(--menu-item-hoverBackground);
}
.__menu__item:not(.disabled):hover .__menu__item-icon[data-v-3d21bc0a] {
  color: var(--menu-item-hoverIconColor);
}
.__menu__item:not(.disabled):hover .__menu__item-label[data-v-3d21bc0a] {
  color: var(--menu-item-hoverLabelColor);
}
.__menu__item:not(.disabled):hover .__menu__item-tips[data-v-3d21bc0a] {
  color: var(--menu-item-hoverTipsColor);
}
.__menu__item:not(.disabled):hover .__menu__item-arrow[data-v-3d21bc0a] {
  color: var(--menu-item-hoverArrowColor);
}
.__menu__sub__item[data-v-3d21bc0a]:not(.disabled):hover {
  background: var(--menu-item-hoverBackground);
}
.__menu__sub__item:not(.disabled):hover .__menu__sub__item-label[data-v-3d21bc0a] {
  color: var(--menu-item-hoverLabelColor);
}
.__menu__sub__item:not(.disabled):hover .__menu__sub__item-tips[data-v-3d21bc0a] {
  color: var(--menu-item-hoverTipsColor);
}
.__menu__item-icon[data-v-3d21bc0a] {
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  margin-right: 4px;
}
.__menu__item-arrow.show .__menu__item-arrow-after[data-v-3d21bc0a] {
  position: absolute;
  width: 0;
  height: 0;
  left: 8px;
  border-left: var(--menu-item-arrowRealSize) solid var(--menu-item-arrowColor);
  border-top: var(--menu-item-arrowRealSize) solid transparent;
  border-bottom: var(--menu-item-arrowRealSize) solid transparent;
}
.__menu__sub__wrapper[data-v-3d21bc0a] {
  position: fixed;
  visibility: hidden;
  width: 200px;
  background: var(--menu-background);
  box-shadow: var(--menu-boxShadow);
  padding: var(--menu-padding);
  border-radius: var(--menu-borderRadius);
}
.__menu__item:hover .__menu__sub__wrapper[data-v-3d21bc0a] {
  visibility: visible;
}`;J(U);f.render=K;f.__scopeId="data-v-3d21bc0a";f.__file="packages/mouse-menu/mouse-menu.vue";f.install=e=>{e.component(f.name,f)};function G(e){var _;const i="__mouse__menu__container";let o;document.querySelector(`.${i}`)?o=document.querySelector(`.${i}`):o=$("div",i);const u=Vue.h(f,e);return Vue.render(u,o),document.body.appendChild(o),(_=u.component)===null||_===void 0?void 0:_.proxy}function Z(){const e=Vue.ref(F(N,!0)),_=[{label:"ID",prop:"id"},{label:"日期",prop:"date"},{label:"姓名",prop:"name"}],i={menuList:[{label:({id:u})=>`ID为：${u}`,disabled:!0},{label:"编辑",tips:"Edit",fn:u=>W(`您编辑了第 ${e.value.findIndex(v=>v.id===u.id)+1} 行，数据为：${JSON.stringify(u)}`,{type:"success"})}]};function o(u,v,n){n.preventDefault();const{x:c,y:r}=n;G({el:n.currentTarget,params:u,menuWrapperCss:{background:"var(--el-bg-color)"},menuItemCss:{labelColor:"var(--el-text-color)",hoverLabelColor:"var(--el-color-primary)",hoverTipsColor:"var(--el-color-primary)"},...i}).show(c,r)}return{columns:_,dataList:e,showMouseMenu:o}}export{Z as useColumns};
