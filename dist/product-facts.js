(() => {
  'use strict';
  const P=window.Portal,e=P.e,root='https://www.kraftringen.se/';
  const rows=[
    ['consumer','Opti','Kraftringen jämför utfallet för rörligt kvartspris och rörligt månadspris utifrån kundens faktiska förbrukning inför fakturan. Kunden får det billigare av dessa två alternativ. Det betyder inte lägst pris bland alla marknadens avtal.','privat/el/vara-elavtal/kraftringen-opti/','elavtalet'],
    ['consumer','Kvartspris','Priset följer spotpriset varje kvart. När elen används påverkar därför kostnaden. Att flytta förbrukning från dyrare till billigare kvartar kan sänka kostnaden; priset kan också stiga.','privat/el/vara-elavtal/rorligt-kvartspris/','elavtalet'],
    ['consumer','Rörligt månadspris','Priset per kWh ändras månadsvis. Produktinformationen anger ett löpande avtal utan bindningstid. Månadspriset är inte samma sak som att den egna användningen prissätts kvart för kvart.','privat/el/vara-elavtal/rorligt-manadspris/','elavtalet'],
    ['consumer','Fastpris','Elpriset per kWh är fast under bindningstiden. Den totala kostnaden påverkas fortfarande av hur mycket el kunden använder. Lägre spotpris vid en viss tid sänker inte det avtalade kWh-priset.','privat/el/vara-elavtal/fast-elpris/','prissakring'],
    ['consumer','Vintersäkrat','Kraftringens produktinformation kallar detta Vinteravtal: fast elpris november–mars, därefter övergång till rörligt månadspris. Aktuellt erbjudande och avtalstid behöver kontrolleras vid teckning.','privat/el/vara-elavtal/vinteravtal/','prissakring'],
    ['business','Rörligt pris','Företagets pris sätts månadsvis i efterskott. Det består av månadsmedelpris från Nord Pool samt rörliga kostnader, fast påslag, månadsavgift och moms. Priset kan röra sig både uppåt och nedåt.','foretag/el/vara-elavtal/rorligt-elpris/','elavtalet'],
    ['business','Kvartspris','Produkten ingår i det bekräftade företagsutbudet. En exakt företagsspecifik produktbeskrivning har inte verifierats här. Konsumentvillkor ska inte användas som företagsvillkor.','foretag/el/vara-elavtal/avtalsvillkor/','elavtalet','Företagsspecifikt produktblad saknas'],
    ['business','Poolportfölj Trygg','Gemensam inköpspool med successiv, rullande indexsäkring. Kraftringens produktsida beskriver 12 månaders rullande säkring och målgruppen 50–150 MWh per år. Trygg bygger på indexsäkringen; namnet innebär inget garanterat pris.','foretag/el/vara-elavtal/poolportfolj/','portfoljer'],
    ['business','Poolportfölj Offensiv','Samma gemensamma poolprincip som Trygg, med aktiva inköpsbeslut för delar av volymen utöver den rullande indexsäkringen. Möjligheten att utnyttja marknadslägen är inte en garanti om lägre kostnad.','foretag/el/vara-elavtal/poolportfolj/','portfoljer'],
    ['business','Individuell portfölj','Den officiella sidan beskriver portföljförvaltning med successiva prissäkringar. Kraftringen och kunden bestämmer volym per månad, inköpsstart och första leveransmånad tillsammans. Det specifika upplägget för Individuell portfölj behöver bekräftas i produktblad och avtal.','foretag/el/vara-elavtal/portfoljforvaltning/','portfoljer','Allmän portföljbeskrivning – specifika villkor saknas'],
    ['business','Kraftringen Stabil','Namnet är bekräftat i partnerutbudet. Exakt prisuppbyggnad, säkringsmodell och villkor har inte kunnat verifieras i tillgängliga källor. Inga egenskaper antas utifrån namnet.','foretag/el/vara-elavtal/','ditt-val','Verifierat produktblad saknas']
  ];
  let selected='consumer';
  function segments(){
    if(P.role==='internal')return ['business','consumer'];
    const p=P.getPartner();
    return p?.type==='property'?['consumer']:p?.salesAudiences||[p?.audience].filter(x=>['business','consumer'].includes(x));
  }
  function render(){
    const allowed=segments();if(!allowed.includes(selected))selected=allowed[0];
    const property=P.role==='partner'&&P.getPartner()?.type==='property';
    return `<div class="commercial-page product-facts"><header class="page-head"><div><span class="eyebrow">KUNSKAP / ELAVTAL</span><h1>Avtalsfakta</h1><p>Vad innebär avtalen? Läs förklaringen, se en film och gå vidare till källan.</p></div><button class="btn btn-secondary" data-go="${property?'property-default':'academy'}">${property?'Ert grundval':'Utbildning'}</button></header><div class="detail-actions" role="group" aria-label="Kundsegment">${allowed.map(x=>`<button class="btn ${x===selected?'btn-primary':'btn-secondary'}" data-fact-segment="${x}" aria-pressed="${x===selected}">${x==='business'?'Företag · B2B':'Konsument · B2C'}</button>`).join('')}</div><p class="muted">Källor kontrollerade 11 oktober 2026. Sammanfattningar, inte fullständiga avtalsvillkor. Pris, påslag, avgifter, avtalstid och uppsägning kontrolleras i aktuellt erbjudande och villkor.</p><div class="product-facts-grid">${rows.filter(r=>r[0]===selected&&(!property||P.propertyDefaults.choices.includes(r[1]))).map(([segment,name,body,url,film,gap])=>{
      const video=window.PartnerElakademin?.modules.find(m=>m.id===film);
      return `<article class="card"><span class="eyebrow">${segment==='business'?'FÖRETAG':'KONSUMENT'}</span><h2>${e(name)}</h2><p>${e(body)}</p>${gap?`<p class="product-facts-gap"><strong>Underlag behövs:</strong> ${e(gap)}.</p>`:''}<details><summary>Fakta, villkor & film</summary><p><a href="${root+url}" target="_blank" rel="noopener">Kraftringens källa ↗</a></p><p><a href="${root+(segment==='business'?'foretag':'privat')+'/el/vara-elavtal/avtalsvillkor/'}" target="_blank" rel="noopener">Aktuella avtalsvillkor ↗</a></p>${video?`<p><a href="${e(video.video.url)}" target="_blank" rel="noopener">Se film: ${e(video.title)} (${e(video.video.durationLabel)}) ↗</a></p><small>Befintlig Elakademin-film om principerna. Ingen komplett produktspecifik villkorsgenomgång. Källsidan och aktuellt avtal styr.</small>`:'<p>Videounderlag saknas.</p>'}</details></article>`;
    }).join('')}</div></div>`;
  }
  P.productFacts={rows,segments};
  P.register('product-facts',{render,bind:()=>document.querySelectorAll('[data-fact-segment]').forEach(button=>button.addEventListener('click',()=>{
    if(segments().includes(button.dataset.factSegment))selected=button.dataset.factSegment;
    P.render();document.querySelector('[data-fact-segment][aria-pressed="true"]')?.focus();
  }))});
})();
