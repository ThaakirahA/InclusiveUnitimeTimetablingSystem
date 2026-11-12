/* PRESENTATION LAYER - Staff tools: announcements and room availability (added after submission) */
function StaffTools({classes,onAnnounce}){
 const[a,setA]=useState({title:"",body:""}),[ae,setAe]=useState(""),[as,setAs]=useState(""),[day,setDay]=useState("Mon"),[slot,setSlot]=useState("08:00"),tRef=useRef(),bRef=useRef();
 const send=async e=>{e.preventDefault();setAs("");
  if(!a.title.trim()){setAe("Enter a title for the announcement.");tRef.current.focus();return}
  if(!a.body.trim()){setAe("Enter the announcement message.");bRef.current.focus();return}
  setAe("");try{await onAnnounce(a);setA({title:"",body:""});setAs("Announcement sent to all students.")}catch(x){setAe("Unable to send the announcement. Please try again.")}};
 const rows=roomStatus(classes,day,slot);
 return html`<form class="card" onSubmit=${send} noValidate><h2>Send announcement</h2>
  <div class="filters" style=${{gridTemplateColumns:"1fr"}}>
   <label>Announcement title<input ref=${tRef} maxLength="80" aria-describedby="aerr" aria-invalid=${ae&&!a.title.trim()?"true":undefined} value=${a.title} onInput=${e=>setA({...a,title:e.target.value})}/></label>
   <label>Announcement message<textarea ref=${bRef} rows="3" maxLength="300" aria-describedby="aerr" aria-invalid=${ae&&a.title.trim()&&!a.body.trim()?"true":undefined} value=${a.body} onInput=${e=>setA({...a,body:e.target.value})}></textarea></label></div>
  <button class="btn" type="submit">Send announcement</button>
  <p class="err" role="alert" id="aerr">${ae}</p><p class="status" role="status" aria-live="polite">${as}</p></form>
  <section class="card" aria-labelledby="ra-t"><h2 id="ra-t">Room availability</h2>
   <div class="filters"><label>Check day<select value=${day} onChange=${e=>setDay(e.target.value)}>${DAYS.map(d=>html`<option key=${d}>${d}</option>`)}</select></label>
   <label>Check time slot<select value=${slot} onChange=${e=>setSlot(e.target.value)}>${SLOTS.map(s=>html`<option key=${s} value=${s}>${s}–${endOf(s)}</option>`)}</select></label></div>
   <div class="mt"><table aria-labelledby="ra-t"><thead><tr><th scope="col">Venue</th><th scope="col">Status for ${day} ${slot}</th></tr></thead>
   <tbody>${rows.map(r=>html`<tr key=${r.venue}><th scope="row">${r.venue}</th><td>${r.by?"In use by "+r.by:"Free"}</td></tr>`)}</tbody></table></div></section>`}
