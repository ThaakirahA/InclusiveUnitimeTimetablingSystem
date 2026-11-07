/* APPLICATION LOGIC LAYER - pure functions: filtering, collision, visibility, time maths (Design 3.2.2) */
const endOf=s=>String(parseInt(s)+2).padStart(2,"0")+":00",hue=m=>[...m].reduce((a,c)=>a+c.charCodeAt(0),0)*7%360;
const seeC=(c,u)=>!u||u.role==="staff"||(ENROL[u.id]||[]).includes(c.id);
const seeN=(n,u)=>{const k=n.cid||NMAP[n.id];return !u||u.role==="staff"||!k||(ENROL[u.id]||[]).includes(k)};
/* ---- Filter logic: every selected filter must match (AND) ---- */
const filterClasses=(list,f)=>list.filter(c=>(!f.day||c.day===f.day)&&(!f.module||c.module===f.module)&&(!f.venue||c.venue===f.venue)&&(!f.q||(c.module+" "+c.venue).toLowerCase().includes(f.q.toLowerCase()))&&(!f.time||(f.time==="am")===(c.start<"12:00")));

const mins=(c,n)=>{const di=(DAYS.indexOf(c.day)-((n.getDay()+6)%7)+7)%7,[h,m]=c.start.split(":").map(Number),t=di*1440+h*60+m-(n.getHours()*60+n.getMinutes());return t<0?t+10080:t};
const until=m=>m<60?`Starts in ${m}m`:m<1440?`Starts in ${Math.floor(m/60)}h ${m%60}m`:`Starts in ${Math.floor(m/1440)}d`;
const initials=n=>n.replace(/^Dr\s+/,"").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
const findCollision=(list,f)=>list.find(c=>c.id!==f.id&&c.day===f.day&&c.start===f.start);
