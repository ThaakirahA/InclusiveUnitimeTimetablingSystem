/* Exam timetable and accessible demo PDF / email workflow */
function examRows(exams,user){return [...exams].sort((a,b)=>a.date.localeCompare(b.date)||a.start.localeCompare(b.start)).map(e=>[e.module+(user.role==='staff'?' / '+e.stream:''),e.date,e.start+' - '+e.end,e.venue])}
function downloadTimetablePDF(type,rows,user){
 if(!window.jspdf?.jsPDF)throw Error('PDF library unavailable');
 const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'}),pageW=210,left=16,right=194;
 const exam=type==='Exam timetable',title=exam?'EXAM TIMETABLE':'CLASS TIMETABLE';
 const generated=new Date().toLocaleString('en-ZA',{dateStyle:'medium',timeStyle:'short'});
 const stamp=()=>{
  // Fictional university identity; the square stamp is deliberately marked DEMO.
  const x=158,y=35,size=36;
  doc.setDrawColor(45,82,150);doc.setLineWidth(.65);doc.roundedRect(x,y,size,size,1,1,'S');
  doc.setDrawColor(135,162,205);doc.setLineWidth(.3);doc.roundedRect(x+2,y+2,size-4,size-4,.5,.5,'S');
  doc.setTextColor(30,65,128);doc.setFont('helvetica','bold');doc.setFontSize(9);
  doc.text('DEMO',x+size/2,y+10,{align:'center'});
  doc.setFontSize(7);doc.text('UNIVERSITY',x+size/2,y+16,{align:'center'});
  doc.text('OF TECH',x+size/2,y+21,{align:'center'});
  doc.setFont('helvetica','normal');doc.setFontSize(5.8);
  doc.text('SAMPLE RECORD',x+size/2,y+27,{align:'center'});
  doc.text('NOT OFFICIAL',x+size/2,y+31,{align:'center'});
 };
 const pageHeader=(continued=false)=>{
  doc.setFillColor(18,35,70);doc.rect(0,0,pageW,27,'F');
  doc.setFillColor(61,130,232);doc.rect(0,27,pageW,1.5,'F');
  doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(17);
  doc.text('Inclusive UniTime',left,16);
  doc.setFont('helvetica','normal');doc.setFontSize(8);
  doc.text('UNIVERSITY TIMETABLING  /  DEMONSTRATION',left,22);
  if(!continued){
   doc.setTextColor(20,38,75);doc.setFont('helvetica','bold');doc.setFontSize(17);
   doc.text(title,left,43);
   doc.setTextColor(87,103,126);doc.setFont('helvetica','normal');doc.setFontSize(9);
   doc.text('University of Tech  |  Fictional demonstration institution',left,51);
   doc.setDrawColor(223,231,242);doc.line(left,57,150,57);
   doc.setFontSize(8.5);doc.setTextColor(45,59,81);
   doc.text('PREPARED FOR',left,65);
   doc.setFont('helvetica','bold');doc.setFontSize(11);
   doc.text(doc.splitTextToSize(String(user.name),130),left,71);
   doc.setFont('helvetica','normal');doc.setFontSize(8.5);
   doc.text('ID: '+user.id+'   |   Role: '+(user.role==='staff'?'Staff':'Student'),left,80);
   doc.text('Generated: '+generated,left,87);
   if(exam){
    const stream=user.role==='staff'?'All streams':(STREAM_OF[user.id]||'Not assigned');
    doc.text(doc.splitTextToSize('Academic stream: '+stream,135),left,94);
   }
   stamp();
  }else{
   doc.setFont('helvetica','bold');doc.setTextColor(20,38,75);doc.setFontSize(12);
   doc.text(title+'  /  CONTINUED',left,39);
  }
 };
 const columns=exam?[{name:'MODULE / STREAM',w:74},{name:'DATE',w:31},{name:'TIME',w:35},{name:'VENUE',w:38}]
                   :[{name:'MODULE',w:74},{name:'DAY',w:31},{name:'TIME',w:35},{name:'VENUE',w:38}];
 const tableHeader=y=>{
  doc.setFillColor(231,239,252);doc.roundedRect(left,y-6,178,10,1,1,'F');
  let x=left;columns.forEach(c=>{doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(34,65,117);doc.text(c.name,x+3,y);x+=c.w});
  return y+11;
 };
 pageHeader();let y=tableHeader(exam?110:102);
 rows.forEach((row,i)=>{
  const wrapped=row.map((value,j)=>doc.splitTextToSize(String(value),columns[j].w-6));
  const height=Math.max(12,...wrapped.map(lines=>lines.length*4.4+5));
  if(y+height>273){doc.addPage();pageHeader(true);y=tableHeader(51)}
  if(i%2===0){doc.setFillColor(246,249,253);doc.roundedRect(left,y-5,178,height,1,1,'F')}
  let x=left;wrapped.forEach((lines,j)=>{
   doc.setTextColor(30,45,70);doc.setFont('helvetica',j===0?'bold':'normal');doc.setFontSize(8);
   doc.text(lines,x+3,y);x+=columns[j].w;
  });y+=height;
 });
 if(!rows.length){doc.setTextColor(87,103,126);doc.setFontSize(10);doc.text('No timetable entries available.',left,y+4)}
 for(let p=1;p<=doc.getNumberOfPages();p++){
  doc.setPage(p);doc.setDrawColor(223,231,242);doc.line(left,281,right,281);
  doc.setTextColor(102,116,137);doc.setFont('helvetica','normal');doc.setFontSize(7.5);
  doc.text('DEMO ONLY  |  Not an official university document',left,287);
  doc.text('Page '+p+' of '+doc.getNumberOfPages(),right,287,{align:'right'});
 }
 doc.save((exam?'exam':'class')+'-timetable-demo.pdf');
}
function ExamEmail({user,exams}){
 const [email,setEmail]=useState(''),[msg,setMsg]=useState(''),[listening,setListening]=useState(false);
 const speak=()=>{const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Speech){setMsg('Speech recognition is not available. Please type the address.');return}const r=new Speech();r.lang='en-ZA';r.onresult=e=>{setEmail(e.results[0][0].transcript.toLowerCase().trim().replace(/\s+at\s+/g,'@').replace(/\s+dot\s+/g,'.').replace(/\s+/g,''));setMsg('Please verify the recognised address before continuing.')};r.onerror=()=>{setListening(false);setMsg('Speech recognition failed. Please type the address.')};r.onend=()=>setListening(false);try{r.start();setListening(true);setMsg('Listening for an email address…')}catch(e){setListening(false);setMsg('Speech recognition unavailable.')}};
 const send=()=>{const to=email.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)){setMsg('Please enter a valid recipient email address.');return}try{downloadTimetablePDF('Exam timetable',examRows(exams,user),user)}catch(e){setMsg('PDF unavailable. Please check your connection.');return}setMsg('PDF downloaded. Attach exam-timetable-demo.pdf manually in your email app and verify the recipient before sending.');const body='Hello,\n\nPlease see my DEMO exam timetable.\n\nIMPORTANT: Manually attach the downloaded exam-timetable-demo.pdf before sending. This is not an official university timetable.';window.location.href='mailto:'+encodeURIComponent(to)+'?subject='+encodeURIComponent('Inclusive UniTime - DEMO exam timetable')+'&body='+encodeURIComponent(body)};
 return html`<section class="card"><h2>Share exam timetable by email</h2><p class="sub">Type or speak the email address. Speech is optional and may not work in every browser. The PDF cannot be attached automatically; attach it manually before sending.</p><div class="filters"><label>Recipient email<input type="email" value=${email} onInput=${e=>setEmail(e.target.value)} placeholder="name@example.com"/></label><button type="button" class="btn alt" disabled=${listening} onClick=${speak}>${listening?'Listening…':'Speak email address'}</button><button type="button" class="btn" onClick=${send}>Download PDF and open email app</button></div><p class="msg" role="status" aria-live="polite">${msg}</p></section>`
}
function ExamTimetable({user,exams,onSave,onDelete}){
 const staff=user.role==='staff',blank={id:'',stream:STREAMS[0],module:EXAM_MODULES[STREAMS[0]][0],date:'2026-12-01',start:'09:00',end:'12:00',venue:'Hall A'};
 const [form,setForm]=useState(blank),[filter,setFilter]=useState(''),[msg,setMsg]=useState(''),[err,setErr]=useState(''),first=useRef();
 const list=[...exams].filter(e=>!staff||!filter||e.stream===filter).sort((a,b)=>a.date.localeCompare(b.date)||a.start.localeCompare(b.start));
 const save=async e=>{e.preventDefault();setErr('');setMsg('');try{await onSave(form);setForm(blank);setMsg('Exam saved and relevant stream notifications created.')}catch(x){setErr(x.message||'Unable to save exam')}};
 const remove=async e=>{if(!confirm('Delete '+e.module+' on '+e.date+'?'))return;try{await onDelete(e.id);setMsg('Exam deleted and relevant students notified.');setErr('');if(form.id===e.id)setForm(blank)}catch(x){setErr(x.message)}};
 const download=()=>{try{downloadTimetablePDF('Exam timetable',examRows(list,user),user);setMsg('Exam timetable PDF downloaded.')}catch(e){setErr('PDF unavailable. Please check your connection.')}};
 return html`<div class="view"><div class="rh"><div><h1>${staff?'Manage exam timetables':'My exam timetable'}</h1><p class="sub">DEMO examination schedule. ${staff?'Manage both PGDip ICT streams.':'Your registered stream: '+STREAM_OF[user.id]}</p></div><button type="button" class="btn" onClick=${download}>Download exam timetable (PDF)</button></div>
 ${staff&&html`<div class="card"><label>Filter stream<select value=${filter} onChange=${e=>setFilter(e.target.value)}><option value="">All streams</option>${STREAMS.map(s=>html`<option key=${s} value=${s}>${s}</option>`)}</select></label></div>`}
 <section class="card"><h2>Examination schedule</h2><p class="msg" role="status">${list.length} exam${list.length===1?'':'s'} shown</p><div class="exam-scroll"><table class="exam-table"><thead><tr><th scope="col">Module</th>${staff&&html`<th scope="col">Stream</th>`}<th scope="col">Date</th><th scope="col">Time</th><th scope="col">Venue</th>${staff&&html`<th scope="col">Actions</th>`}</tr></thead><tbody>${list.map(e=>html`<tr key=${e.id}><th scope="row">${e.module}</th>${staff&&html`<td data-label="Stream">${e.stream}</td>`}<td data-label="Date">${new Date(e.date+'T12:00:00').toLocaleDateString('en-ZA',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</td><td data-label="Time">${e.start}–${e.end}</td><td data-label="Venue">${e.venue}</td>${staff&&html`<td data-label="Actions"><div class="exam-actions"><button type="button" class="mini" onClick=${()=>{setForm({...e});first.current?.focus();setErr('')}}>Edit</button><button type="button" class="mini" onClick=${()=>remove(e)}>Delete</button></div></td>`}</tr>`)}</tbody></table></div>${!list.length&&html`<p>No exams scheduled.</p>`}</section>
 ${staff?html`<form class="card" onSubmit=${save}><h2>${form.id?'Edit exam':'Add exam'}</h2><div class="filters"><label>Stream<select ref=${first} value=${form.stream} onChange=${e=>setForm({...form,stream:e.target.value,module:EXAM_MODULES[e.target.value][0]})}>${STREAMS.map(s=>html`<option key=${s} value=${s}>${s}</option>`)}</select></label><label>Module<select value=${form.module} onChange=${e=>setForm({...form,module:e.target.value})}>${EXAM_MODULES[form.stream].map(m=>html`<option key=${m} value=${m}>${m}</option>`)}</select></label><label>Exam date<input required type="date" value=${form.date} onChange=${e=>setForm(prev=>({...prev,date:e.target.value}))}/></label><label>Start<input required type="time" value=${form.start} onInput=${e=>setForm({...form,start:e.target.value})}/></label><label>End<input required type="time" value=${form.end} onInput=${e=>setForm({...form,end:e.target.value})}/></label><label>Venue<input required maxLength="80" value=${form.venue} onInput=${e=>setForm({...form,venue:e.target.value})}/></label></div><div class="exam-actions"><button type="submit" class="btn">${form.id?'Save changes':'Add exam'}</button><button type="button" class="btn alt" onClick=${()=>{setForm(blank);setErr('')}}>Clear form</button></div><p class="err" role="alert">${err}</p><p class="status" role="status" aria-live="polite">${msg}</p></form>`:html`<${ExamEmail} user=${user} exams=${list}/>`}
 ${staff&&html`<p role="status" aria-live="polite">${msg}</p>`}</div>`
}
