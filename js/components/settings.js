/* PRESENTATION LAYER - Accessibility Settings and Help pages (Design 3.2.3) */
function Settings({set,setSet}){
 const u=k=>v=>setSet({...set,[k]:v});
 return html`<div class="view"><div class="rh"><div><h1>Accessibility settings</h1><p class="sub">Customise the experience to suit your needs. Changes apply straight away.</p></div><button class="btn alt" type="button" onClick=${()=>setSet(DEF)}>Reset to default</button></div><div class="card">
  <${Seg} label="Text size" val=${set.text} on=${u("text")} opts=${TXT}/>
  <${Seg} label="Colour contrast" val=${set.contrast} on=${u("contrast")} opts=${CON}/>
  <${Seg} label="Theme" val=${set.theme} on=${u("theme")} opts=${[["system","System"],["light","Light"],["dark","Dark"]]}/>
  <${Tog} id="l-motion" label="Reduced motion" on=${set.motion} set=${u("motion")}/>
  <${Tog} id="l-kbd" label="Keyboard navigation (stronger focus indicators)" on=${set.kbd} set=${u("kbd")}/>
  <${Tog} id="l-sr" label="Screen reader support (announce page changes)" on=${set.sr} set=${u("sr")}/>
  <div class="row"><span>Sample timetable data</span><button class="btn alt" type="button" onClick=${()=>{localStorage.removeItem("ut-demo-data");location.reload()}}>Restore demo data</button></div>
  <p class="info" role="note"><${Ic} n="hp"/>Your accessibility preferences are saved automatically on this device.</p></div></div>`}

function Help(){
 const F=[["Keyboard navigation","Press Tab and Shift + Tab to move between controls, and Enter or Space to activate them. A Skip to main content link appears when you first press Tab."],["Text size and contrast","Open Accessibility to choose larger text, high contrast or the dark theme. Your choices are remembered on this device."],["Filtering your timetable","Use the Day, Module, Venue and Time filters, or the search box at the top. Clear filters shows every class again."],["Notifications","Mark one alert or all alerts as read. Timetable updates made by staff create new alerts."],["Screen readers","Turn on Screen reader support in Accessibility to hear a short announcement whenever the page changes."]];
 return html`<div class="view"><h1>Help & Support</h1><p class="sub">Guidance on using the accessibility features and moving around the prototype.</p><div class="card">${F.map(([q,a])=>html`<details key=${q}><summary>${q}</summary><p>${a}</p></details>`)}</div></div>`}
