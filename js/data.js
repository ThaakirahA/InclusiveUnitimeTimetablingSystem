/* DATA LAYER - mock JSON data store, enrolments, persistence (Design 3.1.1; Figs 4-5) */
const DAYS=["Mon","Tue","Wed","Thu","Fri"],SLOTS=["08:00","10:00","12:00","14:00","16:00"];
/* ---- Mock JSON + API layer (swap these functions for fetch()/Supabase calls later) ---- */
const DB={classes:[
 {id:"c1",module:"Software Engineering",day:"Mon",start:"08:00",end:"10:00",venue:"Room 2.14"},
 {id:"c2",module:"Mathematics",day:"Mon",start:"12:00",end:"14:00",venue:"Room 1.15"},
 {id:"c3",module:"Database Systems",day:"Tue",start:"10:00",end:"12:00",venue:"Room 3.10"},
 {id:"c4",module:"Systems Analysis",day:"Tue",start:"14:00",end:"16:00",venue:"Room 3.12"},
 {id:"c5",module:"Research Methods",day:"Wed",start:"08:00",end:"10:00",venue:"Lab 4"},
 {id:"c6",module:"Project Work",day:"Wed",start:"12:00",end:"14:00",venue:"Room 2.14"},
 {id:"c7",module:"Human-Computer Interaction",day:"Thu",start:"10:00",end:"12:00",venue:"Room 2.05"},
 {id:"c8",module:"Web Development",day:"Fri",start:"08:00",end:"10:00",venue:"Room 1.20"}],
 users:[
 {id:"S1001",role:"student",name:"Alex Mokoena",pw:"student123"},
 {id:"S1002",role:"student",name:"Thandi Naidoo",pw:"student456"},
 {id:"L2001",role:"staff",name:"Dr Khan",pw:"staff123"}],
 notifications:[
 {id:"n1",title:"Venue change",body:"Web Development is now in Room 1.20.",time:"2 hours ago",read:false},
 {id:"n2",title:"Timetable update",body:"New session added for Research Methods.",time:"1 day ago",read:false},
 {id:"n3",title:"General notice",body:"Library maintenance on 23 August.",time:"2 days ago",read:true}]};
const ENROL={S1001:["c1","c2","c3","c5","c7","c8"],S1002:["c2","c3","c4","c6","c7","c8"]},NMAP={n1:"c8",n2:"c5"};
// Prototype-only persistence; no university database is connected.
try{const stored=JSON.parse(localStorage.getItem('ut-demo-data'));if(stored&&Array.isArray(stored.classes)&&Array.isArray(stored.notifications)){DB.classes=stored.classes;DB.notifications=stored.notifications}}catch(e){}
