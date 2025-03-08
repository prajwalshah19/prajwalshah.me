import{c as o,j as e,m as i,r as c,d as x,P as l,M as d,e as m,f as p,C as h}from"./index-CULjhSWG.js";/**
 * @license lucide-react v0.477.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]],y=o("ArrowDown",u),f=({scrollToExperience:s})=>e.jsx(i.div,{onClick:s,whileHover:{scale:1.05},whileTap:{scale:.95},className:"w-full flex items-center justify-center cursor-pointer mt-8",children:e.jsxs(i.span,{className:"flex items-center justify-center text-xl text-primary dark:text-secondary",animate:{y:[0,-5,0]},transition:{repeat:1/0,duration:1.5},children:["My experience",e.jsx(y,{className:"w-6 h-6 text-primary dark:text-secondary ml-2"})]})}),j=({scrollToExperience:s})=>{const[t,a]=c.useState(null);return c.useEffect(()=>{x().then(n=>{a(n)}).catch(n=>console.error("Error fetching about:",n))},[]),e.jsxs("div",{className:"relative h-screen px-4",children:[e.jsxs("div",{className:"pt-4 lg:pt-0",children:[e.jsx("h2",{className:"text-5xl lg:text-7xl font-body text-primary dark:text-secondary mb-4",children:"A bit about me..."}),e.jsx("div",{className:"text-lg text-primary dark:text-secondary mb-8",children:e.jsx(l,{value:t==null?void 0:t.content})})]}),e.jsxs("div",{className:"absolute left-0 right-0 bottom-[calc(15vh)] flex flex-col items-center",children:[e.jsx(d,{}),e.jsx(f,{scrollToExperience:s})]})]})},g=({entries:s})=>e.jsx("div",{className:"w-full lg:w-3/5 mx-auto flex flex-col items-start",children:s.map((t,a)=>e.jsxs("div",{className:"flex mb-8",children:[e.jsxs("div",{className:"flex flex-col items-center mr-4",children:[e.jsx("div",{className:"w-4 h-4 rounded-full bg-primary dark:bg-secondary"}),a!==s.length&&e.jsx("div",{className:"flex-1 w-px bg-primary dark:bg-secondary"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-primary dark:text-secondary",children:t.dateRange}),e.jsx("h3",{className:"text-xl font-bold text-primary dark:text-secondary",children:t.position}),e.jsx("h4",{className:"text-lg text-primary dark:text-secondary",children:t.company}),t.location&&e.jsx("p",{className:"text-sm italic text-primary dark:text-secondary",children:t.location}),e.jsx("div",{className:"mt-2 text-base text-primary dark:text-secondary",children:e.jsx(l,{value:t.description})})]})]},t._id))}),b=async()=>await m.fetch(`*[_type == "experience"] | order(date desc){
      _id,
      dateRange,
      company,
      position,
      date,
      description,
      location
    }`),v=()=>{const[s,t]=c.useState([]),[a,n]=c.useState(null);return c.useEffect(()=>{b().then(r=>{t(r)}).catch(r=>console.error("Error fetching experiences:",r))},[]),c.useEffect(()=>{p().then(r=>{n(r)}).catch(r=>console.error("Error fetching experiences:",r))},[]),e.jsxs("div",{className:"flex flex-col items-start h-[98vh]",id:"experience",children:[e.jsx("h2",{className:"text-5xl lg:text-7xl font-body text-primary dark:text-secondary mt-4 mb-4",children:"My Journey"}),e.jsx("div",{className:"text-lg text-primary dark:text-secondary mb-8",children:e.jsx(l,{value:a==null?void 0:a.content})}),e.jsx(g,{entries:s})]})},k=()=>{const s=()=>{const t=document.getElementById("experience");t&&t.scrollIntoView({behavior:"smooth"})};return e.jsx(h,{children:e.jsxs("div",{className:"w-full lg:w-3/5 mx-auto space-y-12 lg:p-0 p-2",children:[e.jsx(j,{scrollToExperience:s}),e.jsx(v,{})]})})};export{k as default};
