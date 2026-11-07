/* API / SERVICE LAYER - simulated endpoints with role and collision checks (Design 3.2.3, 7.1.2, 8.3) */
const persistDemo=()=>{try{localStorage.setItem('ut-demo-data',JSON.stringify({classes:DB.classes,notifications:DB.notifications}))}catch(e){}};
const lag=v=>new Promise(r=>setTimeout(()=>r(structuredClone(v)),120));
const api={
 login:async(role,id,pw)=>{await lag(0);const u=DB.users.find(x=>x.role===role&&x.id.toLowerCase()===id.trim().toLowerCase()&&x.pw===pw);return u?{id:u.id,role:u.role,name:u.name}:null},
 getClasses:u=>lag(DB.classes.filter(c=>seeC(c,u))),getNotifications:u=>lag(DB.notifications.filter(n=>seeN(n,u))),
 markRead:(id,u)=>{DB.notifications.forEach(n=>{if(seeN(n,u)&&(!id||n.id===id))n.read=true});persistDemo();return lag(DB.notifications.filter(n=>seeN(n,u)))},
 updateClass:(f,u)=>{if(!u||u.role!=="staff")throw new Error("Unauthorised: staff role required");const c=DB.classes.find(x=>x.id===f.id);if(!c)throw new Error("Class not found");if(!f.venue||!f.venue.trim())throw new Error("Venue required");if(findCollision(DB.classes,f))throw new Error("Slot collision");Object.assign(c,{day:f.day,start:f.start,end:endOf(f.start),venue:f.venue.trim()});
  DB.notifications.unshift({id:"n"+Date.now(),cid:c.id,title:"Timetable update",body:`${c.module} is now on ${c.day}, ${c.start}–${c.end} in ${c.venue}.${f.msg?" "+f.msg:""}`,time:"Just now",read:false});
  persistDemo();return lag({classes:DB.classes,notes:DB.notifications})}};
