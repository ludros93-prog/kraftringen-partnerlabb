(() => {
  'use strict';
  const P = window.Portal, e = P.e;
  const choices = ['Kvartspris','Opti','Rörligt månadspris'];
  const valid = value => choices.includes(value);
  const get = (id=P.partner) => valid(P.state.propertyDefaults?.[id]) ? P.state.propertyDefaults[id] : 'Kvartspris';
  function set(value) {
    if(P.role!=='partner'||P.getPartner()?.type!=='property'||!valid(value))return false;
    const previous=P.state.propertyDefaults;
    P.state.propertyDefaults={...previous,[P.partner]:value};
    if(!P.save()){ if(previous===undefined)delete P.state.propertyDefaults;else P.state.propertyDefaults=previous;return false; }
    return true;
  }
  const field = (value,id='intake-product') => `<section class="card"><label class="field" for="${id}"><strong>Önskat elavtal</strong><select id="${id}">${!valid(value)?'<option value="">Inget tidigare val – välj vid behov</option>':''}${choices.map(x=>`<option ${x===value?'selected':''}>${e(x)}</option>`).join('')}</select></label><p>Förslag i underlaget, inte ett tecknat elavtal. Giltigt uppdrag/fullmakt och separat avtalsprocess krävs.</p></section>`;
  P.propertyDefaults={choices,valid,get,set,field};
  P.register('property-default',{render:()=>P.role==='partner'&&P.getPartner()?.type==='property'?`<div class="commercial-page"><h1>Avtalsval för nya inflyttningar</h1><p>Kvartspris är grundvalet. Välj vilket alternativ nya underlag ska föreslå. Befintliga ärenden och utkast behåller sina val.</p><form id="property-default-form">${field(get(),'property-default-choice')}<button class="btn btn-primary" type="submit">Spara grundval</button><p id="property-default-status" role="status"></p></form><button class="text-button" data-go="product-facts">Läs om avtalen →</button></div>`:'<p>Öppna fastighetsbolagets arbetsyta.</p>',bind:()=>{
    document.querySelector('#property-default-form')?.addEventListener('submit',event=>{
      event.preventDefault();const ok=set(document.querySelector('#property-default-choice').value);
      document.querySelector('#property-default-status').textContent=ok?'Grundval sparat för nya underlag.':'Kunde inte spara. Tidigare grundval behålls.';
    });
  }});
})();
