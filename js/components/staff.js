/* PRESENTATION LAYER - Staff Dashboard and Timetable Update Form (Design 3.2.3) */
function Staff({user,classes,notes,onUpdate,onCancel,onAnnounce,go}){
 const[f,setF]=useState({id:"",day:"Mon",start:"08:00",venue:"",msg:""}),[cm,setCm]=useState(""),[st,setSt]=useState(""),[er,setEr]=useState(""),first=useRef(),vRef=useRef(),sRef=useRef();
 const pick=id=>{const c=classes.find(x=>x.id===id);setF(c?{id,day:c.day,start:c.start,venue:c.venue,msg:""}:{...f,id});setSt("")};
 const sub=async e=>{e.preventDefault();setSt("");
  if(!f.id||!f.venue.trim()){setEr("Choose a class and enter a venue.");(f.id?vRef:first).current.focus();return}
  const k=findCollision(classes,f);
  if(k){setEr(`${f.day} ${f.start} is already used by ${k.module}. Choose another day or time.`);sRef.current.focus();return}
  setEr("");try{await onUpdate(f);setSt("Update saved and a simulated student notification was created.")}catch(e){setEr("Unable to save this update. Please try again.")}};
 const toggle=async c=>{try{await onCancel(c.id,!c.cancelled);setCm(`${c.module} ${c.cancelled?"reinstated":"cancelled"}. Enrolled students were notified.`)}catch(e){setCm(e.message==="Slot collision"?`Cannot reinstate ${c.module}: its slot is now used by another class.`:"Unable to change this class. Please try again.")}};
 const set=k=>e=>setF({...f,[k]:e.target.value});
 const o=d=>DAYS.indexOf(d),unread=notes.filter(x=>!x.read).length;
 return html`<div class="view"><h1>Welcome, ${user.name}</h1><p class="sub">Edit the timetable and notify affected students.</p>
  <${Tiles} items=${[["tt","Manage timetables","Edit classes and venues",()=>first.current&&first.current.focus()],["nt","Notifications",unread+" unread updates",()=>go("nt")],["ax","Accessibility","Customise your experience",()=>go("ax")],["hp","Help & Support","Guides and shortcuts",()=>go("hp")]]}/>
  <${Upcoming} classes=${classes} n=${3} title="Upcoming schedule" go=${()=>go("tt")}/>
  <div class="card"><h2 id="mT">Manage classes</h2><div class="mt"><table aria-labelledby="mT"><thead><tr><th scope="col">Module</th><th scope="col">Day</th><th scope="col">Time</th><th scope="col">Venue</th><th scope="col">Action</th></tr></thead>
   <tbody>${[...classes].sort((a,b)=>o(a.day)-o(b.day)||a.start.localeCompare(b.start)).map(c=>html`<tr key=${c.id}><th scope="row">${c.module}${c.cancelled?" (cancelled)":""}</th><td>${c.day}</td><td>${c.start}–${c.end}</td><td>${c.venue}</td>
    <td><button class="mini" type="button" aria-label=${"Edit "+c.module} onClick=${()=>{pick(c.id);first.current&&first.current.focus()}}>Edit</button> <button class="mini" type="button" aria-label=${(c.cancelled?"Reinstate ":"Cancel ")+c.module} onClick=${()=>toggle(c)}>${c.cancelled?"Reinstate":"Cancel class"}</button></td></tr>`)}</tbody></table></div><p class="msg" role="status" aria-live="polite">${cm}</p></div>
  <form class="card" onSubmit=${sub} noValidate><h2>Timetable update form</h2>
   <div class="filters">
    <label>Module<select ref=${first} aria-invalid=${er&&!f.id?"true":undefined} aria-describedby="serr" value=${f.id} onChange=${e=>pick(e.target.value)}><option value="">Choose a module</option>${classes.map(c=>html`<option key=${c.id} value=${c.id}>${c.module}</option>`)}</select></label>
    <label>Day<select value=${f.day} onChange=${set("day")}>${DAYS.map(d=>html`<option key=${d}>${d}</option>`)}</select></label>
    <label>Time slot<select ref=${sRef} aria-describedby="serr" value=${f.start} onChange=${set("start")}>${SLOTS.map(s=>html`<option key=${s} value=${s}>${s}–${endOf(s)}</option>`)}</select></label>
    <label>New venue<input ref=${vRef} aria-invalid=${er&&!f.venue.trim()?"true":undefined} aria-describedby="serr" value=${f.venue} onInput=${set("venue")} placeholder="e.g. Room 1.20"/></label></div>
   <label style=${{margin:".8rem 0"}}>Message (optional)<textarea rows="2" value=${f.msg} onInput=${set("msg")}></textarea></label>
   <button class="btn" type="submit">Send update</button>
   <p class="err" role="alert" id="serr">${er}</p><p class="status" role="status" aria-live="polite">${st}</p></form>
  <${StaffTools} classes=${classes} onAnnounce=${onAnnounce}/></div>`}
