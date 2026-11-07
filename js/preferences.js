/* ACCESSIBILITY & PERSONALISATION MODULE - preference defaults and persistence (Design 3.2.1) */
const DEF={text:"",contrast:"",motion:false,theme:"system",kbd:false,sr:false};
const loadSet=()=>{try{return{...DEF,...JSON.parse(localStorage.getItem("ut-set"))}}catch(e){return DEF}};
