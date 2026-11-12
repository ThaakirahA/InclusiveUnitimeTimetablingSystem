/* PRESENTATION LAYER - Student Dashboard, Timetable View, Notification Centre (Design 3.2.3) */
function Home({user,classes,notes,go}){
 const n=new Date(),h=n.getHours(),unread=notes.filter(x=>!x.read).length,top=[...notes].sort((a,b)=>a.read-b.read).slice(0,3);
 return html`<div class="view"><div class="rh"><div><h1>Good ${h<12?"morning":h<18?"afternoon":"evening"}, ${user.name.split(" ")[0]}!</h1><p class="sub">Here’s your timetable overview for this week.</p></div><span class="chip">${n.toLocaleDateString("en-ZA",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span></div>
  <${Tiles} items=${[["tt","My timetable","View your classes",()=>go("tt")],["nt","Notifications",unread+" unread updates",()=>go("nt")],["ax","Accessibility","Customise your experience",()=>go("ax")],["hp","Help & Support","Guides and shortcuts",()=>go("hp")]]}/>
  <div class="two"><${Upcoming} classes=${classes} n=${4} title="Upcoming classes" go=${()=>go("tt")}/>
  <section class="card"><div class="rh"><h2>Upcoming notifications</h2><button class="link" type="button" onClick=${()=>go("nt")}>View all</button></div>
   <ul class="notes">${top.map(x=>html`<li key=${x.id} class=${x.read?"":"unread"}><div class="body"><b>${x.title}</b><br/>${x.body}<br/><small>${when(x)}</small></div></li>`)}</ul></section></div></div>`}

function Quick({set,setSet,go}){const u=k=>v=>setSet({...set,[k]:v});
 return html`<section class="card" aria-labelledby="qa-t"><h2 id="qa-t">Accessibility options</h2>
  <${Seg} label="Text size" val=${set.text} on=${u("text")} opts=${TXT}/><${Seg} label="Colour contrast" val=${set.contrast} on=${u("contrast")} opts=${CON}/>
  <${Tog} id="l-motion" label="Reduced motion" on=${set.motion} set=${u("motion")}/><${Tog} id="l-kbd" label="Keyboard navigation" on=${set.kbd} set=${u("kbd")}/>
  <button class="btn alt big" type="button" onClick=${()=>go("ax")}>More accessibility settings</button></section>`}

