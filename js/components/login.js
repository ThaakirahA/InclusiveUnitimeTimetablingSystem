/* PRESENTATION LAYER - Login Interface (Design 3.2.3) */
function Login({go}){
 const[role,setRole]=useState(""),[id,setId]=useState(""),[pw,setPw]=useState(""),[err,setErr]=useState(""),[busy,setBusy]=useState(false),rRef=useRef(),iRef=useRef(),pRef=useRef();
 const L={student:"Student",staff:"Lecturer / Admin"},IDL=role==="staff"?"Staff ID":"Student ID";
 const sub=async e=>{e.preventDefault();
  if(!role){setErr("Please choose Student or Lecturer / Admin to continue.");rRef.current&&rRef.current.focus();return}
  if(!id.trim()||!pw){setErr(`Please enter your ${IDL} and password.`);(id.trim()?pRef:iRef).current.focus();return}
  setBusy(true);const u=await api.login(role,id,pw);setBusy(false);
  if(!u){setErr(`That ${IDL} or password isn’t right for a ${L[role]} account. Please try again.`);pRef.current.focus();return}
  go(u)};
 return html`<main class="login" id="main"><form class="card" onSubmit=${sub} noValidate>
  <div class="logo" aria-hidden="true"><${Ic} n="lg"/></div>
  <h1>Inclusive UniTime</h1><p class="sub">Prototype demo sign-in using sample accounts only. Not connected to university authentication.</p>
  <fieldset><legend>I am a…</legend><div class="roles">${[["student","View and filter my timetable"],["staff","Edit classes and notify students"]].map(([v,d])=>html`
   <label class=${"role"+(role===v?" on":"")} key=${v}><input ref=${v==="student"?rRef:null} aria-describedby="lerr" type="radio" name="role" value=${v} checked=${role===v} onChange=${()=>{setRole(v);setErr("")}}/><b>${L[v]}</b><small>${d}</small></label>`)}</div></fieldset>
  <div class="filters" style=${{gridTemplateColumns:"1fr"}}>
   <label>${IDL}<input ref=${iRef} aria-describedby="lerr" aria-invalid=${err&&!id.trim()?"true":undefined} value=${id} onInput=${e=>setId(e.target.value)} autoComplete="username" placeholder=${role==="staff"?"e.g. L2001":"e.g. S1001"}/></label>
   <label>Password<input ref=${pRef} aria-describedby="lerr" aria-invalid=${err&&!pw?"true":undefined} type="password" value=${pw} onInput=${e=>setPw(e.target.value)} autoComplete="current-password"/></label></div>
  <p class="err" role="alert" id="lerr">${err}</p>
  <button class="btn big" type="submit" disabled=${busy}>${busy?"Signing in…":role?"Sign in as "+L[role]:"Sign in"}</button>
  <details style=${{marginTop:"1rem",color:"var(--muted)"}}><summary>Demo accounts</summary><p>Student: S1001 / student123<br/>Student: S1002 / student456<br/>Staff: L2001 / staff123</p></details>
  </form></main>`}
