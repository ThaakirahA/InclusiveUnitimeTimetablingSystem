/* PRESENTATION LAYER - application shell, navigation, preference application, bootstrap */
function App(){
 const[user,setUser]=useState(()=>{try{const saved=JSON.parse(sessionStorage.getItem("ut-user"));if(!saved)return null;const current=DB.users.find(u=>u.id===saved.id&&u.role===saved.role);return current?{id:current.id,role:current.role,name:current.name}:null}catch(e){return null}}),[view,setView]=useState("home"),[classes,setClasses]=useState([]),[exams,setExams]=useState([]),[notes,setNotes]=useState([]),[set,setSet]=useState(loadSet),[q,setQ]=useState(""),[ann,setAnn]=useState(""),main=useRef();
 const TITLES={home:"Dashboard",tt:"My timetable",ex:"Exam timetable",nt:"Notifications",ax:"Accessibility settings",hp:"Help and support"};
 useEffect(()=>{if(user){api.getClasses(user).then(setClasses);api.getExams(user).then(setExams);api.getNotifications(user).then(setNotes)}},[user]);
 useEffect(()=>{const d=document.documentElement.dataset;d.text=set.text;d.contrast=set.contrast;d.motion=set.motion?"reduce":"";d.kbd=set.kbd?"on":"";if(set.theme==="system")delete d.theme;else d.theme=set.theme;try{localStorage.setItem("ut-set",JSON.stringify(set))}catch(e){}},[set]);
 useEffect(()=>{main.current&&main.current.focus();if(set.sr&&user)setAnn(TITLES[view]+" page")},[view,user]);
 if(!user)return html`<${Login} go=${u=>{try{sessionStorage.setItem("ut-user",JSON.stringify(u))}catch(e){}setUser(u);setView("home")}}/>`;
 const staff=user.role==="staff",unread=notes.filter(n=>!n.read).length;
 const NAV=[["home",staff?"Staff dashboard":"Dashboard"],["tt",staff?"Timetable":"My timetable"],["ex","Exams"],["nt","Notifications"],["ax","Accessibility"],["hp","Help & Support"]];
 const ICON={home:"home",tt:"tt",ex:"ex",nt:"nt",ax:"ax",hp:"hp"};
 const onUpdate=async f=>{const r=await api.updateClass(f,user);setClasses(r.classes);setNotes(r.notes)};
 const onCancel=async(id,c)=>{const r=await api.cancelClass(id,c,user);setClasses(r.classes);setNotes(r.notes)},onAnnounce=async f=>{const r=await api.announce(f,user);setClasses(r.classes);setNotes(r.notes)};
 const onSaveExam=async f=>{const r=await api.saveExam(f,user);setExams(r.exams);setNotes(r.notes)},onDeleteExam=async id=>{const r=await api.deleteExam(id,user);setExams(r.exams);setNotes(r.notes)};
 const out=()=>{try{sessionStorage.removeItem("ut-user")}catch(e){}setUser(null)};
 return html`<a class="skip" href="#main" onClick=${e=>{e.preventDefault();main.current.focus()}}>Skip to main content</a>
  <div class="shell"><aside class="side"><div class="brand"><span class="logo" aria-hidden="true"><${Ic} n="lg"/></span><div>Inclusive UniTime<small>Plan • Access • Belong</small></div></div>
   <nav aria-label="Main"><ul>${NAV.map(([k,l])=>html`<li key=${k}><button type="button" aria-current=${view===k?"page":undefined} onClick=${()=>setView(k)}><${Ic} n=${ICON[k]}/><span>${l}</span>${k==="nt"&&unread>0&&html`<span class="badge" aria-label=${unread+" unread"}>${unread}</span>`}</button></li>`)}</ul></nav>
   <button class="out" type="button" onClick=${out} aria-label=${"Log out "+user.name}><${Ic} n="out"/>Log out</button></aside>
  <div class="col"><header class="top"><span class="logo mlogo" aria-hidden="true"><${Ic} n="lg"/></span>
   <label class="srch"><span class="sr">Search modules, venues or events</span><${Ic} n="search"/><input type="search" value=${q} placeholder="Search modules, venues or events…" onInput=${e=>{setQ(e.target.value);if(e.target.value&&view!=="tt")setView("tt")}}/></label>
   <button class="bell" type="button" onClick=${()=>setView("nt")} aria-label=${"Notifications, "+unread+" unread"}><${Ic} n="nt"/>${unread>0&&html`<span class="badge" aria-hidden="true">${unread}</span>`}</button>
   <div class="who"><span class="av" aria-hidden="true">${initials(user.name)}</span><span class="wn"><b>${user.name}</b><small>${user.id} · ${staff?"Lecturer / Admin":"Student"}</small></span></div>
   <button class="mini lo-top" type="button" onClick=${out} aria-label=${"Log out "+user.name}>Log out</button></header>
  <main id="main" tabIndex="-1" ref=${main}>
   ${view==="home"&&(staff?html`<${Staff} user=${user} classes=${classes} notes=${notes} onUpdate=${onUpdate} onCancel=${onCancel} onAnnounce=${onAnnounce} go=${setView}/>`:html`<${Home} user=${user} classes=${classes} notes=${notes} go=${setView}/>`)}
   ${view==="tt"&&html`<${Timetable} user=${user} classes=${classes} set=${set} setSet=${setSet} q=${q} setQ=${setQ} go=${setView}/>`}
   ${view==="ex"&&html`<${ExamTimetable} user=${user} exams=${exams} onSave=${onSaveExam} onDelete=${onDeleteExam}/>`}
   ${view==="nt"&&html`<${Notes} notes=${notes} setNotes=${setNotes} user=${user}/>`}
   ${view==="ax"&&html`<${Settings} set=${set} setSet=${setSet}/>`}
   ${view==="hp"&&html`<${Help}/>`}
  <div class="sr" role="status" aria-live="polite">${ann}</div></main></div></div>`}
ReactDOM.createRoot(document.getElementById("root")).render(html`<${App}/>`);