function Timetable({user,classes,set,setSet,q,setQ,go}){
 const E={day:"",module:"",venue:"",time:""},[f,setF]=useState(E),[ex,setEx]=useState(""),[vw,setVw]=useState("week"),s=k=>v=>setF({...f,[k]:v}),list=filterClasses(classes,{...f,q}),today=DAYS[(new Date().getDay()+6)%7];
 const exp=()=>{try{downloadTimetablePDF("Class timetable",list.map(c=>[c.module,c.day,c.start+"–"+c.end,c.venue+(c.cancelled?" (cancelled)":"")]),user);setEx("Class timetable PDF downloaded.")}catch(e){setEx("PDF unavailable. Please check your connection and try again.")}};
 const txt=(list.length?`${list.length} ${list.length===1?"class":"classes"} shown`:"No timetable entries found. Try clearing a filter")+(q?` for “${q}”.`:".");
 const cards=html`<ul class="cards" style=${vw==="list"?{display:"grid"}:null}>${list.map(c=>html`<li key=${c.id} class=${c.cancelled?"x":""} style=${{"--h":hue(c.module)}}><b>${c.day} · ${c.start}–${c.end}</b>${c.module}<small>${c.venue}</small>${c.cancelled&&html`<small class="can">Cancelled</small>`}</li>`)}</ul>`;
 return html`<div class="view"><h1>My timetable</h1><p class="sub">View your personalised timetable and filter by day, module, venue or time.</p>
  <div class="ttl"><div>
  <form class="card filters" onSubmit=${e=>e.preventDefault()} aria-label="Timetable filters">
   <${Sel} l="Day" v=${f.day} set=${s("day")} opts=${DAYS} all="All days"/>
   <${Sel} l="Module" v=${f.module} set=${s("module")} opts=${[...new Set(classes.map(c=>c.module))]} all="All modules"/>
   <${Sel} l="Venue" v=${f.venue} set=${s("venue")} opts=${[...new Set(classes.map(c=>c.venue))]} all="All venues"/>
   <${Sel} l="Time" v=${f.time} set=${s("time")} opts=${[["am","Morning"],["pm","Afternoon"]]} all="All times"/>
   <button class="btn alt" type="button" onClick=${()=>{setF(E);setQ("")}}>Clear filters</button>
   <button class="btn alt" type="button" disabled=${!list.length} onClick=${exp}>Download class timetable (PDF)</button><p class="sr" role="status">${ex}</p></form>
  <div class="rh"><p class="msg" role="status" aria-live="polite">${txt}</p><div class="seg" role="group" aria-label="Timetable view"><button type="button" aria-pressed=${vw==="week"} onClick=${()=>setVw("week")}>Week view</button><button type="button" aria-pressed=${vw==="list"} onClick=${()=>setVw("list")}>List view</button></div></div>
  ${list.length?html`${vw==="week"&&html`<div class="tbl"><table><caption class="sr">Weekly timetable</caption>
   <thead><tr><th scope="col">Time</th>${DAYS.map(d=>html`<th scope="col" key=${d} class=${d===today?"today":""}>${d}</th>`)}</tr></thead>
   <tbody>${SLOTS.map(sl=>html`<tr key=${sl}><th scope="row">${sl}–${endOf(sl)}</th>${DAYS.map(d=>{const c=list.find(x=>x.day===d&&x.start===sl);return html`<td key=${d}>${c&&html`<div class=${c.cancelled?"cls x":"cls"} style=${{"--h":hue(c.module)}}><b>${c.module}</b><small>${c.venue}</small>${c.cancelled&&html`<small class="can">Cancelled</small>`}</div>`}</td>`})}</tr>`)}</tbody></table></div>`}${cards}`
  :html`<div class="empty"><h2>No timetable entries found</h2><p>Try clearing a filter.</p></div>`}</div>
  <${Quick} set=${set} setSet=${setSet} go=${go}/></div></div>`}

function Notes({notes,setNotes,user}){
 const[t,setT]=useState("all"),[m,setM]=useState(""),mark=(id,ti)=>api.markRead(id,user).then(r=>{setNotes(r);setM(id?"Marked as read: "+ti:"All notifications marked as read.")}),tm=n=>n.kind?n.kind==="tt":/venue|timetable/i.test(n.title);
 const list=notes.filter(n=>t==="all"||(t==="unread"&&!n.read)||(t==="tt"&&tm(n))||(t==="gen"&&!tm(n)));
 return html`<div class="view"><h1>Notifications</h1><p class="sub">Stay up to date with timetable changes and announcements.</p>
  <div class="card"><p class="sr" role="status">${m}</p><div class="rh"><${Seg} label="Show" val=${t} on=${setT} opts=${[["all","All"],["unread","Unread"],["tt","Timetable updates"],["gen","General"]]}/><button class="btn alt" type="button" onClick=${()=>mark()}>Mark all as read</button></div>
  ${list.length?html`<ul class="notes">${list.map(n=>html`<li key=${n.id} class=${n.read?"":"unread"}><div class="body"><b>${n.title}</b><span class="tag">${n.read?"Read":"Unread"}</span><br/>${n.body}<br/><small>${when(n)}</small></div>
   ${!n.read&&html`<button class="mini" type="button" onClick=${()=>mark(n.id,n.title)} aria-label=${"Mark as read: "+n.title+". "+n.body}>Mark as read</button>`}</li>`)}</ul>`:html`<p class="msg">No notifications in this view.</p>`}</div></div>`}
