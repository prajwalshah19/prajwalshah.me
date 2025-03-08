import{c as m,r,g as h,a as u,j as e,m as o,A as x,u as f,L as y,b,P as g,T as p}from"./index-CULjhSWG.js";/**
 * @license lucide-react v0.477.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],v=m("ChevronDown",j),k={hidden:{opacity:0},visible:{opacity:1,transition:{delay:1.5,staggerChildren:.3}}},w={hidden:{opacity:0,y:20},visible:{opacity:1,y:0}},N=()=>{const[t,a]=r.useState(null),[s,c]=r.useState(null),n=[{label:"github",url:t==null?void 0:t.content},{label:"linkedin",url:s==null?void 0:s.content},{label:"resume",url:"#"}];return r.useEffect(()=>{h().then(l=>{a(l)}).catch(l=>console.error("Error fetching github link",l))},[]),r.useEffect(()=>{u().then(l=>{c(l)}).catch(l=>console.error("Error fetching linkedin link",l))},[]),e.jsx(o.div,{initial:"hidden",animate:"visible",variants:k,className:"flex flex-col lg:flex-row items-center justify-evenly h-[30vh] w-full text-4xl lg:text-5xl text-primary dark:text-secondary font-body pt-8 pb-8 mt-12 lg:mt-0",children:n.map((l,i)=>e.jsxs(o.a,{target:"_blank",href:l.url,variants:w,whileHover:{scale:1.05},whileTap:{scale:.95},className:"flex items-center mb-12 p-0 no-underline",children:[e.jsx("span",{children:l.label}),e.jsx(x,{className:"w-10 h-10"})]},i))})},L=({scrollToBio:t})=>e.jsxs("section",{className:"w-full h-screen flex lg:items-center justify-center ",children:[e.jsx("div",{className:`
          flex flex-col items-center justify-start pt-[20vh] lg:pt-[13vh] px-2
          lg:w-[80vw] lg:h-[75vh] lg:border-4 lg:border-primary lg:dark:border-secondary
          mx-auto
        `,children:e.jsxs("div",{className:"w-full flex flex-col ",children:[e.jsxs(o.h1,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},transition:{duration:1,delay:.3},className:" text-left lg:text-center text-8xl lg:text-[13rem] font-body text-primary dark:text-secondary",children:["Hi, ",e.jsx("br",{className:"block sm:hidden"})," I'm Praj"]}),e.jsx(o.p,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},transition:{duration:1,delay:.6},className:"mt-4 text-xl lg:text-center lg:text-2xl font-headline text-primary dark:text-secondary lg:pt-5",children:"Computer Science and Economics @ Purdue"}),e.jsx(N,{})]})}),e.jsx("button",{onClick:t,className:"absolute bottom-8 left-1/2 transform -translate-x-1/2 focus:outline-none","aria-label":"Scroll down to bio",children:e.jsx(v,{className:"w-15 h-15 text-primary dark:text-secondary animate-bounce"})})]}),d=({header:t,links:a})=>{const s=f(),c=o(y);return e.jsxs("div",{className:"flex flex-col items-start space-y-4",children:[e.jsx("h2",{className:"lg:text-6xl text-3xl font-bold font-body text-primary dark:text-secondary",children:t}),e.jsx("div",{className:"flex flex-col space-y-4",children:a.map((n,l)=>{const i=s.pathname===n.url;return e.jsxs(c,{to:n.url,className:`flex items-center space-x-1 no-underline lg:text-4xl text-2xl${i?"font-bold":""} text-primary dark:text-secondary`,whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx("span",{children:n.label}),e.jsx(x,{className:"w-5 h-5"})]},l)})})]})},E=()=>{const t=[{label:"Project 1",url:"#project1"},{label:"Project 2",url:"#project2"},{label:"Project 3",url:"#project3"}];return e.jsx(d,{header:"Featured",links:t})},P=()=>{const t=[{label:"About",url:"/about"},{label:"Projects",url:"/projects"},{label:"More",url:"/more"},{label:"Contact",url:"/contact"}];return e.jsx(d,{header:"Goto",links:t})},T=()=>{const[t,a]=r.useState(null);return r.useEffect(()=>{b().then(s=>{a(s)}).catch(s=>console.error("Error fetching bio:",s))},[]),e.jsx("section",{id:"bio",className:"w-full h-[98vh] lg:h-screen flex lg:items-center justify-center bg-secondary dark:bg-primary",children:e.jsxs("div",{className:"flex flex-col items-start justify-start pt-[0.5vh] lg:pt-[1vh] px-4 lg:w-[80vw] lg:h-[75vh] lg:border-4 lg:border-primary lg:dark:border-secondary mx-auto",children:[e.jsx("h2",{className:"lg:text-8xl text-6xl font-body text-primary dark:text-secondary mb-6",children:"Bio"}),e.jsx("div",{className:" text-primary dark:text-secondary lg:text-lg text-base",children:e.jsx(g,{value:t==null?void 0:t.content})}),e.jsxs("div",{className:"flex flex-row w-full mt-8 gap-y-4 gap-x-4",children:[e.jsx("div",{className:"w-full lg:w-1/2 h-auto lg:h-[50%]",children:e.jsx(E,{})}),e.jsx("div",{className:"w-full lg:w-1/2 h-auto lg:h-[50%]",children:e.jsx(P,{})})]})]})})},B=()=>{const t=()=>{const a=document.getElementById("bio");a&&a.scrollIntoView({behavior:"smooth"})};return e.jsxs("div",{className:"bg:secondary dark:bg-primary mx-auto w-screen h-screen",children:[e.jsx(p,{}),e.jsx(L,{scrollToBio:t}),e.jsx(T,{})]})};export{B as default};
