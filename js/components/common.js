/* PRESENTATION LAYER - shared UI building blocks (icons, selects, toggles, tiles) */
const {useState,useEffect,useRef}=React,html=htm.bind(React.createElement);
const P={home:"M3 11l9-8 9 8v10h-6v-6H9v6H3z",ex:"M8 2v4M16 2v4M3 10h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z",tt:"M7 2v3M17 2v3M3 9h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",nt:"M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0",ax:"M12 3.5a.5.5 0 100 .01M5 8l7 1 7-1M12 9v5m0 0l-3 6m3-6l3 6",search:"M21 21l-4.3-4.3M11 18a7 7 0 100-14 7 7 0 000 14z",hp:"M12 22a10 10 0 100-20 10 10 0 000 20zM9.1 9a3 3 0 015.8 1c0 2-3 2.5-3 4.5M12 17.5v.01",out:"M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",lg:"M12 3L2 8l10 5 10-5-10-5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"};
const Ic=({n})=>html`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d=${P[n]}/></svg>`;

const Tiles=({items})=>html`<div class="grid">${items.map(([k,t,d,fn],i)=>html`<button class="tile" type="button" key=${t} onClick=${fn}><span class=${"ti t"+i}><${Ic} n=${k}/></span><strong>${t}</strong>${d}</button>`)}</div>`;
const Upcoming=({classes,n,title,go})=>{const now=new Date(),L=classes.filter(c=>!c.cancelled).map(c=>({c,m:mins(c,now)})).sort((a,b)=>a.m-b.m).slice(0,n);
 return html`<section class="card" aria-labelledby="up-t"><div class="rh"><h2 id="up-t">${title}</h2>${go&&html`<button class="link" type="button" onClick=${go}>View all</button>`}</div>
  ${L.length?html`<ul class="ul">${L.map(({c,m})=>html`<li key=${c.id}><span class="day" style=${{"--h":hue(c.module)}}>${c.day}</span><div><b>${c.module}</b><small>${c.start}–${c.end} · ${c.venue}</small></div><span class="tag">${until(m)}</span></li>`)}</ul>`:html`<p class="msg">No classes scheduled.</p>`}</section>`};

const Sel=({l,v,set,opts,all})=>html`<label>${l}<select value=${v} onChange=${e=>set(e.target.value)}><option value="">${all}</option>${opts.map(o=>Array.isArray(o)?html`<option key=${o[0]} value=${o[0]}>${o[1]}</option>`:html`<option key=${o}>${o}</option>`)}</select></label>`;

const Seg=({label,val,opts,on})=>{const id="l-"+label.replace(/\W/g,"");return html`<div class="row"><span id=${id}>${label}</span><div class="seg" role="group" aria-labelledby=${id}>${opts.map(([v,t])=>html`<button type="button" key=${v} aria-pressed=${val===v} onClick=${()=>on(v)}>${t}</button>`)}</div></div>`};
const Tog=({id,label,on,set})=>html`<div class="row"><span id=${id}>${label}</span><button type="button" class="switch" role="switch" aria-checked=${on} aria-labelledby=${id} onClick=${()=>set(!on)}></button></div>`;
const TXT=[["","Default"],["lg","Large"],["xl","Extra large"]],CON=[["","Default"],["high","High contrast"]];
