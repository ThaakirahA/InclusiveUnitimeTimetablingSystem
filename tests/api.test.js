const test=require("node:test"),assert=require("node:assert/strict"),{load}=require("./helpers");
const staff={id:"L2001",role:"staff"},S1={id:"S1001",role:"student"},S2={id:"S1002",role:"student"};
const upd=(o)=>({id:"c8",day:"Fri",start:"08:00",venue:"Room 9.99",msg:"",...o});
test("IT-01 [FR01] login accepts valid credentials; rejects bad password and wrong role; ID is case-insensitive",async()=>{const{api}=load();
 assert.equal((await api.login("student","S1001","student123")).name,"Thaakirah Agherdien");
 assert.equal(await api.login("student","S1001","wrong"),null);
 assert.equal(await api.login("staff","S1001","student123"),null);
 assert.equal((await api.login("student"," s1001 ","student123")).id,"S1001");});
test("IT-02 [FR04,FR03] staff update changes venue and notifies only enrolled students",async()=>{const{api}=load();
 const r=await api.updateClass(upd({id:"c5",day:"Wed",start:"08:00",venue:"Lab 7"}),staff);
 assert.equal(r.classes.find(c=>c.id==="c5").venue,"Lab 7");
 const n1=await api.getNotifications(S1),n2=await api.getNotifications(S2),st=await api.getNotifications(staff);
 assert.equal(n1[0].title,"Timetable update");assert.ok(n1[0].body.includes("Lab 7"));
 assert.ok(!n2.some(n=>n.body.includes("Lab 7")));assert.ok(st[0].body.includes("Lab 7"));});
test("IT-03 [FR04,SEC] students and anonymous callers cannot update the timetable",()=>{const{api,DB}=load();
 assert.throws(()=>api.updateClass(upd(),S1),/Unauthorised/);assert.throws(()=>api.updateClass(upd()),/Unauthorised/);
 assert.equal(DB.classes.find(c=>c.id==="c8").venue,"Room 1.20");});
test("IT-04 [FR04] server-side collision and empty-venue checks leave data unchanged",()=>{const{api,DB}=load();
 assert.throws(()=>api.updateClass(upd({id:"c5",day:"Mon",start:"08:00"}),staff),/collision/);
 assert.throws(()=>api.updateClass(upd({venue:"  "}),staff),/Venue required/);
 assert.equal(DB.classes.find(c=>c.id==="c5").day,"Wed");});
test("IT-05 [FR03] mark-as-read affects only the chosen / visible notifications",async()=>{const{api}=load();
 let l=await api.markRead("n1",S2);assert.equal(l.find(n=>n.id==="n1").read,true);assert.equal(l.length,2);
 l=await api.markRead("",S2);assert.ok(l.every(n=>n.read));
 const a=await api.getNotifications(S1);assert.equal(a.find(n=>n.id==="n2").read,false);});
test("IT-06 [FR04,NFR] edits persist across reload and demo data can be restored",async()=>{const store={};
 let m=load(store);await m.api.updateClass(upd({venue:"Room 5.55"}),staff);
 m=load(store);assert.equal(m.DB.classes.find(c=>c.id==="c8").venue,"Room 5.55");
 delete store["ut-demo-data"];m=load(store);assert.equal(m.DB.classes.find(c=>c.id==="c8").venue,"Room 1.20");});

test("IT-07 [FR03,FR04] a staff update stores a timestamp so its age can be shown",async()=>{
 const {api,DB}=load();const staff={id:"L2001",role:"staff",name:"Dr Hendricks"};
 await api.updateClass({id:"c8",day:"Fri",start:"08:00",venue:"Room 9.99"},staff);
 assert.equal(typeof DB.notifications[0].ts,"number");assert.match(DB.notifications[0].body,/Room 9\.99/);});

test("IT-08 [FR04,FR03] cancel and reinstate: staff only, students in the class are notified, others are not",async()=>{
 const {api,DB,seeN}=load();
 assert.throws(()=>api.cancelClass("c1",true,S1),/Unauthorised/);assert.equal(DB.classes.find(c=>c.id==="c1").cancelled,undefined);
 assert.throws(()=>api.cancelClass("zz",true,staff),/not found/);
 await api.cancelClass("c1",true,staff);assert.equal(DB.classes.find(c=>c.id==="c1").cancelled,true);
 const n=DB.notifications[0];assert.equal(n.title,"Class cancelled");assert.ok(seeN(n,S1));assert.ok(!seeN(n,S2)); /* S1002 is not enrolled in c1 */
 await api.cancelClass("c1",false,staff);assert.equal(DB.classes.find(c=>c.id==="c1").cancelled,false);assert.equal(DB.notifications[0].title,"Class reinstated");});
test("IT-09 [FR04] a class cannot be reinstated into a slot another class now uses",async()=>{
 const {api,DB}=load();await api.cancelClass("c5",true,staff);
 await api.updateClass({id:"c1",day:"Wed",start:"08:00",venue:"Room 2.14"},staff); /* allowed: Research Methods is cancelled */
 assert.throws(()=>api.cancelClass("c5",false,staff),/collision/i);assert.equal(DB.classes.find(c=>c.id==="c5").cancelled,true);});
test("IT-10 [FR04,FR03] announcements: staff only, validated, and visible to every student",async()=>{
 const {api,DB,seeN}=load();
 assert.throws(()=>api.announce({title:"Hi",body:"x"},S1),/Unauthorised/);
 assert.throws(()=>api.announce({title:"  ",body:"x"},staff),/required/);
 assert.throws(()=>api.announce({title:"T",body:"x".repeat(301)},staff),/too long/);
 await api.announce({title:" Lab closed ",body:"The lab is closed on Friday."},staff);
 const n=DB.notifications[0];assert.equal(n.title,"Lab closed");assert.ok(seeN(n,S1)&&seeN(n,S2));assert.equal(n.kind,"gen");});
