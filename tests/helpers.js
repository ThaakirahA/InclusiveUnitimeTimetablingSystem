const vm=require("vm"),fs=require("fs"),path=require("path");
// Loads the real data/logic/api source files into an isolated context with a stubbed localStorage.
exports.load=(store={})=>{
 const ls={getItem:k=>(k in store?store[k]:null),setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}};
 const ctx=vm.createContext({localStorage:ls,structuredClone:v=>JSON.parse(JSON.stringify(v)),setTimeout});
 const code=["js/data.js","js/logic.js","js/api.js"].map(f=>fs.readFileSync(path.join(__dirname,"..",f),"utf8")).join("\n")+"\n;({DB,api,endOf,filterClasses,mins,until,seeC,seeN,findCollision,buildICS,ago,when,roomStatus,venuesOf})";
 return vm.runInContext(code,ctx);
};
