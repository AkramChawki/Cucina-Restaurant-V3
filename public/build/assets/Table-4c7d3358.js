import{q,W as $,r as i,a as e,F as O,j as n,d as y}from"./app-5e64e807.js";import{$ as c,_ as N,X as B,M as L,S as P,i as m}from"./SearchIcon-2c3d7bc7.js";import"./description-b86242c4.js";const E=[{name:"Se Déconnecter",href:"logout"}];function h(...d){return d.filter(Boolean).join(" ")}function I({categories:d,ficheId:u,restau:b}){const{auth:w}=q().props,{data:o,setData:p,post:C}=$({name:w.user.name,restau:b||"",ficheId:u,products:d.reduce((a,t)=>(t.products.forEach(s=>{a.push({id:s.id,qty:""})}),a),[])}),[D,f]=i.useState(!1),[x,F]=i.useState(""),k=a=>{a.preventDefault();const t=o.products.filter(l=>l.qty>0),s={...o,products:t};let r="";u==7?r="/inventaire/inv":u==8&&(r="/inventaire/cntrl"),C(r,{data:s})},S=(a,t)=>{if(!/^-?\d*[.,]?\d*$/.test(t)&&t!=="")return;const r=o.products.map(l=>l.id===a?{...l,qty:t}:l);p("products",r)},T=a=>{const t=o.products.find(l=>l.id===a);if(!t)return;let s=t.qty;s===""||isNaN(parseFloat(s.replace(",",".")))?s="0":s=parseFloat(s.replace(",",".")).toString().replace(".",",");const r=o.products.map(l=>l.id===a?{...l,qty:s}:l);p("products",r)},j=a=>{F(a.target.value.toLowerCase())},g=d.map(a=>{const t=a.products.filter(s=>s.designation.toLowerCase().includes(x));return{...a,products:t}}).filter(a=>a.products.length>0),v=g.map(a=>({name:a.name,href:`#${a.name.toLowerCase()}`}));return e(O,{children:n("div",{children:[e(c.Root,{show:D,as:i.Fragment,children:n(N,{as:"div",className:"fixed inset-0 flex z-40 md:hidden",onClose:f,children:[e(c.Child,{as:i.Fragment,enter:"transition-opacity ease-linear duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"transition-opacity ease-linear duration-300",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e(N.Overlay,{className:"fixed inset-0 bg-gray-600 bg-opacity-75"})}),e(c.Child,{as:i.Fragment,enter:"transition ease-in-out duration-300 transform",enterFrom:"-translate-x-full",enterTo:"translate-x-0",leave:"transition ease-in-out duration-300 transform",leaveFrom:"translate-x-0",leaveTo:"-translate-x-full",children:n("div",{className:"relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-[#0D3D33]",children:[e(c.Child,{as:i.Fragment,enter:"ease-in-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in-out duration-300",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e("div",{className:"absolute top-0 right-0 -mr-12 pt-2",children:n("button",{type:"button",className:"ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white",onClick:()=>f(!1),children:[e("span",{className:"sr-only",children:"Close sidebar"}),e(B,{className:"h-6 w-6 text-white","aria-hidden":"true"})]})})}),e("div",{className:"flex-shrink-0 flex items-center px-4",children:e("img",{className:"h-8 w-20",src:"/images/logo/Cucina.png",alt:"Workflow"})}),e("div",{className:"mt-5 flex-1 h-0 overflow-y-auto",children:e("nav",{className:"px-2 space-y-1",children:v.map(a=>e("a",{href:a.href,className:h(a.current?"bg-[#0D3D33] text-white":"text-[#90D88C] hover:bg-[#73ac70]","group flex items-center px-2 py-2 text-base font-medium rounded-md"),children:a.name},a.name))})})]})}),e("div",{className:"flex-shrink-0 w-14","aria-hidden":"true"})]})}),e("div",{className:"hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0",children:n("div",{className:"flex flex-col flex-grow pt-5 bg-[#0D3D33] overflow-y-auto",children:[e("div",{className:"flex items-center flex-shrink-0 px-4",children:e("img",{className:"h-16 w-auto mx-auto",src:"/images/logo/Cucina.png",alt:"Workflow"})}),e("div",{className:"mt-5 flex-1 flex flex-col",children:e("nav",{className:"flex-1 px-2 pb-4 space-y-1",children:v.map(a=>e("a",{href:a.href,className:h(a.current?"bg-[#0D3D33] text-white":"text-[#90D88C] hover:bg-[#73ac70]","group flex items-center px-2 py-2 text-sm font-medium rounded-md"),children:a.name},a.name))})})]})}),e("div",{className:"md:pl-64 flex flex-col flex-1",children:n("form",{onSubmit:k,children:[n("div",{className:"sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow",children:[n("button",{type:"button",className:"px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#90D88C] md:hidden",onClick:()=>f(!0),children:[e("span",{className:"sr-only",children:"Open sidebar"}),e(L,{className:"h-6 w-6","aria-hidden":"true"})]}),n("div",{className:"flex-1 px-4 flex justify-between",children:[e("div",{className:"flex-1 flex",children:n("div",{className:"w-full flex md:ml-0",children:[e("label",{htmlFor:"search-field",className:"sr-only",children:"Search"}),n("div",{className:"relative w-full text-gray-400 focus-within:text-gray-600",children:[e("div",{className:"absolute inset-y-0 left-0 flex items-center pointer-events-none",children:e(P,{className:"h-5 w-5","aria-hidden":"true"})}),e("input",{id:"search-field",className:"block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm",placeholder:"Search",type:"text",name:"search",value:x,onChange:j})]})]})}),e("div",{className:"ml-4 flex items-center md:ml-6",children:n(m,{as:"div",className:"ml-3 relative",children:[e("div",{children:n(m.Button,{className:"max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#90D88C]",children:[e("span",{className:"sr-only",children:"Open user menu"}),e("img",{className:"h-8 w-8 rounded-full",src:"https://cdn-icons-png.flaticon.com/512/1077/1077114.png",alt:""})]})}),e(c,{as:i.Fragment,enter:"transition ease-out duration-100",enterFrom:"transform opacity-0 scale-95",enterTo:"transform opacity-100 scale-100",leave:"transition ease-in duration-75",leaveFrom:"transform opacity-100 scale-100",leaveTo:"transform opacity-0 scale-95",children:e(m.Items,{className:"origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none",children:E.map(a=>e(m.Item,{children:({active:t})=>e(y,{href:route(a.href),method:"post",className:h(t?"bg-gray-100":"","block px-4 py-2 text-sm text-gray-700"),children:a.name})},a.name))})})]})})]})]}),e("main",{children:n("div",{className:"py-6",children:[g.map(a=>n("div",{children:[e("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 md:px-8",children:e("h1",{id:a.name.toLowerCase(),className:"text-2xl font-semibold text-gray-900",children:a.name})}),e("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 md:px-8",children:e("div",{className:"mt-12 max-w-4xl mx-auto grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 lg:max-w-none",children:a.products.map(t=>{var s;return n("div",{className:"flex flex-col rounded-lg shadow-lg overflow-hidden",children:[e("div",{className:"flex-shrink-0",children:e("img",{className:"h-48 w-full object-cover",src:"https://admin.cucinanapoli.com/storage/"+t.image,alt:""})}),n("div",{className:"flex-1 bg-white p-6 flex flex-col justify-between",children:[e("div",{className:"flex-1",children:e("a",{className:"block mt-2",children:e("p",{className:"text-xl font-semibold text-gray-900 text-center",children:t.designation})})}),e("div",{className:"mt-6 flex justify-center",children:n("div",{className:"ml-3 w-full",children:[e("input",{type:"text",className:"focus:ring-[#90D88C] focus:border-[#90D88C] block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md text-center",placeholder:"0",value:(s=o.products.find(r=>r.id===t.id))==null?void 0:s.qty,onChange:r=>S(t.id,r.target.value),onBlur:()=>T(t.id)}),n("div",{className:"text-center my-4",children:["unité (",t.unite,")"]})]})})]})]},`p-${t.id}`)})})})]},`c-${a.id}`)),n("div",{className:"px-4 py-4",children:[e("button",{type:"submit",className:"inline-flex items-center w-[100%] mt-10 px-4 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#73ac70] hover:bg-[#0D3D33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#90D88C]",children:"Envoyer"}),e(y,{type:"button",as:"button",href:"/",className:"inline-flex items-center w-[100%] mt-2 px-4 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#73ac70] hover:bg-[#0D3D33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#90D88C]",children:"Annuler"})]})]})})]})})]})})}export{I as default};