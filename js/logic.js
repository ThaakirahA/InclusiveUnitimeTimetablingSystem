/* APPLICATION LOGIC LAYER - pure functions: filtering, collision, visibility, time maths (Design 3.2.2) */
const endOf=s=>String(parseInt(s)+2).padStart(2,"0")+":00",hue=m=>[...m].reduce((a,c)=>a+c.charCodeAt(0),0)*7%360;
const seeC=(c,u)=>!u||u.role==="staff"||(ENROL[u.id]||[]).includes(c.id);
const seeN=(n,u)=>{if(n.kind==="exam")return !!u&&(u.role==="staff"||n.stream===STREAM_OF[u.id]);const k=n.cid||NMAP[n.id];return !u||u.role==="staff"||!k||(ENROL[u.id]||[]).includes(k)};
/* ---- Filter logic: every selected filter must match (AND) ---- */
const filterClasses=(list,f)=>list.filter(c=>(!f.day||c.day===f.day)&&(!f.module||c.module===f.module)&&(!f.venue||c.venue===f.venue)&&(!f.q||(c.module+" "+c.venue).toLowerCase().includes(f.q.toLowerCase()))&&(!f.time||(f.time==="am")===(c.start<"12:00")));

const mins=(c,n)=>{const di=(DAYS.indexOf(c.day)-((n.getDay()+6)%7)+7)%7,[h,m]=c.start.split(":").map(Number),t=di*1440+h*60+m-(n.getHours()*60+n.getMinutes());return t<0?t+10080:t};
const until=m=>m<60?`Starts in ${m}m`:m<1440?`Starts in ${Math.floor(m/60)}h ${m%60}m`:`Starts in ${Math.floor(m/1440)}d`;
const initials=n=>n.replace(/^Dr\s+/,"").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
const findCollision=(list,f)=>list.find(c=>c.id!==f.id&&!c.cancelled&&c.day===f.day&&c.start===f.start);

/* ---- Calendar export (.ics) and relative time ---- */
const pad=n=>String(n).padStart(2,"0"),DAYCODE={Mon:"MO",Tue:"TU",Wed:"WE",Thu:"TH",Fri:"FR"};
const icsDate=(d,t)=>`${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${t.replace(":","")}00`;
const icsEsc=s=>String(s).replace(/\\/g,"\\\\").replace(/[,;]/g,m=>"\\"+m).replace(/\n/g,"\\n");
const buildICS=(list,now=new Date())=>{
 const stamp=`${now.getUTCFullYear()}${pad(now.getUTCMonth()+1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
 const ev=list.map(c=>{const d=new Date(now.getTime()+mins(c,now)*60000);
  return["BEGIN:VEVENT",`UID:${c.id}@inclusive-unitime`,`DTSTAMP:${stamp}`,`DTSTART:${icsDate(d,c.start)}`,`DTEND:${icsDate(d,c.end)}`,"RRULE:FREQ=WEEKLY;BYDAY="+DAYCODE[c.day],`SUMMARY:${icsEsc(c.module)}`,`LOCATION:${icsEsc(c.venue)}`,"END:VEVENT"].join("\r\n")});
 return["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Inclusive UniTime//Prototype//EN","CALSCALE:GREGORIAN",...ev,"END:VCALENDAR"].join("\r\n")+"\r\n"};
const ago=(ts,now=Date.now())=>{const m=Math.floor((now-ts)/60000);return m<1?"Just now":m<60?`${m} min ago`:m<1440?`${Math.floor(m/60)} ${Math.floor(m/60)===1?"hour":"hours"} ago`:`${Math.floor(m/1440)} ${Math.floor(m/1440)===1?"day":"days"} ago`};
const when=n=>n.ts?ago(n.ts):n.time;

/* ---- Staff tools: room availability ---- */
const venuesOf=l=>[...new Set(l.map(c=>c.venue))].sort();
const roomStatus=(list,day,start)=>venuesOf(list).map(v=>{const c=list.find(x=>!x.cancelled&&x.venue===v&&x.day===day&&x.start===start);return{venue:v,by:c?c.module:""}});

const visibleExams=(list,u)=>u&&u.role==="staff"?list:list.filter(e=>u&&e.stream===STREAM_OF[u.id]);
const examOverlap=(a,b)=>a.date===b.date&&a.start<b.end&&b.start<a.end;
const examConflict=(list,e)=>list.find(x=>x.id!==e.id&&examOverlap(x,e)&&(x.venue.toLowerCase()===e.venue.toLowerCase()||x.stream===e.stream));
const normalizeExamDate=value=>{
 if(value instanceof Date&&!Number.isNaN(value.getTime()))return value.toISOString().slice(0,10);
 if(typeof value!=='string')return '';
 const v=value.trim();
 if(/^\d{4}-\d{2}-\d{2}$/.test(v))return v;
 if(/^\d{4}-\d{2}-\d{2}T/.test(v))return v.slice(0,10);
 return '';
};
const validExam=e=>{if(!STREAMS.includes(e.stream))throw new Error("Choose a valid stream.");if(!EXAM_MODULES[e.stream].includes(e.module))throw new Error("Choose a module registered for this stream.");if(!/^\d{4}-\d{2}-\d{2}$/.test(normalizeExamDate(e.date))||Number.isNaN(new Date(normalizeExamDate(e.date)+"T12:00:00").getTime())||new Date(normalizeExamDate(e.date)+"T12:00:00").toISOString().slice(0,10)!==normalizeExamDate(e.date))throw new Error("Enter a valid examination date.");if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(e.start)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(e.end)||e.start>=e.end)throw new Error("End time must be later than start time.");if(!e.venue||!e.venue.trim())throw new Error("Venue is required.")};
