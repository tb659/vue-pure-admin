import{o as F,p as Ve,q as de,r as me,Y as pe,_ as he}from"./index-fa5d6b3f.js";const ve=()=>{window.cancelAnimationFrame=(()=>window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame||function(l){return window.clearTimeout(l)})(),window.requestAnimationFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(l){return window.setTimeout(l,1e3/60)}}()},we=(l,c)=>{if(l===c)return!0;if(l.length!==c.length)return!1;for(let i=0;i<l.length;++i)if(l[i]!==c[i])return!1;return!0};function U(){Array.isArray||(Array.isArray=function(a){return Object.prototype.toString.call(a)==="[object Array]"});let l,c,i,r,V,m,e=1,t=arguments[0]||{},f=!1,p=arguments.length;if(typeof t=="boolean"&&(f=t,t=arguments[1]||{},e++),typeof t!="object"&&typeof t!="function"&&(t={}),e===p)return t;for(;e<p;e++)if((c=arguments[e])!=null)for(l in c)i=t[l],r=c[l],V=Array.isArray(r),f&&r&&(typeof r=="object"||V)?(V?(V=!1,m=i&&Array.isArray(i)?i:[]):m=i&&typeof i=="object"?i:{},t[l]=U(f,m,r)):r!==void 0&&(t[l]=r);return t}const ye=Object.freeze(Object.defineProperty({__proto__:null,animationFrame:ve,arrayEqual:we,copyObj:U},Symbol.toStringTag,{value:"Module"})),ge=["innerHTML"],Se=Vue.defineComponent({name:"ReSeamlessScroll",__name:"index",props:{data:{type:Array},classOption:{type:Object}},emits:["scrollEnd"],setup(l,{expose:c,emit:i}){const r=l,{animationFrame:V,copyObj:m}=ye;V();const e=Vue.ref(0),t=Vue.ref(0),f=Vue.ref(0),p=Vue.ref(0),a=Vue.ref(0),h=Vue.ref(0),_=Vue.ref(0),b=Vue.ref("");let y=null,$=null,k=null,z=null,B=null,C=!1,x="ease-in";r.classOption.key===void 0&&(r.classOption.key=0);const H=F(`wrap${r.classOption.key}`,null),P=F(`slotList${r.classOption.key}`,null),j=F(`realBox${r.classOption.key}`,null),q=Vue.computed(()=>Vue.unref(e)<0),D=Vue.computed(()=>Math.abs(Vue.unref(e))<Vue.unref(h)-Vue.unref(a)),X=Vue.computed(()=>({step:1,limitMoveNum:5,hoverStop:!0,direction:"top",openTouch:!0,singleHeight:0,singleWidth:0,waitTime:1e3,switchOffset:30,autoPlay:!0,navigation:!1,switchSingleStep:134,switchDelay:400,switchDisabledClass:"disabled",isSingleRemUnit:!1})),u=Vue.computed(()=>m({},Vue.unref(X),r.classOption)),G=Vue.computed(()=>Vue.unref(q)?"":Vue.unref(u).switchDisabledClass),J=Vue.computed(()=>Vue.unref(D)?"":Vue.unref(u).switchDisabledClass),K=Vue.computed(()=>({position:"absolute",margin:`${Vue.unref(p)/2}px 0 0 -${Vue.unref(u).switchOffset}px`,transform:"translate(-100%,-50%)"})),Q=Vue.computed(()=>({position:"absolute",margin:`${Vue.unref(p)/2}px 0 0 ${Vue.unref(a)+Vue.unref(u).switchOffset}px`,transform:"translateY(-50%)"})),T=Vue.computed(()=>Vue.unref(u).direction!=="bottom"&&Vue.unref(u).direction!=="top"),R=Vue.computed(()=>Vue.unref(T)?{float:"left",overflow:"hidden"}:{overflow:"hidden"}),Z=Vue.computed(()=>({transform:`translate(${Vue.unref(e)}px,${Vue.unref(t)}px)`,transition:`all ${x} ${Vue.unref(f)}ms`,overflow:"hidden"})),A=Vue.computed(()=>Vue.unref(u).navigation),E=Vue.computed(()=>Vue.unref(A)?!1:Vue.unref(u).autoPlay),W=Vue.computed(()=>r.data.length>=Vue.unref(u).limitMoveNum),L=Vue.computed(()=>Vue.unref(u).hoverStop&&Vue.unref(E)&&Vue.unref(W)),M=Vue.computed(()=>Vue.unref(u).openTouch),I=Vue.computed(()=>Vue.unref(u).isSingleRemUnit?parseInt(window.getComputedStyle(document.documentElement,null).fontSize):1),O=Vue.computed(()=>Vue.unref(u).singleWidth*Vue.unref(I)),N=Vue.computed(()=>Vue.unref(u).singleHeight*Vue.unref(I)),v=Vue.computed(()=>{let n;const o=Vue.unref(u).step;if(Vue.unref(T)?n=Vue.unref(O):n=Vue.unref(N),n>0&&n%o>0)throw"如果设置了单步滚动，step需是单步大小的约数，否则无法保证单步滚动结束的位置是否准确";return o});function ee(){e.value=0,t.value=0,g(),Y()}function te(){if(Vue.unref(q)){if(Math.abs(Vue.unref(e))<Vue.unref(u).switchSingleStep){e.value=0;return}e.value+=Vue.unref(u).switchSingleStep}}function ne(){if(Vue.unref(D)){if(Vue.unref(h)-Vue.unref(a)+Vue.unref(e)<Vue.unref(u).switchSingleStep){e.value=Vue.unref(a)-Vue.unref(h);return}e.value-=Vue.unref(u).switchSingleStep}}function g(){cancelAnimationFrame($||"")}function ue(n){if(!Vue.unref(M))return;let o;const s=n.targetTouches[0],{waitTime:d,singleHeight:S,singleWidth:fe}=Vue.unref(u);k={x:s.pageX,y:s.pageY},z=Vue.unref(t),B=Vue.unref(e),S&&fe?(o&&clearTimeout(o),o=setTimeout(()=>{g()},d+20)):g()}function oe(n){if(!Vue.unref(M)||n.targetTouches.length>1||n.scale&&n.scale!==1)return;const o=n.targetTouches[0],{direction:s}=Vue.unref(u),d={x:o.pageX-k.x,y:o.pageY-k.y};n.preventDefault();const S=Math.abs(d.x)<Math.abs(d.y)?1:0;S===1&&s==="bottom"||S===1&&s==="top"?t.value=z+d.y:(S===0&&s==="left"||S===0&&s==="right")&&(e.value=B+d.x)}function re(){if(!Vue.unref(M))return;let n;const o=Vue.unref(u).direction;if(f.value=50,o==="top")Vue.unref(t)>0&&(t.value=0);else if(o==="bottom"){const s=Vue.unref(_)/2*-1;Vue.unref(t)<s&&(t.value=s)}else if(o==="left")Vue.unref(e)>0&&(e.value=0);else if(o==="right"){const s=Vue.unref(h)*-1;Vue.unref(e)<s&&(e.value=s)}n&&clearTimeout(n),n=setTimeout(()=>{f.value=0,w()},Vue.unref(f))}function le(){Vue.unref(L)&&ae()}function ie(){Vue.unref(L)&&se()}function w(){C||($=requestAnimationFrame(function(){const n=Vue.unref(_)/2,o=Vue.unref(h)/2,{direction:s,waitTime:d}=Vue.unref(u);s==="top"?(Math.abs(Vue.unref(t))>=n&&(i("scrollEnd"),t.value=0),t.value-=v.value):s==="bottom"?(Vue.unref(t)>=0&&(i("scrollEnd"),t.value=n*-1),t.value+=v.value):s==="left"?(Math.abs(Vue.unref(e))>=o&&(i("scrollEnd"),e.value=0),e.value-=v.value):s==="right"&&(Vue.unref(e)>=0&&(i("scrollEnd"),e.value=o*-1),e.value+=v.value),y&&clearTimeout(y),Vue.unref(N)?Math.abs(Vue.unref(t))%Vue.unref(N)<Vue.unref(v)?y=setTimeout(()=>{w()},d):w():Vue.unref(O)&&Math.abs(Vue.unref(e))%Vue.unref(O)<Vue.unref(v)?y=setTimeout(()=>{w()},d):w()}))}function Y(){Vue.nextTick(()=>{const{switchDelay:n}=Vue.unref(u);if(b.value="",Vue.unref(T)){p.value=Vue.unref(H).offsetHeight,a.value=Vue.unref(H).offsetWidth;let o=Vue.unref(P).offsetWidth;Vue.unref(E)&&(o=o*2+1),Vue.unref(j).style.width=o+"px",h.value=o}if(Vue.unref(E))x="ease-in",f.value=0;else{x="linear",f.value=n;return}Vue.unref(W)?(b.value=Vue.unref(P).innerHTML,setTimeout(()=>{var o;_.value=(o=Vue.unref(j))==null?void 0:o.offsetHeight,w()},0)):(g(),t.value=e.value=0)})}function se(){C=!1,w()}function ae(){C=!0,y&&clearTimeout(y),g()}function ce(n){Vue.unref(u).direction==="left"||Vue.unref(u).direction==="right"||me(()=>{n.deltaY>0?t.value-=v.value:t.value+=v.value},50)()}return Ve(()=>{Y()}),de(()=>{g(),clearTimeout(y)}),c({reset:ee}),(n,o)=>(Vue.openBlock(),Vue.createElementBlock("div",{ref:"wrap"+r.classOption.key},[A.value?(Vue.openBlock(),Vue.createElementBlock("div",{key:0,style:Vue.normalizeStyle(K.value),class:Vue.normalizeClass(G.value),onClick:te},[Vue.renderSlot(n.$slots,"left-switch")],6)):Vue.createCommentVNode("",!0),A.value?(Vue.openBlock(),Vue.createElementBlock("div",{key:1,style:Vue.normalizeStyle(Q.value),class:Vue.normalizeClass(J.value),onClick:ne},[Vue.renderSlot(n.$slots,"right-switch")],6)):Vue.createCommentVNode("",!0),Vue.createElementVNode("div",{ref:"realBox"+r.classOption.key,style:Vue.normalizeStyle(Z.value),onMouseenter:le,onMouseleave:ie,onTouchstartPassive:ue,onTouchmovePassive:oe,onTouchend:re,onMousewheelPassive:ce},[Vue.createElementVNode("div",{ref:"slotList"+r.classOption.key,style:Vue.normalizeStyle(R.value)},[Vue.renderSlot(n.$slots,"default")],4),Vue.createElementVNode("div",{innerHTML:b.value,style:Vue.normalizeStyle(R.value)},null,12,ge)],36)],512))}}),_e=pe(Se),be=_e,ke=l=>(Vue.pushScopeId("data-v-28c9d5d1"),l=l(),Vue.popScopeId(),l),Ce={class:"card-header"},xe=ke(()=>Vue.createElementVNode("span",null,"无缝滚动示例",-1)),Te={class:"item"},Ae=["textContent"],Ee=Vue.defineComponent({name:"SeamlessScroll",__name:"index",setup(l){const c=Vue.ref(),i=Vue.ref([{title:"无缝滚动第一行无缝滚动第一行！！！！！！！！！！"},{title:"无缝滚动第二行无缝滚动第二行！！！！！！！！！！"},{title:"无缝滚动第三行无缝滚动第三行！！！！！！！！！！"},{title:"无缝滚动第四行无缝滚动第四行！！！！！！！！！！"},{title:"无缝滚动第五行无缝滚动第五行！！！！！！！！！！"},{title:"无缝滚动第六行无缝滚动第六行！！！！！！！！！！"},{title:"无缝滚动第七行无缝滚动第七行！！！！！！！！！！"},{title:"无缝滚动第八行无缝滚动第八行！！！！！！！！！！"},{title:"无缝滚动第九行无缝滚动第九行！！！！！！！！！！"}]),r=Vue.reactive({direction:"top"});function V(m){Vue.unref(c).reset(),Vue.unref(r).direction=m}return(m,e)=>{const t=Vue.resolveComponent("el-button"),f=Vue.resolveComponent("el-card"),p=Vue.resolveComponent("el-space");return Vue.openBlock(),Vue.createBlock(p,{wrap:""},{default:Vue.withCtx(()=>[Vue.createVNode(f,{class:"box-card",shadow:"never"},{header:Vue.withCtx(()=>[Vue.createElementVNode("div",Ce,[xe,Vue.createVNode(t,{class:"button",link:"",type:"primary",onClick:e[0]||(e[0]=a=>V("top"))},{default:Vue.withCtx(()=>[Vue.createElementVNode("span",{style:Vue.normalizeStyle({color:r.direction==="top"?"red":""})}," 向上滚动 ",4)]),_:1}),Vue.createVNode(t,{class:"button",link:"",type:"primary",onClick:e[1]||(e[1]=a=>V("bottom"))},{default:Vue.withCtx(()=>[Vue.createElementVNode("span",{style:Vue.normalizeStyle({color:r.direction==="bottom"?"red":""})}," 向下滚动 ",4)]),_:1}),Vue.createVNode(t,{class:"button",link:"",type:"primary",onClick:e[2]||(e[2]=a=>V("left"))},{default:Vue.withCtx(()=>[Vue.createElementVNode("span",{style:Vue.normalizeStyle({color:r.direction==="left"?"red":""})}," 向左滚动 ",4)]),_:1}),Vue.createVNode(t,{class:"button",link:"",type:"primary",onClick:e[3]||(e[3]=a=>V("right"))},{default:Vue.withCtx(()=>[Vue.createElementVNode("span",{style:Vue.normalizeStyle({color:r.direction==="right"?"red":""})}," 向右滚动 ",4)]),_:1})])]),default:Vue.withCtx(()=>[Vue.createVNode(Vue.unref(be),{ref_key:"scroll",ref:c,data:i.value,"class-option":r,class:"warp"},{default:Vue.withCtx(()=>[Vue.createElementVNode("ul",Te,[(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(i.value,(a,h)=>(Vue.openBlock(),Vue.createElementBlock("li",{key:h},[Vue.createElementVNode("span",{class:"title",textContent:Vue.toDisplayString(a.title)},null,8,Ae)]))),128))])]),_:1},8,["data","class-option"])]),_:1})]),_:1})}}});const Oe=he(Ee,[["__scopeId","data-v-28c9d5d1"]]);export{Oe as default};
