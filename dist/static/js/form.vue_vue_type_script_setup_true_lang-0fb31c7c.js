const p=Vue.reactive({name:[{required:!0,message:"角色名称为必填项",trigger:"blur"}],code:[{required:!0,message:"角色标识为必填项",trigger:"blur"}]}),f=Vue.defineComponent({__name:"form",props:{formInline:{default:()=>({name:"",code:"",remark:""})}},setup(a,{expose:n}){const m=a,t=Vue.ref(),e=Vue.ref(m.formInline);function d(){return t.value}return n({getRef:d}),(c,l)=>{const r=Vue.resolveComponent("el-input"),u=Vue.resolveComponent("el-form-item"),V=Vue.resolveComponent("el-form");return Vue.openBlock(),Vue.createBlock(V,{ref_key:"ruleFormRef",ref:t,model:e.value,rules:Vue.unref(p),"label-width":"82px"},{default:Vue.withCtx(()=>[Vue.createVNode(u,{label:"角色名称",prop:"name"},{default:Vue.withCtx(()=>[Vue.createVNode(r,{modelValue:e.value.name,"onUpdate:modelValue":l[0]||(l[0]=o=>e.value.name=o),clearable:"",placeholder:"请输入角色名称"},null,8,["modelValue"])]),_:1}),Vue.createVNode(u,{label:"角色标识",prop:"code"},{default:Vue.withCtx(()=>[Vue.createVNode(r,{modelValue:e.value.code,"onUpdate:modelValue":l[1]||(l[1]=o=>e.value.code=o),clearable:"",placeholder:"请输入角色标识"},null,8,["modelValue"])]),_:1}),Vue.createVNode(u,{label:"备注"},{default:Vue.withCtx(()=>[Vue.createVNode(r,{modelValue:e.value.remark,"onUpdate:modelValue":l[2]||(l[2]=o=>e.value.remark=o),placeholder:"请输入备注信息",type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])}}});export{f as _};
