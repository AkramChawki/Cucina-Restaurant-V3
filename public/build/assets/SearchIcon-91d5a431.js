import{r as a,i as w,c as St,e as Me}from"./app-a9724ee6.js";import{s as _e,u as I,o as G,a as V,l as O,b,t as Be,D as P,y as M,c as se,p as ce,d as Ce,e as De,X as C,T as Rt,S as ae,f as xt,I as Q,M as Ft,g as x,r as et,h as It,j as W,i as Pt}from"./description-5baddc50.js";function ge(e){return _e.isServer?null:e instanceof Node?e.ownerDocument:e!=null&&e.hasOwnProperty("current")&&e.current instanceof Node?e.current.ownerDocument:document}let Le=["[contentEditable=true]","[tabindex]","a[href]","area[href]","button:not([disabled])","iframe","input:not([disabled])","select:not([disabled])","textarea:not([disabled])"].map(e=>`${e}:not([tabindex='-1'])`).join(",");var B=(e=>(e[e.First=1]="First",e[e.Previous=2]="Previous",e[e.Next=4]="Next",e[e.Last=8]="Last",e[e.WrapAround=16]="WrapAround",e[e.NoScroll=32]="NoScroll",e))(B||{}),tt=(e=>(e[e.Error=0]="Error",e[e.Overflow=1]="Overflow",e[e.Success=2]="Success",e[e.Underflow=3]="Underflow",e))(tt||{}),Mt=(e=>(e[e.Previous=-1]="Previous",e[e.Next=1]="Next",e))(Mt||{});function nt(e=document.body){return e==null?[]:Array.from(e.querySelectorAll(Le)).sort((t,n)=>Math.sign((t.tabIndex||Number.MAX_SAFE_INTEGER)-(n.tabIndex||Number.MAX_SAFE_INTEGER)))}var Ue=(e=>(e[e.Strict=0]="Strict",e[e.Loose=1]="Loose",e))(Ue||{});function je(e,t=0){var n;return e===((n=ge(e))==null?void 0:n.body)?!1:I(t,{[0](){return e.matches(Le)},[1](){let r=e;for(;r!==null;){if(r.matches(Le))return!0;r=r.parentElement}return!1}})}function rt(e){let t=ge(e);G().nextFrame(()=>{t&&!je(t.activeElement,0)&&K(e)})}var Ct=(e=>(e[e.Keyboard=0]="Keyboard",e[e.Mouse=1]="Mouse",e))(Ct||{});typeof window<"u"&&typeof document<"u"&&(document.addEventListener("keydown",e=>{e.metaKey||e.altKey||e.ctrlKey||(document.documentElement.dataset.headlessuiFocusVisible="")},!0),document.addEventListener("click",e=>{e.detail===1?delete document.documentElement.dataset.headlessuiFocusVisible:e.detail===0&&(document.documentElement.dataset.headlessuiFocusVisible="")},!0));function K(e){e==null||e.focus({preventScroll:!0})}let Dt=["textarea","input"].join(",");function Lt(e){var t,n;return(n=(t=e==null?void 0:e.matches)==null?void 0:t.call(e,Dt))!=null?n:!1}function ot(e,t=n=>n){return e.slice().sort((n,r)=>{let u=t(n),i=t(r);if(u===null||i===null)return 0;let o=u.compareDocumentPosition(i);return o&Node.DOCUMENT_POSITION_FOLLOWING?-1:o&Node.DOCUMENT_POSITION_PRECEDING?1:0})}function Ot(e,t){return ie(nt(),t,{relativeTo:e})}function ie(e,t,{sorted:n=!0,relativeTo:r=null,skipElements:u=[]}={}){let i=Array.isArray(e)?e.length>0?e[0].ownerDocument:document:e.ownerDocument,o=Array.isArray(e)?n?ot(e):e:nt(e);u.length>0&&o.length>1&&(o=o.filter(v=>!u.includes(v))),r=r??i.activeElement;let l=(()=>{if(t&5)return 1;if(t&10)return-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),s=(()=>{if(t&1)return 0;if(t&2)return Math.max(0,o.indexOf(r))-1;if(t&4)return Math.max(0,o.indexOf(r))+1;if(t&8)return o.length-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),c=t&32?{preventScroll:!0}:{},d=0,g=o.length,E;do{if(d>=g||d+g<=0)return 0;let v=s+d;if(t&16)v=(v+g)%g;else{if(v<0)return 3;if(v>=g)return 1}E=o[v],E==null||E.focus(c),d+=l}while(E!==i.activeElement);return t&6&&Lt(E)&&E.select(),2}function Xe(e,t,n){let r=V(t);a.useEffect(()=>{function u(i){r.current(i)}return document.addEventListener(e,u,n),()=>document.removeEventListener(e,u,n)},[e,n])}function lt(e,t,n){let r=V(t);a.useEffect(()=>{function u(i){r.current(i)}return window.addEventListener(e,u,n),()=>window.removeEventListener(e,u,n)},[e,n])}function ut(e,t,n=!0){let r=a.useRef(!1);a.useEffect(()=>{requestAnimationFrame(()=>{r.current=n})},[n]);function u(o,l){if(!r.current||o.defaultPrevented)return;let s=l(o);if(s===null||!s.getRootNode().contains(s))return;let c=function d(g){return typeof g=="function"?d(g()):Array.isArray(g)||g instanceof Set?g:[g]}(e);for(let d of c){if(d===null)continue;let g=d instanceof HTMLElement?d:d.current;if(g!=null&&g.contains(s)||o.composed&&o.composedPath().includes(g))return}return!je(s,Ue.Loose)&&s.tabIndex!==-1&&o.preventDefault(),t(o,s)}let i=a.useRef(null);Xe("mousedown",o=>{var l,s;r.current&&(i.current=((s=(l=o.composedPath)==null?void 0:l.call(o))==null?void 0:s[0])||o.target)},!0),Xe("click",o=>{i.current&&(u(o,()=>i.current),i.current=null)},!0),lt("blur",o=>u(o,()=>window.document.activeElement instanceof HTMLIFrameElement?window.document.activeElement:null),!0)}function kt({container:e,accept:t,walk:n,enabled:r=!0}){let u=a.useRef(t),i=a.useRef(n);a.useEffect(()=>{u.current=t,i.current=n},[t,n]),O(()=>{if(!e||!r)return;let o=ge(e);if(!o)return;let l=u.current,s=i.current,c=Object.assign(g=>l(g),{acceptNode:l}),d=o.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,c,!1);for(;d.nextNode();)s(d.currentNode)},[e,r,u,i])}function Nt(e){throw new Error("Unexpected object: "+e)}var k=(e=>(e[e.First=0]="First",e[e.Previous=1]="Previous",e[e.Next=2]="Next",e[e.Last=3]="Last",e[e.Specific=4]="Specific",e[e.Nothing=5]="Nothing",e))(k||{});function At(e,t){let n=t.resolveItems();if(n.length<=0)return null;let r=t.resolveActiveIndex(),u=r??-1,i=(()=>{switch(e.focus){case 0:return n.findIndex(o=>!t.resolveDisabled(o));case 1:{let o=n.slice().reverse().findIndex((l,s,c)=>u!==-1&&c.length-s-1>=u?!1:!t.resolveDisabled(l));return o===-1?o:n.length-1-o}case 2:return n.findIndex((o,l)=>l<=u?!1:!t.resolveDisabled(o));case 3:{let o=n.slice().reverse().findIndex(l=>!t.resolveDisabled(l));return o===-1?o:n.length-1-o}case 4:return n.findIndex(o=>t.resolveId(o)===e.id);case 5:return null;default:Nt(e)}})();return i===-1?r:i}let We=a.createContext(null);We.displayName="OpenClosedContext";var F=(e=>(e[e.Open=1]="Open",e[e.Closed=2]="Closed",e[e.Closing=4]="Closing",e[e.Opening=8]="Opening",e))(F||{});function he(){return a.useContext(We)}function it({value:e,children:t}){return w.createElement(We.Provider,{value:e},t)}function Ve(e,t){let n=a.useRef([]),r=b(e);a.useEffect(()=>{let u=[...n.current];for(let[i,o]of t.entries())if(n.current[i]!==o){let l=r(t,u);return n.current=t,l}},[r,...t])}function Ye(e){return[e.screenX,e.screenY]}function Ht(){let e=a.useRef([-1,-1]);return{wasMoved(t){let n=Ye(t);return e.current[0]===n[0]&&e.current[1]===n[1]?!1:(e.current=n,!0)},update(t){e.current=Ye(t)}}}function _t(){return/iPhone/gi.test(window.navigator.platform)||/Mac/gi.test(window.navigator.platform)&&window.navigator.maxTouchPoints>0}var ue=(e=>(e[e.Forwards=0]="Forwards",e[e.Backwards=1]="Backwards",e))(ue||{});function Bt(){let e=a.useRef(0);return lt("keydown",t=>{t.key==="Tab"&&(e.current=t.shiftKey?1:0)},!0),e}function de(){let e=a.useRef(!1);return O(()=>(e.current=!0,()=>{e.current=!1}),[]),e}function te(...e){return a.useMemo(()=>ge(...e),[...e])}function at(e,t,n,r){let u=V(n);a.useEffect(()=>{e=e??window;function i(o){u.current(o)}return e.addEventListener(t,i,r),()=>e.removeEventListener(t,i,r)},[e,t,r])}function Ut(e){function t(){document.readyState!=="loading"&&(e(),document.removeEventListener("DOMContentLoaded",t))}typeof window<"u"&&typeof document<"u"&&(document.addEventListener("DOMContentLoaded",t),t())}function st(e){let t=b(e),n=a.useRef(!1);a.useEffect(()=>(n.current=!1,()=>{n.current=!0,Be(()=>{n.current&&t()})}),[t])}function ct(e){if(!e)return new Set;if(typeof e=="function")return new Set(e());let t=new Set;for(let n of e.current)n.current instanceof HTMLElement&&t.add(n.current);return t}let jt="div";var dt=(e=>(e[e.None=1]="None",e[e.InitialFocus=2]="InitialFocus",e[e.TabLock=4]="TabLock",e[e.FocusLock=8]="FocusLock",e[e.RestoreFocus=16]="RestoreFocus",e[e.All=30]="All",e))(dt||{});function Wt(e,t){let n=a.useRef(null),r=M(n,t),{initialFocus:u,containers:i,features:o=30,...l}=e;se()||(o=1);let s=te(n);Gt({ownerDocument:s},!!(o&16));let c=Qt({ownerDocument:s,container:n,initialFocus:u},!!(o&2));Xt({ownerDocument:s,container:n,containers:i,previousActiveElement:c},!!(o&8));let d=Bt(),g=b(m=>{let h=n.current;h&&(y=>y())(()=>{I(d.current,{[ue.Forwards]:()=>{ie(h,B.First,{skipElements:[m.relatedTarget]})},[ue.Backwards]:()=>{ie(h,B.Last,{skipElements:[m.relatedTarget]})}})})}),E=ce(),v=a.useRef(!1),p={ref:r,onKeyDown(m){m.key=="Tab"&&(v.current=!0,E.requestAnimationFrame(()=>{v.current=!1}))},onBlur(m){let h=ct(i);n.current instanceof HTMLElement&&h.add(n.current);let y=m.relatedTarget;y instanceof HTMLElement&&y.dataset.headlessuiFocusGuard!=="true"&&(ft(h,y)||(v.current?ie(n.current,I(d.current,{[ue.Forwards]:()=>B.Next,[ue.Backwards]:()=>B.Previous})|B.WrapAround,{relativeTo:m.target}):m.target instanceof HTMLElement&&K(m.target)))}};return w.createElement(w.Fragment,null,!!(o&4)&&w.createElement(Ce,{as:"button",type:"button","data-headlessui-focus-guard":!0,onFocus:g,features:De.Focusable}),C({ourProps:p,theirProps:l,defaultTag:jt,name:"FocusTrap"}),!!(o&4)&&w.createElement(Ce,{as:"button",type:"button","data-headlessui-focus-guard":!0,onFocus:g,features:De.Focusable}))}let Vt=P(Wt),oe=Object.assign(Vt,{features:dt}),j=[];Ut(()=>{function e(t){t.target instanceof HTMLElement&&t.target!==document.body&&j[0]!==t.target&&(j.unshift(t.target),j=j.filter(n=>n!=null&&n.isConnected),j.splice(10))}window.addEventListener("click",e,{capture:!0}),window.addEventListener("mousedown",e,{capture:!0}),window.addEventListener("focus",e,{capture:!0}),document.body.addEventListener("click",e,{capture:!0}),document.body.addEventListener("mousedown",e,{capture:!0}),document.body.addEventListener("focus",e,{capture:!0})});function Kt(e=!0){let t=a.useRef(j.slice());return Ve(([n],[r])=>{r===!0&&n===!1&&Be(()=>{t.current.splice(0)}),r===!1&&n===!0&&(t.current=j.slice())},[e,j,t]),b(()=>{var n;return(n=t.current.find(r=>r!=null&&r.isConnected))!=null?n:null})}function Gt({ownerDocument:e},t){let n=Kt(t);Ve(()=>{t||(e==null?void 0:e.activeElement)===(e==null?void 0:e.body)&&K(n())},[t]),st(()=>{t&&K(n())})}function Qt({ownerDocument:e,container:t,initialFocus:n},r){let u=a.useRef(null),i=de();return Ve(()=>{if(!r)return;let o=t.current;o&&Be(()=>{if(!i.current)return;let l=e==null?void 0:e.activeElement;if(n!=null&&n.current){if((n==null?void 0:n.current)===l){u.current=l;return}}else if(o.contains(l)){u.current=l;return}n!=null&&n.current?K(n.current):ie(o,B.First)===tt.Error&&console.warn("There are no focusable elements inside the <FocusTrap />"),u.current=e==null?void 0:e.activeElement})},[r]),u}function Xt({ownerDocument:e,container:t,containers:n,previousActiveElement:r},u){let i=de();at(e==null?void 0:e.defaultView,"focus",o=>{if(!u||!i.current)return;let l=ct(n);t.current instanceof HTMLElement&&l.add(t.current);let s=r.current;if(!s)return;let c=o.target;c&&c instanceof HTMLElement?ft(l,c)?(r.current=c,K(c)):(o.preventDefault(),o.stopPropagation(),K(s)):K(r.current)},!0)}function ft(e,t){for(let n of e)if(n.contains(t))return!0;return!1}let mt=a.createContext(!1);function Yt(){return a.useContext(mt)}function Oe(e){return w.createElement(mt.Provider,{value:e.force},e.children)}function qt(e){let t=Yt(),n=a.useContext(pt),r=te(e),[u,i]=a.useState(()=>{if(!t&&n!==null||_e.isServer)return null;let o=r==null?void 0:r.getElementById("headlessui-portal-root");if(o)return o;if(r===null)return null;let l=r.createElement("div");return l.setAttribute("id","headlessui-portal-root"),r.body.appendChild(l)});return a.useEffect(()=>{u!==null&&(r!=null&&r.body.contains(u)||r==null||r.body.appendChild(u))},[u,r]),a.useEffect(()=>{t||n!==null&&i(n.current)},[n,i,t]),u}let zt=a.Fragment;function Jt(e,t){let n=e,r=a.useRef(null),u=M(Rt(d=>{r.current=d}),t),i=te(r),o=qt(r),[l]=a.useState(()=>{var d;return _e.isServer?null:(d=i==null?void 0:i.createElement("div"))!=null?d:null}),s=a.useContext(ke),c=se();return O(()=>{!o||!l||o.contains(l)||(l.setAttribute("data-headlessui-portal",""),o.appendChild(l))},[o,l]),O(()=>{if(l&&s)return s.register(l)},[s,l]),st(()=>{var d;!o||!l||(l instanceof Node&&o.contains(l)&&o.removeChild(l),o.childNodes.length<=0&&((d=o.parentElement)==null||d.removeChild(o)))}),c?!o||!l?null:St.createPortal(C({ourProps:{ref:u},theirProps:n,defaultTag:zt,name:"Portal"}),l):null}let Zt=a.Fragment,pt=a.createContext(null);function en(e,t){let{target:n,...r}=e,u={ref:M(t)};return w.createElement(pt.Provider,{value:n},C({ourProps:u,theirProps:r,defaultTag:Zt,name:"Popover.Group"}))}let ke=a.createContext(null);function tn(){let e=a.useContext(ke),t=a.useRef([]),n=b(i=>(t.current.push(i),e&&e.register(i),()=>r(i))),r=b(i=>{let o=t.current.indexOf(i);o!==-1&&t.current.splice(o,1),e&&e.unregister(i)}),u=a.useMemo(()=>({register:n,unregister:r,portals:t}),[n,r,t]);return[t,a.useMemo(()=>function({children:i}){return w.createElement(ke.Provider,{value:u},i)},[u])]}let nn=P(Jt),rn=P(en),Ne=Object.assign(nn,{Group:rn}),Ke=a.createContext(()=>{});Ke.displayName="StackContext";var Ae=(e=>(e[e.Add=0]="Add",e[e.Remove=1]="Remove",e))(Ae||{});function on(){return a.useContext(Ke)}function ln({children:e,onUpdate:t,type:n,element:r,enabled:u}){let i=on(),o=b((...l)=>{t==null||t(...l),i(...l)});return O(()=>{let l=u===void 0||u===!0;return l&&o(0,n,r),()=>{l&&o(1,n,r)}},[o,n,r,u]),w.createElement(Ke.Provider,{value:o},e)}function un(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}const an=typeof Object.is=="function"?Object.is:un,{useState:sn,useEffect:cn,useLayoutEffect:dn,useDebugValue:fn}=Me;function mn(e,t,n){const r=t(),[{inst:u},i]=sn({inst:{value:r,getSnapshot:t}});return dn(()=>{u.value=r,u.getSnapshot=t,Re(u)&&i({inst:u})},[e,r,t]),cn(()=>(Re(u)&&i({inst:u}),e(()=>{Re(u)&&i({inst:u})})),[e]),fn(r),r}function Re(e){const t=e.getSnapshot,n=e.value;try{const r=t();return!an(n,r)}catch{return!0}}function pn(e,t,n){return t()}const vn=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",gn=!vn,hn=gn?pn:mn,En="useSyncExternalStore"in Me?(e=>e.useSyncExternalStore)(Me):hn;function bn(e){return En(e.subscribe,e.getSnapshot,e.getSnapshot)}function wn(e,t){let n=e(),r=new Set;return{getSnapshot(){return n},subscribe(u){return r.add(u),()=>r.delete(u)},dispatch(u,...i){let o=t[u].call(n,...i);o&&(n=o,r.forEach(l=>l()))}}}function yn(){let e;return{before({doc:t}){var n;let r=t.documentElement;e=((n=t.defaultView)!=null?n:window).innerWidth-r.clientWidth},after({doc:t,d:n}){let r=t.documentElement,u=r.clientWidth-r.offsetWidth,i=e-u;n.style(r,"paddingRight",`${i}px`)}}}function $n(){if(!_t())return{};let e;return{before(){e=window.pageYOffset},after({doc:t,d:n,meta:r}){function u(o){return r.containers.flatMap(l=>l()).some(l=>l.contains(o))}n.style(t.body,"marginTop",`-${e}px`),window.scrollTo(0,0);let i=null;n.addEventListener(t,"click",o=>{if(o.target instanceof HTMLElement)try{let l=o.target.closest("a");if(!l)return;let{hash:s}=new URL(l.href),c=t.querySelector(s);c&&!u(c)&&(i=c)}catch{}},!0),n.addEventListener(t,"touchmove",o=>{o.target instanceof HTMLElement&&!u(o.target)&&o.preventDefault()},{passive:!1}),n.add(()=>{window.scrollTo(0,window.pageYOffset+e),i&&i.isConnected&&(i.scrollIntoView({block:"nearest"}),i=null)})}}}function Tn(){return{before({doc:e,d:t}){t.style(e.documentElement,"overflow","hidden")}}}function Sn(e){let t={};for(let n of e)Object.assign(t,n(t));return t}let z=wn(()=>new Map,{PUSH(e,t){var n;let r=(n=this.get(e))!=null?n:{doc:e,count:0,d:G(),meta:new Set};return r.count++,r.meta.add(t),this.set(e,r),this},POP(e,t){let n=this.get(e);return n&&(n.count--,n.meta.delete(t)),this},SCROLL_PREVENT({doc:e,d:t,meta:n}){let r={doc:e,d:t,meta:Sn(n)},u=[$n(),yn(),Tn()];u.forEach(({before:i})=>i==null?void 0:i(r)),u.forEach(({after:i})=>i==null?void 0:i(r))},SCROLL_ALLOW({d:e}){e.dispose()},TEARDOWN({doc:e}){this.delete(e)}});z.subscribe(()=>{let e=z.getSnapshot(),t=new Map;for(let[n]of e)t.set(n,n.documentElement.style.overflow);for(let n of e.values()){let r=t.get(n.doc)==="hidden",u=n.count!==0;(u&&!r||!u&&r)&&z.dispatch(n.count>0?"SCROLL_PREVENT":"SCROLL_ALLOW",n),n.count===0&&z.dispatch("TEARDOWN",n)}});function Rn(e,t,n){let r=bn(z),u=e?r.get(e):void 0,i=u?u.count>0:!1;return O(()=>{if(!(!e||!t))return z.dispatch("PUSH",e,n),()=>z.dispatch("POP",e,n)},[t,e]),i}let xe=new Map,le=new Map;function qe(e,t=!0){O(()=>{var n;if(!t)return;let r=typeof e=="function"?e():e.current;if(!r)return;function u(){var o;if(!r)return;let l=(o=le.get(r))!=null?o:1;if(l===1?le.delete(r):le.set(r,l-1),l!==1)return;let s=xe.get(r);s&&(s["aria-hidden"]===null?r.removeAttribute("aria-hidden"):r.setAttribute("aria-hidden",s["aria-hidden"]),r.inert=s.inert,xe.delete(r))}let i=(n=le.get(r))!=null?n:0;return le.set(r,i+1),i!==0||(xe.set(r,{"aria-hidden":r.getAttribute("aria-hidden"),inert:r.inert}),r.setAttribute("aria-hidden","true"),r.inert=!0),u},[e,t])}function xn({defaultContainers:e=[],portals:t}={}){let n=a.useRef(null),r=te(n),u=b(()=>{var i;let o=[];for(let l of e)l!==null&&(l instanceof HTMLElement?o.push(l):"current"in l&&l.current instanceof HTMLElement&&o.push(l.current));if(t!=null&&t.current)for(let l of t.current)o.push(l);for(let l of(i=r==null?void 0:r.querySelectorAll("html > *, body > *"))!=null?i:[])l!==document.body&&l!==document.head&&l instanceof HTMLElement&&l.id!=="headlessui-portal-root"&&(l.contains(n.current)||o.some(s=>l.contains(s))||o.push(l));return o});return{resolveContainers:u,contains:b(i=>u().some(o=>o.contains(i))),mainTreeNodeRef:n,MainTreeNode:a.useMemo(()=>function(){return w.createElement(Ce,{features:De.Hidden,ref:n})},[n])}}var Fn=(e=>(e[e.Open=0]="Open",e[e.Closed=1]="Closed",e))(Fn||{}),In=(e=>(e[e.SetTitleId=0]="SetTitleId",e))(In||{});let Pn={[0](e,t){return e.titleId===t.id?e:{...e,titleId:t.id}}},ve=a.createContext(null);ve.displayName="DialogContext";function fe(e){let t=a.useContext(ve);if(t===null){let n=new Error(`<${e} /> is missing a parent <Dialog /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(n,fe),n}return t}function Mn(e,t,n=()=>[document.body]){Rn(e,t,r=>{var u;return{containers:[...(u=r.containers)!=null?u:[],n]}})}function Cn(e,t){return I(t.type,Pn,e,t)}let Dn="div",Ln=ae.RenderStrategy|ae.Static;function On(e,t){var n;let r=Q(),{id:u=`headlessui-dialog-${r}`,open:i,onClose:o,initialFocus:l,__demoMode:s=!1,...c}=e,[d,g]=a.useState(0),E=he();i===void 0&&E!==null&&(i=(E&F.Open)===F.Open);let v=a.useRef(null),p=M(v,t),m=te(v),h=e.hasOwnProperty("open")||E!==null,y=e.hasOwnProperty("onClose");if(!h&&!y)throw new Error("You have to provide an `open` and an `onClose` prop to the `Dialog` component.");if(!h)throw new Error("You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.");if(!y)throw new Error("You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.");if(typeof i!="boolean")throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${i}`);if(typeof o!="function")throw new Error(`You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${o}`);let f=i?0:1,[T,S]=a.useReducer(Cn,{titleId:null,descriptionId:null,panelRef:a.createRef()}),$=b(()=>o(!1)),A=b(R=>S({type:0,id:R})),D=se()?s?!1:f===0:!1,H=d>1,J=a.useContext(ve)!==null,[ne,Z]=tn(),{resolveContainers:X,mainTreeNodeRef:U,MainTreeNode:$e}=xn({portals:ne,defaultContainers:[(n=T.panelRef.current)!=null?n:v.current]}),Y=H?"parent":"leaf",me=E!==null?(E&F.Closing)===F.Closing:!1,Te=(()=>J||me?!1:D)(),ee=a.useCallback(()=>{var R,_;return(_=Array.from((R=m==null?void 0:m.querySelectorAll("body > *"))!=null?R:[]).find(L=>L.id==="headlessui-portal-root"?!1:L.contains(U.current)&&L instanceof HTMLElement))!=null?_:null},[U]);qe(ee,Te);let re=(()=>H?!0:D)(),Se=a.useCallback(()=>{var R,_;return(_=Array.from((R=m==null?void 0:m.querySelectorAll("[data-headlessui-portal]"))!=null?R:[]).find(L=>L.contains(U.current)&&L instanceof HTMLElement))!=null?_:null},[U]);qe(Se,re);let N=(()=>!(!D||H))();ut(X,$,N);let Et=(()=>!(H||f!==0))();at(m==null?void 0:m.defaultView,"keydown",R=>{Et&&(R.defaultPrevented||R.key===x.Escape&&(R.preventDefault(),R.stopPropagation(),$()))});let bt=(()=>!(me||f!==0||J))();Mn(m,bt,X),a.useEffect(()=>{if(f!==0||!v.current)return;let R=new ResizeObserver(_=>{for(let L of _){let pe=L.target.getBoundingClientRect();pe.x===0&&pe.y===0&&pe.width===0&&pe.height===0&&$()}});return R.observe(v.current),()=>R.disconnect()},[f,v,$]);let[wt,yt]=Ft(),$t=a.useMemo(()=>[{dialogState:f,close:$,setTitleId:A},T],[f,T,$,A]),Qe=a.useMemo(()=>({open:f===0}),[f]),Tt={ref:p,id:u,role:"dialog","aria-modal":f===0?!0:void 0,"aria-labelledby":T.titleId,"aria-describedby":wt};return w.createElement(ln,{type:"Dialog",enabled:f===0,element:v,onUpdate:b((R,_)=>{_==="Dialog"&&I(R,{[Ae.Add]:()=>g(L=>L+1),[Ae.Remove]:()=>g(L=>L-1)})})},w.createElement(Oe,{force:!0},w.createElement(Ne,null,w.createElement(ve.Provider,{value:$t},w.createElement(Ne.Group,{target:v},w.createElement(Oe,{force:!1},w.createElement(yt,{slot:Qe,name:"Dialog.Description"},w.createElement(oe,{initialFocus:l,containers:X,features:D?I(Y,{parent:oe.features.RestoreFocus,leaf:oe.features.All&~oe.features.FocusLock}):oe.features.None},w.createElement(Z,null,C({ourProps:Tt,theirProps:c,slot:Qe,defaultTag:Dn,features:Ln,visible:f===0,name:"Dialog"}))))))))),w.createElement($e,null))}let kn="div";function Nn(e,t){let n=Q(),{id:r=`headlessui-dialog-overlay-${n}`,...u}=e,[{dialogState:i,close:o}]=fe("Dialog.Overlay"),l=M(t),s=b(d=>{if(d.target===d.currentTarget){if(et(d.currentTarget))return d.preventDefault();d.preventDefault(),d.stopPropagation(),o()}}),c=a.useMemo(()=>({open:i===0}),[i]);return C({ourProps:{ref:l,id:r,"aria-hidden":!0,onClick:s},theirProps:u,slot:c,defaultTag:kn,name:"Dialog.Overlay"})}let An="div";function Hn(e,t){let n=Q(),{id:r=`headlessui-dialog-backdrop-${n}`,...u}=e,[{dialogState:i},o]=fe("Dialog.Backdrop"),l=M(t);a.useEffect(()=>{if(o.panelRef.current===null)throw new Error("A <Dialog.Backdrop /> component is being used, but a <Dialog.Panel /> component is missing.")},[o.panelRef]);let s=a.useMemo(()=>({open:i===0}),[i]);return w.createElement(Oe,{force:!0},w.createElement(Ne,null,C({ourProps:{ref:l,id:r,"aria-hidden":!0},theirProps:u,slot:s,defaultTag:An,name:"Dialog.Backdrop"})))}let _n="div";function Bn(e,t){let n=Q(),{id:r=`headlessui-dialog-panel-${n}`,...u}=e,[{dialogState:i},o]=fe("Dialog.Panel"),l=M(t,o.panelRef),s=a.useMemo(()=>({open:i===0}),[i]),c=b(d=>{d.stopPropagation()});return C({ourProps:{ref:l,id:r,onClick:c},theirProps:u,slot:s,defaultTag:_n,name:"Dialog.Panel"})}let Un="h2";function jn(e,t){let n=Q(),{id:r=`headlessui-dialog-title-${n}`,...u}=e,[{dialogState:i,setTitleId:o}]=fe("Dialog.Title"),l=M(t);a.useEffect(()=>(o(r),()=>o(null)),[r,o]);let s=a.useMemo(()=>({open:i===0}),[i]);return C({ourProps:{ref:l,id:r},theirProps:u,slot:s,defaultTag:Un,name:"Dialog.Title"})}let Wn=P(On),Vn=P(Hn),Kn=P(Bn),Gn=P(Nn),Qn=P(jn),Hr=Object.assign(Wn,{Backdrop:Vn,Panel:Kn,Overlay:Gn,Title:Qn,Description:xt}),ze=/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;function Je(e){var t,n;let r=(t=e.innerText)!=null?t:"",u=e.cloneNode(!0);if(!(u instanceof HTMLElement))return r;let i=!1;for(let l of u.querySelectorAll('[hidden],[aria-hidden],[role="img"]'))l.remove(),i=!0;let o=i?(n=u.innerText)!=null?n:"":r;return ze.test(o)&&(o=o.replace(ze,"")),o}function Xn(e){let t=e.getAttribute("aria-label");if(typeof t=="string")return t.trim();let n=e.getAttribute("aria-labelledby");if(n){let r=n.split(" ").map(u=>{let i=document.getElementById(u);if(i){let o=i.getAttribute("aria-label");return typeof o=="string"?o.trim():Je(i).trim()}return null}).filter(Boolean);if(r.length>0)return r.join(", ")}return Je(e).trim()}function Yn(e){let t=a.useRef(""),n=a.useRef("");return b(()=>{let r=e.current;if(!r)return"";let u=r.innerText;if(t.current===u)return n.current;let i=Xn(r).trim().toLowerCase();return t.current=u,n.current=i,i})}var qn=(e=>(e[e.Open=0]="Open",e[e.Closed=1]="Closed",e))(qn||{}),zn=(e=>(e[e.Pointer=0]="Pointer",e[e.Other=1]="Other",e))(zn||{}),Jn=(e=>(e[e.OpenMenu=0]="OpenMenu",e[e.CloseMenu=1]="CloseMenu",e[e.GoToItem=2]="GoToItem",e[e.Search=3]="Search",e[e.ClearSearch=4]="ClearSearch",e[e.RegisterItem=5]="RegisterItem",e[e.UnregisterItem=6]="UnregisterItem",e))(Jn||{});function Fe(e,t=n=>n){let n=e.activeItemIndex!==null?e.items[e.activeItemIndex]:null,r=ot(t(e.items.slice()),i=>i.dataRef.current.domRef.current),u=n?r.indexOf(n):null;return u===-1&&(u=null),{items:r,activeItemIndex:u}}let Zn={[1](e){return e.menuState===1?e:{...e,activeItemIndex:null,menuState:1}},[0](e){return e.menuState===0?e:{...e,__demoMode:!1,menuState:0}},[2]:(e,t)=>{var n;let r=Fe(e),u=At(t,{resolveItems:()=>r.items,resolveActiveIndex:()=>r.activeItemIndex,resolveId:i=>i.id,resolveDisabled:i=>i.dataRef.current.disabled});return{...e,...r,searchQuery:"",activeItemIndex:u,activationTrigger:(n=t.trigger)!=null?n:1}},[3]:(e,t)=>{let n=e.searchQuery!==""?0:1,r=e.searchQuery+t.value.toLowerCase(),u=(e.activeItemIndex!==null?e.items.slice(e.activeItemIndex+n).concat(e.items.slice(0,e.activeItemIndex+n)):e.items).find(o=>{var l;return((l=o.dataRef.current.textValue)==null?void 0:l.startsWith(r))&&!o.dataRef.current.disabled}),i=u?e.items.indexOf(u):-1;return i===-1||i===e.activeItemIndex?{...e,searchQuery:r}:{...e,searchQuery:r,activeItemIndex:i,activationTrigger:1}},[4](e){return e.searchQuery===""?e:{...e,searchQuery:"",searchActiveItemIndex:null}},[5]:(e,t)=>{let n=Fe(e,r=>[...r,{id:t.id,dataRef:t.dataRef}]);return{...e,...n}},[6]:(e,t)=>{let n=Fe(e,r=>{let u=r.findIndex(i=>i.id===t.id);return u!==-1&&r.splice(u,1),r});return{...e,...n,activationTrigger:1}}},Ge=a.createContext(null);Ge.displayName="MenuContext";function Ee(e){let t=a.useContext(Ge);if(t===null){let n=new Error(`<${e} /> is missing a parent <Menu /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(n,Ee),n}return t}function er(e,t){return I(t.type,Zn,e,t)}let tr=a.Fragment;function nr(e,t){let{__demoMode:n=!1,...r}=e,u=a.useReducer(er,{__demoMode:n,menuState:n?0:1,buttonRef:a.createRef(),itemsRef:a.createRef(),items:[],searchQuery:"",activeItemIndex:null,activationTrigger:1}),[{menuState:i,itemsRef:o,buttonRef:l},s]=u,c=M(t);ut([l,o],(v,p)=>{var m;s({type:1}),je(p,Ue.Loose)||(v.preventDefault(),(m=l.current)==null||m.focus())},i===0);let d=b(()=>{s({type:1})}),g=a.useMemo(()=>({open:i===0,close:d}),[i,d]),E={ref:c};return w.createElement(Ge.Provider,{value:u},w.createElement(it,{value:I(i,{[0]:F.Open,[1]:F.Closed})},C({ourProps:E,theirProps:r,slot:g,defaultTag:tr,name:"Menu"})))}let rr="button";function or(e,t){var n;let r=Q(),{id:u=`headlessui-menu-button-${r}`,...i}=e,[o,l]=Ee("Menu.Button"),s=M(o.buttonRef,t),c=ce(),d=b(m=>{switch(m.key){case x.Space:case x.Enter:case x.ArrowDown:m.preventDefault(),m.stopPropagation(),l({type:0}),c.nextFrame(()=>l({type:2,focus:k.First}));break;case x.ArrowUp:m.preventDefault(),m.stopPropagation(),l({type:0}),c.nextFrame(()=>l({type:2,focus:k.Last}));break}}),g=b(m=>{switch(m.key){case x.Space:m.preventDefault();break}}),E=b(m=>{if(et(m.currentTarget))return m.preventDefault();e.disabled||(o.menuState===0?(l({type:1}),c.nextFrame(()=>{var h;return(h=o.buttonRef.current)==null?void 0:h.focus({preventScroll:!0})})):(m.preventDefault(),l({type:0})))}),v=a.useMemo(()=>({open:o.menuState===0}),[o]),p={ref:s,id:u,type:It(e,o.buttonRef),"aria-haspopup":"menu","aria-controls":(n=o.itemsRef.current)==null?void 0:n.id,"aria-expanded":e.disabled?void 0:o.menuState===0,onKeyDown:d,onKeyUp:g,onClick:E};return C({ourProps:p,theirProps:i,slot:v,defaultTag:rr,name:"Menu.Button"})}let lr="div",ur=ae.RenderStrategy|ae.Static;function ir(e,t){var n,r;let u=Q(),{id:i=`headlessui-menu-items-${u}`,...o}=e,[l,s]=Ee("Menu.Items"),c=M(l.itemsRef,t),d=te(l.itemsRef),g=ce(),E=he(),v=(()=>E!==null?(E&F.Open)===F.Open:l.menuState===0)();a.useEffect(()=>{let f=l.itemsRef.current;f&&l.menuState===0&&f!==(d==null?void 0:d.activeElement)&&f.focus({preventScroll:!0})},[l.menuState,l.itemsRef,d]),kt({container:l.itemsRef.current,enabled:l.menuState===0,accept(f){return f.getAttribute("role")==="menuitem"?NodeFilter.FILTER_REJECT:f.hasAttribute("role")?NodeFilter.FILTER_SKIP:NodeFilter.FILTER_ACCEPT},walk(f){f.setAttribute("role","none")}});let p=b(f=>{var T,S;switch(g.dispose(),f.key){case x.Space:if(l.searchQuery!=="")return f.preventDefault(),f.stopPropagation(),s({type:3,value:f.key});case x.Enter:if(f.preventDefault(),f.stopPropagation(),s({type:1}),l.activeItemIndex!==null){let{dataRef:$}=l.items[l.activeItemIndex];(S=(T=$.current)==null?void 0:T.domRef.current)==null||S.click()}rt(l.buttonRef.current);break;case x.ArrowDown:return f.preventDefault(),f.stopPropagation(),s({type:2,focus:k.Next});case x.ArrowUp:return f.preventDefault(),f.stopPropagation(),s({type:2,focus:k.Previous});case x.Home:case x.PageUp:return f.preventDefault(),f.stopPropagation(),s({type:2,focus:k.First});case x.End:case x.PageDown:return f.preventDefault(),f.stopPropagation(),s({type:2,focus:k.Last});case x.Escape:f.preventDefault(),f.stopPropagation(),s({type:1}),G().nextFrame(()=>{var $;return($=l.buttonRef.current)==null?void 0:$.focus({preventScroll:!0})});break;case x.Tab:f.preventDefault(),f.stopPropagation(),s({type:1}),G().nextFrame(()=>{Ot(l.buttonRef.current,f.shiftKey?B.Previous:B.Next)});break;default:f.key.length===1&&(s({type:3,value:f.key}),g.setTimeout(()=>s({type:4}),350));break}}),m=b(f=>{switch(f.key){case x.Space:f.preventDefault();break}}),h=a.useMemo(()=>({open:l.menuState===0}),[l]),y={"aria-activedescendant":l.activeItemIndex===null||(n=l.items[l.activeItemIndex])==null?void 0:n.id,"aria-labelledby":(r=l.buttonRef.current)==null?void 0:r.id,id:i,onKeyDown:p,onKeyUp:m,role:"menu",tabIndex:0,ref:c};return C({ourProps:y,theirProps:o,slot:h,defaultTag:lr,features:ur,visible:v,name:"Menu.Items"})}let ar=a.Fragment;function sr(e,t){let n=Q(),{id:r=`headlessui-menu-item-${n}`,disabled:u=!1,...i}=e,[o,l]=Ee("Menu.Item"),s=o.activeItemIndex!==null?o.items[o.activeItemIndex].id===r:!1,c=a.useRef(null),d=M(t,c);O(()=>{if(o.__demoMode||o.menuState!==0||!s||o.activationTrigger===0)return;let $=G();return $.requestAnimationFrame(()=>{var A,D;(D=(A=c.current)==null?void 0:A.scrollIntoView)==null||D.call(A,{block:"nearest"})}),$.dispose},[o.__demoMode,c,s,o.menuState,o.activationTrigger,o.activeItemIndex]);let g=Yn(c),E=a.useRef({disabled:u,domRef:c,get textValue(){return g()}});O(()=>{E.current.disabled=u},[E,u]),O(()=>(l({type:5,id:r,dataRef:E}),()=>l({type:6,id:r})),[E,r]);let v=b(()=>{l({type:1})}),p=b($=>{if(u)return $.preventDefault();l({type:1}),rt(o.buttonRef.current)}),m=b(()=>{if(u)return l({type:2,focus:k.Nothing});l({type:2,focus:k.Specific,id:r})}),h=Ht(),y=b($=>h.update($)),f=b($=>{h.wasMoved($)&&(u||s||l({type:2,focus:k.Specific,id:r,trigger:0}))}),T=b($=>{h.wasMoved($)&&(u||s&&l({type:2,focus:k.Nothing}))}),S=a.useMemo(()=>({active:s,disabled:u,close:v}),[s,u,v]);return C({ourProps:{id:r,ref:d,role:"menuitem",tabIndex:u===!0?void 0:-1,"aria-disabled":u===!0?!0:void 0,disabled:void 0,onClick:p,onFocus:m,onPointerEnter:y,onMouseEnter:y,onPointerMove:f,onMouseMove:f,onPointerLeave:T,onMouseLeave:T},theirProps:i,slot:S,defaultTag:ar,name:"Menu.Item"})}let cr=P(nr),dr=P(or),fr=P(ir),mr=P(sr),_r=Object.assign(cr,{Button:dr,Items:fr,Item:mr});function pr(e=0){let[t,n]=a.useState(e),r=de(),u=a.useCallback(s=>{r.current&&n(c=>c|s)},[t,r]),i=a.useCallback(s=>!!(t&s),[t]),o=a.useCallback(s=>{r.current&&n(c=>c&~s)},[n,r]),l=a.useCallback(s=>{r.current&&n(c=>c^s)},[n]);return{flags:t,addFlag:u,hasFlag:i,removeFlag:o,toggleFlag:l}}function vr(e){let t={called:!1};return(...n)=>{if(!t.called)return t.called=!0,e(...n)}}function Ie(e,...t){e&&t.length>0&&e.classList.add(...t)}function Pe(e,...t){e&&t.length>0&&e.classList.remove(...t)}function gr(e,t){let n=G();if(!e)return n.dispose;let{transitionDuration:r,transitionDelay:u}=getComputedStyle(e),[i,o]=[r,u].map(s=>{let[c=0]=s.split(",").filter(Boolean).map(d=>d.includes("ms")?parseFloat(d):parseFloat(d)*1e3).sort((d,g)=>g-d);return c}),l=i+o;if(l!==0){n.group(c=>{c.setTimeout(()=>{t(),c.dispose()},l),c.addEventListener(e,"transitionrun",d=>{d.target===d.currentTarget&&c.dispose()})});let s=n.addEventListener(e,"transitionend",c=>{c.target===c.currentTarget&&(t(),s())})}else t();return n.add(()=>t()),n.dispose}function hr(e,t,n,r){let u=n?"enter":"leave",i=G(),o=r!==void 0?vr(r):()=>{};u==="enter"&&(e.removeAttribute("hidden"),e.style.display="");let l=I(u,{enter:()=>t.enter,leave:()=>t.leave}),s=I(u,{enter:()=>t.enterTo,leave:()=>t.leaveTo}),c=I(u,{enter:()=>t.enterFrom,leave:()=>t.leaveFrom});return Pe(e,...t.enter,...t.enterTo,...t.enterFrom,...t.leave,...t.leaveFrom,...t.leaveTo,...t.entered),Ie(e,...l,...c),i.nextFrame(()=>{Pe(e,...c),Ie(e,...s),gr(e,()=>(Pe(e,...l),Ie(e,...t.entered),o()))}),i.dispose}function Er({container:e,direction:t,classes:n,onStart:r,onStop:u}){let i=de(),o=ce(),l=V(t);O(()=>{let s=G();o.add(s.dispose);let c=e.current;if(c&&l.current!=="idle"&&i.current)return s.dispose(),r.current(l.current),s.add(hr(c,n.current,l.current==="enter",()=>{s.dispose(),u.current(l.current)})),s.dispose},[t])}function q(e=""){return e.split(" ").filter(t=>t.trim().length>1)}let be=a.createContext(null);be.displayName="TransitionContext";var br=(e=>(e.Visible="visible",e.Hidden="hidden",e))(br||{});function wr(){let e=a.useContext(be);if(e===null)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return e}function yr(){let e=a.useContext(we);if(e===null)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return e}let we=a.createContext(null);we.displayName="NestingContext";function ye(e){return"children"in e?ye(e.children):e.current.filter(({el:t})=>t.current!==null).filter(({state:t})=>t==="visible").length>0}function vt(e,t){let n=V(e),r=a.useRef([]),u=de(),i=ce(),o=b((v,p=W.Hidden)=>{let m=r.current.findIndex(({el:h})=>h===v);m!==-1&&(I(p,{[W.Unmount](){r.current.splice(m,1)},[W.Hidden](){r.current[m].state="hidden"}}),i.microTask(()=>{var h;!ye(r)&&u.current&&((h=n.current)==null||h.call(n))}))}),l=b(v=>{let p=r.current.find(({el:m})=>m===v);return p?p.state!=="visible"&&(p.state="visible"):r.current.push({el:v,state:"visible"}),()=>o(v,W.Unmount)}),s=a.useRef([]),c=a.useRef(Promise.resolve()),d=a.useRef({enter:[],leave:[],idle:[]}),g=b((v,p,m)=>{s.current.splice(0),t&&(t.chains.current[p]=t.chains.current[p].filter(([h])=>h!==v)),t==null||t.chains.current[p].push([v,new Promise(h=>{s.current.push(h)})]),t==null||t.chains.current[p].push([v,new Promise(h=>{Promise.all(d.current[p].map(([y,f])=>f)).then(()=>h())})]),p==="enter"?c.current=c.current.then(()=>t==null?void 0:t.wait.current).then(()=>m(p)):m(p)}),E=b((v,p,m)=>{Promise.all(d.current[p].splice(0).map(([h,y])=>y)).then(()=>{var h;(h=s.current.shift())==null||h()}).then(()=>m(p))});return a.useMemo(()=>({children:r,register:l,unregister:o,onStart:g,onStop:E,wait:c,chains:d}),[l,o,r,g,E,d,c])}function $r(){}let Tr=["beforeEnter","afterEnter","beforeLeave","afterLeave"];function Ze(e){var t;let n={};for(let r of Tr)n[r]=(t=e[r])!=null?t:$r;return n}function Sr(e){let t=a.useRef(Ze(e));return a.useEffect(()=>{t.current=Ze(e)},[e]),t}let Rr="div",gt=ae.RenderStrategy;function xr(e,t){let{beforeEnter:n,afterEnter:r,beforeLeave:u,afterLeave:i,enter:o,enterFrom:l,enterTo:s,entered:c,leave:d,leaveFrom:g,leaveTo:E,...v}=e,p=a.useRef(null),m=M(p,t),h=v.unmount?W.Unmount:W.Hidden,{show:y,appear:f,initial:T}=wr(),[S,$]=a.useState(y?"visible":"hidden"),A=yr(),{register:D,unregister:H}=A,J=a.useRef(null);a.useEffect(()=>D(p),[D,p]),a.useEffect(()=>{if(h===W.Hidden&&p.current){if(y&&S!=="visible"){$("visible");return}return I(S,{hidden:()=>H(p),visible:()=>D(p)})}},[S,p,D,H,y,h]);let ne=V({enter:q(o),enterFrom:q(l),enterTo:q(s),entered:q(c),leave:q(d),leaveFrom:q(g),leaveTo:q(E)}),Z=Sr({beforeEnter:n,afterEnter:r,beforeLeave:u,afterLeave:i}),X=se();a.useEffect(()=>{if(X&&S==="visible"&&p.current===null)throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?")},[p,S,X]);let U=T&&!f,$e=(()=>!X||U||J.current===y?"idle":y?"enter":"leave")(),Y=pr(0),me=b(N=>I(N,{enter:()=>{Y.addFlag(F.Opening),Z.current.beforeEnter()},leave:()=>{Y.addFlag(F.Closing),Z.current.beforeLeave()},idle:()=>{}})),Te=b(N=>I(N,{enter:()=>{Y.removeFlag(F.Opening),Z.current.afterEnter()},leave:()=>{Y.removeFlag(F.Closing),Z.current.afterLeave()},idle:()=>{}})),ee=vt(()=>{$("hidden"),H(p)},A);Er({container:p,classes:ne,direction:$e,onStart:V(N=>{ee.onStart(p,N,me)}),onStop:V(N=>{ee.onStop(p,N,Te),N==="leave"&&!ye(ee)&&($("hidden"),H(p))})}),a.useEffect(()=>{U&&(h===W.Hidden?J.current=null:J.current=y)},[y,U,S]);let re=v,Se={ref:m};return f&&y&&T&&(re={...re,className:Pt(v.className,...ne.current.enter,...ne.current.enterFrom)}),w.createElement(we.Provider,{value:ee},w.createElement(it,{value:I(S,{visible:F.Open,hidden:F.Closed})|Y.flags},C({ourProps:Se,theirProps:re,defaultTag:Rr,features:gt,visible:S==="visible",name:"Transition.Child"})))}function Fr(e,t){let{show:n,appear:r=!1,unmount:u,...i}=e,o=a.useRef(null),l=M(o,t);se();let s=he();if(n===void 0&&s!==null&&(n=(s&F.Open)===F.Open),![!0,!1].includes(n))throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");let[c,d]=a.useState(n?"visible":"hidden"),g=vt(()=>{d("hidden")}),[E,v]=a.useState(!0),p=a.useRef([n]);O(()=>{E!==!1&&p.current[p.current.length-1]!==n&&(p.current.push(n),v(!1))},[p,n]);let m=a.useMemo(()=>({show:n,appear:r,initial:E}),[n,r,E]);a.useEffect(()=>{if(n)d("visible");else if(!ye(g))d("hidden");else{let T=o.current;if(!T)return;let S=T.getBoundingClientRect();S.x===0&&S.y===0&&S.width===0&&S.height===0&&d("hidden")}},[n,g]);let h={unmount:u},y=b(()=>{var T;E&&v(!1),(T=e.beforeEnter)==null||T.call(e)}),f=b(()=>{var T;E&&v(!1),(T=e.beforeLeave)==null||T.call(e)});return w.createElement(we.Provider,{value:g},w.createElement(be.Provider,{value:m},C({ourProps:{...h,as:a.Fragment,children:w.createElement(ht,{ref:l,...h,...i,beforeEnter:y,beforeLeave:f})},theirProps:{},defaultTag:a.Fragment,features:gt,visible:c==="visible",name:"Transition"})))}function Ir(e,t){let n=a.useContext(be)!==null,r=he()!==null;return w.createElement(w.Fragment,null,!n&&r?w.createElement(He,{ref:t,...e}):w.createElement(ht,{ref:t,...e}))}let He=P(Fr),ht=P(xr),Pr=P(Ir),Br=Object.assign(He,{Child:Pr,Root:He});function Mr(e,t){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor","aria-hidden":"true",ref:t},e),a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 6h16M4 12h16M4 18h7"}))}const Cr=a.forwardRef(Mr),Ur=Cr;function Dr(e,t){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor","aria-hidden":"true",ref:t},e),a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18L18 6M6 6l12 12"}))}const Lr=a.forwardRef(Dr),jr=Lr;function Or(e,t){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:t},e),a.createElement("path",{fillRule:"evenodd",d:"M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z",clipRule:"evenodd"}))}const kr=a.forwardRef(Or),Wr=kr;export{Br as $,Ur as M,Wr as S,jr as X,Hr as _,_r as i};