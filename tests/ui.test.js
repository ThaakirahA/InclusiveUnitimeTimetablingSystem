// System-level tests: the real index.html + js/*.js run in jsdom (a DOM simulation, NOT a real browser).
const {JSDOM}=require("jsdom"),fs=require("fs"),path=require("path"),test=require("node:test"),assert=require("node:assert/strict"),axe=require("axe-core");
const root=path.join(__dirname,"..");
const VENDOR={"react-dom":"react-dom/umd/react-dom.production.min.js",react:"react/umd/react.production.min.js",htm:"htm/dist/htm.umd.js"};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn,ms=3000){const t=Date.now();let e;while(Date.now()-t<ms){try{const v=fn();if(v)return v}catch(x){e=x}await sleep(25)}throw new Error("timed out: "+fn+(e?" / "+e.message:""))}
async function boot(){
 let h=fs.readFileSync(path.join(root,"index.html"),"utf8");
 h=h.replace(/<script src="([^"]+)"><\/script>/g,(m,src)=>{const k=/react-dom@/.test(src)?"react-dom":/react@/.test(src)?"react":/htm@/.test(src)?"htm":null;
  return "<script>"+fs.readFileSync(k?path.join(root,"node_modules",VENDOR[k]):path.join(root,src),"utf8")+"</script>"});
 const dom=new JSDOM(h,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",beforeParse(w){w.structuredClone=v=>JSON.parse(JSON.stringify(v))}});
 const w=dom.window,d=w.document,$=s=>d.querySelector(s),$$=s=>[...d.querySelectorAll(s)];
 const btn=t=>$$("button").find(b=>b.textContent.trim().startsWith(t));
 const field=t=>$$("label").find(l=>l.textContent.trim().startsWith(t)).querySelector("select,input,textarea");
 const set=(el,v)=>{const p=el.tagName==="SELECT"?w.HTMLSelectElement.prototype:el.tagName==="TEXTAREA"?w.HTMLTextAreaElement.prototype:w.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(p,"value").set.call(el,v);el.dispatchEvent(new w.Event(el.tagName==="SELECT"?"change":"input",{bubbles:true}))};
 const login=async(role,id,pw)=>{$(`input[name=role][value=${role}]`).click();set($("input[autocomplete=username]"),id);set($("input[type=password]"),pw);$("button[type=submit]").click()};
 const nav=async t=>{$$("nav button").find(b=>b.textContent.includes(t)).click();await sleep(60)};
 const audit=async()=>{w.eval(axe.source);return(await w.axe.run(w.document,{rules:{"color-contrast":{enabled:false}}})).violations.map(v=>v.id+" ("+v.impact+") x"+v.nodes.length)};
 await until(()=>d.querySelector("#root").children.length);
 const ready=()=>until(()=>$("header.top")&&$("main#main h1")&&$("nav .badge"));
 return{w,d,$,$$,btn,field,set,login,nav,audit,ready};
}
test("ST-01 [FR01,NFR-02] student sign-in shows personalised dashboard, one h1, focus on main",async()=>{
 const u=await boot();await u.login("student","S1001","student123");
 await u.ready();const h=u.$("main h1");assert.match(h.textContent,/Good (morning|afternoon|evening), Alex!/);
 assert.equal(u.$$("h1").length,1);await until(()=>u.d.activeElement.id==="main");
 assert.equal(u.$("nav .badge").textContent,"2");u.w.close();});
test("ST-02 [FR01] invalid password shows an associated error and stays signed out",async()=>{
 const u=await boot();await u.login("student","S1001","nope");
 const e=await until(()=>u.$("#lerr").textContent);assert.match(e,/isn’t right/);
 assert.equal(u.$("main h1")?.textContent,"Inclusive UniTime");assert.equal(u.d.activeElement,u.$("input[type=password]"));u.w.close();});
