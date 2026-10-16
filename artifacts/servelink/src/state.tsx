import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Category = 'Electrician' | 'Plumber' | 'Painter' | 'Mechanic' | 'Mason';
export type Role = 'customer' | 'professional';
export type Status = 'pending' | 'accepted' | 'rejected' | 'completed';
export type Pro = { id:string; name:string; category:Category; experience:number; area:string; rating:number; reviews:number; available:boolean; skills:string[]; works:string[]; reviewText:string };
export type Request = { id:string; proId:string; customer:string; category:Category; description:string; photo?:string; area:string; created:number; status:Status; messages:{mine:boolean;text:string}[] };
const demo:Pro[]=[
 {id:'amara-cole',name:'Amara Cole',category:'Electrician',experience:9,area:'Northside district',rating:4.9,reviews:38,available:true,skills:['Panel upgrades','Lighting','Fault finding'],works:['#d6e7df','#d9e3ef'],reviewText:'Arrived when she said she would and explained every step.'},
 {id:'dev-patel',name:'Dev Patel',category:'Electrician',experience:6,area:'Riverside quarter',rating:4.8,reviews:24,available:true,skills:['Wiring','Ceiling fans','Safety checks'],works:['#d8e4ec'],reviewText:'Careful, tidy work and a very clear quote.'},
 {id:'niko-reed',name:'Niko Reed',category:'Plumber',experience:12,area:'West market area',rating:4.9,reviews:51,available:true,skills:['Leak repair','Water heaters','Drain clearing'],works:['#e3ebdf','#dfe5ef'],reviewText:'Found the source of a stubborn leak quickly.'},
 {id:'lena-moss',name:'Lena Moss',category:'Plumber',experience:7,area:'Garden district',rating:4.7,reviews:19,available:false,skills:['Bathroom fitting','Pipe repair','Taps'],works:['#e2e9dd'],reviewText:'Thoughtful finish and kept the space clean.'},
 {id:'celia-wong',name:'Celia Wong',category:'Painter',experience:11,area:'East hill neighborhood',rating:4.9,reviews:43,available:true,skills:['Interior finishes','Cabinet painting','Color matching'],works:['#eadfd4','#dbe7df'],reviewText:'The rooms look beautifully refreshed.'},
 {id:'omar-james',name:'Omar James',category:'Painter',experience:5,area:'Old town area',rating:4.6,reviews:15,available:true,skills:['Walls and ceilings','Exterior paint','Prep work'],works:['#e5e2d5'],reviewText:'Good preparation and no mess left behind.'},
 {id:'rafa-silva',name:'Rafa Silva',category:'Mechanic',experience:10,area:'Lakeside district',rating:4.8,reviews:31,available:true,skills:['Diagnostics','Brake service','Routine maintenance'],works:['#dce4e8','#e5e1d9'],reviewText:'Straightforward advice and reliable work.'},
 {id:'jules-carter',name:'Jules Carter',category:'Mechanic',experience:8,area:'South park area',rating:4.7,reviews:22,available:false,skills:['Engine checks','Battery service','Tune-ups'],works:['#dce5df'],reviewText:'Helpful inspection before any work began.'},
 {id:'tariq-bell',name:'Tariq Bell',category:'Mason',experience:14,area:'Central gardens area',rating:4.9,reviews:47,available:true,skills:['Brick repair','Patios','Stonework'],works:['#e8e2d6','#d9e4df'],reviewText:'Strong craftsmanship and excellent communication.'},
 {id:'ivy-park',name:'Ivy Park',category:'Mason',experience:6,area:'Meadow edge district',rating:4.6,reviews:17,available:true,skills:['Repointing','Garden walls','Paving'],works:['#e1e5dc'],reviewText:'A neat, dependable repair.'},
];
type Store={role:Role|null; userName:string; activeProId:string; pros:Pro[]; requests:Request[]; setRole:(r:Role,n?:string)=>void; setActiveProId:(id:string)=>void; logout:()=>void; updatePro:(p:Pro)=>void; toggleAvailability:()=>void; createRequest:(data:{category:Category;description:string;photo?:string;proId?:string})=>Request|null; updateRequest:(id:string,status:Status)=>void; sendMessage:(id:string,text:string)=>void};
const Ctx=createContext<Store|null>(null);
const key='servelink-demo-v1';
export function StoreProvider({children}:{children:ReactNode}) {
 const [stored,setStored]=useState<{role:Role|null;userName:string;activeProId:string;pros:Pro[];requests:Request[]}>(()=>{try{const x=localStorage.getItem(key);if(x)return JSON.parse(x)}catch{}return {role:null,userName:'',activeProId:'amara-cole',pros:demo,requests:[]}});
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(stored))}catch{ /* Storage quota errors are handled by the upload limit. */ }},[stored]);
 const setRole=(role:Role,userName?:string)=>setStored(s=>({...s,role,userName:userName||s.userName||(role==='customer'?'Alex Morgan':s.pros.find(p=>p.id===s.activeProId)?.name||'Demo professional')}));
 const setActiveProId=(id:string)=>setStored(s=>({...s,activeProId:id,userName:s.role==='professional'?s.pros.find(p=>p.id===id)?.name||s.userName:s.userName}));
 const logout=()=>setStored(s=>({...s,role:null,userName:''}));
 const updatePro=(pro:Pro)=>setStored(s=>({...s,pros:s.pros.map(p=>p.id===pro.id?pro:p)}));
 const toggleAvailability=()=>setStored(s=>({...s,pros:s.pros.map(p=>p.id===s.activeProId?{...p,available:!p.available}:p)}));
 const createRequest=(data:{category:Category;description:string;photo?:string;proId?:string})=>{
   const matches=stored.pros.filter(p=>p.category===data.category&&p.available&&(!data.proId||p.id===data.proId));
   if(!matches.length)return null;
   const created:Request[]=matches.map((p,i)=>({id:`req-${Date.now()}-${i}-${Math.random().toString(36).slice(2,6)}`,proId:p.id,customer:stored.userName||'Alex Morgan',category:data.category,description:data.description,photo:data.photo,area:'Nearby area',created:Date.now(),status:'pending',messages:[]}));
   setStored(s=>({...s,role:s.role||'customer',userName:s.userName||'Alex Morgan',requests:[...created,...s.requests].slice(0,20)}));return created[0];
 };
 const updateRequest=(id:string,status:Status)=>setStored(s=>({...s,requests:s.requests.map(r=>r.id===id&&((r.status==='pending'&&(status==='accepted'||status==='rejected'))||(r.status==='accepted'&&status==='completed'))?{...r,status}:r)}));
 const sendMessage=(id:string,text:string)=>setStored(s=>({...s,requests:s.requests.map(r=>r.id===id?{...r,messages:[...r.messages,{mine:true,text}]}:r)}));
 const value=useMemo(()=>({...stored,setRole,setActiveProId,logout,updatePro,toggleAvailability,createRequest,updateRequest,sendMessage}),[stored]);
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useStore(){const value=useContext(Ctx);if(!value)throw new Error('StoreProvider missing');return value}
export const categories:Category[]=['Electrician','Plumber','Painter','Mechanic','Mason'];
export const categorySlug=(c:string)=>c.toLowerCase();
export const categoryFromSlug=(s:string):Category|undefined=>categories.find(c=>c.toLowerCase()===s.toLowerCase());
