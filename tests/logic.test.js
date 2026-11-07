const test=require("node:test"),assert=require("node:assert/strict"),{load}=require("./helpers");
const ids=l=>l.map(c=>c.id).join(",");
test("UT-01 [FR02] day filter returns only Monday entries",()=>{const{DB,filterClasses}=load();const r=filterClasses(DB.classes,{day:"Mon"});assert.equal(ids(r),"c1,c2");});
test("UT-02 [FR02] module AND venue filters must both match",()=>{const{DB,filterClasses}=load();
 assert.equal(filterClasses(DB.classes,{module:"Project Work",venue:"Room 2.14"}).length,1);
 assert.equal(filterClasses(DB.classes,{module:"Project Work",venue:"Lab 4"}).length,0);});
test("UT-03 [FR02] time filter splits morning and afternoon",()=>{const{DB,filterClasses}=load();
 assert.ok(filterClasses(DB.classes,{time:"am"}).every(c=>c.start<"12:00"));
 assert.ok(filterClasses(DB.classes,{time:"pm"}).every(c=>c.start>="12:00"));});
test("UT-04 [FR02] no filters returns all; impossible combination returns empty list",()=>{const{DB,filterClasses}=load();
 assert.equal(filterClasses(DB.classes,{}).length,8);assert.equal(filterClasses(DB.classes,{day:"Fri",module:"Mathematics"}).length,0);});
test("UT-05 [FR02] search text is case-insensitive over module and venue",()=>{const{DB,filterClasses}=load();
 assert.equal(ids(filterClasses(DB.classes,{q:"WEB"})),"c8");assert.equal(ids(filterClasses(DB.classes,{q:"lab 4"})),"c5");});
test("UT-06 [FR04] slot end time is start + 2 hours",()=>{const{endOf}=load();assert.equal(endOf("08:00"),"10:00");assert.equal(endOf("16:00"),"18:00");});
test("UT-07 [FR04] collision detected for another class in same slot, not for itself",()=>{const{DB,findCollision}=load();
 assert.equal(findCollision(DB.classes,{id:"c5",day:"Mon",start:"08:00"}).id,"c1");
 assert.equal(findCollision(DB.classes,{id:"c1",day:"Mon",start:"08:00"}),undefined);});
test("UT-08 [FR01] timetable is personalised per student; staff see everything",()=>{const{DB,seeC}=load();
 const a={id:"S1001",role:"student"},b={id:"S1002",role:"student"},s={id:"L2001",role:"staff"};
 assert.ok(seeC(DB.classes[0],a)&&!seeC(DB.classes[3],a));
 assert.ok(!seeC(DB.classes[0],b)&&seeC(DB.classes[3],b));
 assert.equal(DB.classes.filter(c=>seeC(c,s)).length,8);});
test("UT-09 [FR03] notifications are routed to enrolled students only",()=>{const{DB,seeN}=load();
 const a={id:"S1001",role:"student"},b={id:"S1002",role:"student"},[n1,n2,n3]=DB.notifications;
 assert.ok(seeN(n1,a)&&seeN(n1,b));assert.ok(seeN(n2,a)&&!seeN(n2,b));assert.ok(seeN(n3,a)&&seeN(n3,b));});
test("UT-10 [FR01] next-class countdown, including wrap to next week",()=>{const{DB,mins,until}=load();
 assert.equal(mins(DB.classes[0],new Date(2026,10,9,7,0)),60);           // Mon 07:00 -> Mon 08:00 class
 assert.equal(mins(DB.classes[0],new Date(2026,10,9,9,0)),10080-60);     // Mon 09:00 -> next Monday
 assert.equal(until(60),"Starts in 1h 0m");assert.equal(until(30),"Starts in 30m");});