test("ST-03 [FR02] Monday filter lists only Monday classes",async()=>{
 const u=await boot();await u.login("student","S1001","student123");await u.ready();await u.nav("My timetable");
 u.set(u.field("Day"),"Mon");await until(()=>/2 classes shown/.test(u.$(".msg").textContent));
 assert.deepEqual(u.$$(".cards li").map(l=>l.textContent.slice(0,3)),["Mon","Mon"]);u.w.close();});
test("ST-04 [FR02] module+venue filters combine; no match shows accessible empty state",async()=>{
 const u=await boot();await u.login("student","S1001","student123");await u.ready();await u.nav("My timetable");
 u.set(u.field("Module"),"Mathematics");await sleep(60);u.set(u.field("Venue"),"Room 2.14");
 await until(()=>/No timetable entries found/.test(u.$(".msg").textContent));assert.ok(u.$(".empty"));
 u.set(u.field("Venue"),"Room 1.15");await until(()=>/1 class shown/.test(u.$(".msg").textContent));u.w.close();});
test("ST-05 [FR03] marking one notification read lowers the unread badge 2 -> 1",async()=>{
 const u=await boot();await u.login("student","S1001","student123");await u.ready();await nav(u,"Notifications");
 u.btn("Mark as read").click();await until(()=>u.$("nav .badge")?.textContent==="1");assert.match(u.$("main .sr").textContent,/Marked as read/);u.w.close();});
async function nav(u,t){await u.nav(t)}
test("ST-06 [FR04,FR03] staff edit succeeds, shows confirmation and a new alert",async()=>{
 const u=await boot();await u.login("staff","L2001","staff123");await u.ready();
 u.$$("button.mini").find(b=>b.getAttribute("aria-label")==="Edit Web Development").click();
 await until(()=>u.field("New venue").value==="Room 1.20");u.set(u.field("New venue"),"Room 9.99");await sleep(60);u.btn("Send update").click();
 await until(()=>/Update saved/.test(u.$(".status").textContent));await until(()=>u.$("nav .badge")?.textContent==="3");u.w.close();});
test("ST-07 [FR04] staff slot collision is blocked with an explanation and focus moves to the time slot",async()=>{
 const u=await boot();await u.login("staff","L2001","staff123");await u.ready();
 u.set(u.field("Module"),"c5");await until(()=>u.field("Day").value==="Wed");u.set(u.field("Day"),"Mon");await sleep(60);u.set(u.field("Time slot"),"08:00");await sleep(60);u.set(u.field("New venue"),"Lab 4");await sleep(60);
 u.btn("Send update").click();await until(()=>/already used by Software Engineering/.test(u.$("#serr").textContent));
 assert.equal(u.d.activeElement,u.field("Time slot"));u.w.close();});
test("ST-08 [FR05,NFR-03] text size and high contrast apply immediately and persist",async()=>{
 const u=await boot();await u.login("student","S1001","student123");await u.ready();await u.nav("Accessibility");
 u.btn("Large").click();await sleep(60);u.btn("High contrast").click();await sleep(60);
 assert.equal(u.d.documentElement.dataset.text,"lg");assert.equal(u.d.documentElement.dataset.contrast,"high");
 assert.match(u.w.localStorage.getItem("ut-set"),/"text":"lg"/);u.w.close();});
for(const [name,go] of [["login",async()=>{}],["dashboard",async()=>{}],["timetable",u=>u.nav("My timetable")],["notifications",u=>u.nav("Notifications")],["accessibility",u=>u.nav("Accessibility")],["help",u=>u.nav("Help")]])
 test(`ST-09 [NFR-02..04] axe-core rules (colour-contrast excluded) on ${name}`,async()=>{
  const u=await boot();if(name!=="login"){await u.login("student","S1001","student123");await u.ready();await go(u)}
  const v=await u.audit();console.log("   axe violations on "+name+": "+(v.length?v.join("; "):"none"));assert.equal(v.length,0,"axe violations: "+[...v].join("; "));u.w.close();});
