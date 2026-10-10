(() => {
  'use strict';
  const P = window.Portal;
  const source = P && P.partnerResultsData;
  if (!source) return;

  // A deterministic, fictional customer ledger for the reporting demo. Sales
  // reconcile with the existing monthly reporting cells; nothing is imported
  // from editable sales briefs, service registrations or a real source system.
  const cutoff = source.cutoff;
  const products = Object.freeze([...source.productCatalog.syd]);
  const salesCells = source.rows({partnerIds:['syd']});
  const sellers = Object.freeze([...new Set(salesCells.map(row => row.seller))]);
  const regions = Object.freeze([...new Set(salesCells.map(row => row.region))]);
  const DAY = 86400000;
  const date = value => new Date(`${value}T00:00:00Z`);
  const iso = value => value.toISOString().slice(0,10);
  const addDays = (value, count) => iso(new Date(date(value).getTime() + count * DAY));
  const daysBetween = (start, end) => Math.round((date(end)-date(start))/DAY);
  const inclusiveDays = (start, end) => end && end >= start ? daysBetween(start,end)+1 : 0;
  const monthEnd = month => iso(new Date(Date.UTC(Number(month.slice(0,4)),Number(month.slice(5,7)),0)));
  const monthLabel = month => new Intl.DateTimeFormat('sv-SE',{month:'long',year:'numeric',timeZone:'UTC'}).format(date(`${month}-01`));
  const hash = value => [...value].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);
  const statusLabels = Object.freeze({active:'Aktiv kund',pending:'Väntar på avtalsstart',ended:'Avslutad kund',cancelled:'Bortfall före start'});
  const activeEntries = [15,16,17,18,20,22,22,24,28,4];
  const preStartCancelled = [0,1,0,1,1,1,0,1,1,0];
  const openingExits = [1,1,2,1,1,2,1,2,2,0];
  const raw = [];
  let sequence = 0;

  source.months.forEach((month, monthIndex) => {
    const sold = salesCells.filter(row => row.month===month).flatMap(cell => {
      const floor = cell.agreements ? Math.floor(cell.annualMWh/cell.agreements) : 0;
      const remainder = cell.annualMWh-floor*cell.agreements;
      return Array.from({length:cell.agreements},(_,index) => ({
        product:cell.product,seller:cell.seller,region:cell.region,
        annualMWh:floor+(index<remainder ? 1 : 0),
        order:hash(`${month}:${cell.product}:${cell.seller}:${cell.region}:${index}`)
      }));
    }).sort((a,b) => a.order-b.order || a.product.localeCompare(b.product));
    const observedEnd = monthEnd(month)>cutoff ? cutoff : monthEnd(month);
    const observedDays = inclusiveDays(`${month}-01`,observedEnd);
    sold.forEach((part,index) => {
      sequence++;
      const id = `SV-2026-${String(sequence).padStart(4,'0')}`;
      const soldDate = `${month}-${String(1+Math.floor((index+0.5)*observedDays/sold.length)).padStart(2,'0')}`;
      const activated = index<activeEntries[monthIndex];
      const cancelled = !activated && index<activeEntries[monthIndex]+preStartCancelled[monthIndex];
      const nextDay = addDays(soldDate,1)>observedEnd ? observedEnd : addDays(soldDate,1);
      raw.push({
        id,customerId:`K-${id}`,customer:`Exempelbolag ${String(sequence).padStart(3,'0')} AB`,
        name:`Exempelbolag ${String(sequence).padStart(3,'0')} AB`,email:`kund${sequence}@savera.example`,
        partner:'syd',utility:'Elhandel',product:part.product,seller:part.seller,region:part.region,
        annualMWh:part.annualMWh,soldDate,
        startDate:activated ? nextDay : cancelled ? null : `2026-11-${String(1+sequence%25).padStart(2,'0')}`,
        endDate:null,cancelledDate:cancelled ? nextDay : null,
        opening:false,fictional:true,source:'Fiktivt kundunderlag · Savera'
      });
    });
  });

  // Independently stated opening stock, activations and exits mirror the
  // existing anonymous aggregate totals. Their per-dimension stock split is
  // a new customer-level example and is not claimed to be a real cohort.
  for (let index=0; index<134; index++) {
    const startYear = 2019+index%7;
    const startMonth = String(1+index%12).padStart(2,'0');
    const startDate = `${startYear}-${startMonth}-${String(1+index%25).padStart(2,'0')}`;
    const id = `SV-OPEN-${String(index+1).padStart(4,'0')}`;
    raw.push({
      id,customerId:`K-${id}`,customer:`Exempelbolag Bas ${String(index+1).padStart(3,'0')} AB`,
      name:`Exempelbolag Bas ${String(index+1).padStart(3,'0')} AB`,email:`bas${index+1}@savera.example`,
      partner:'syd',utility:'Elhandel',product:products[index%products.length],
      seller:sellers[index%sellers.length],region:regions[Math.floor(index/3)%regions.length],
      annualMWh:20+index%61,soldDate:addDays(startDate,-7),startDate,endDate:null,cancelledDate:null,
      opening:true,fictional:true,source:'Fiktiv ingående kundstock · Savera'
    });
  }
  const openingRows = raw.filter(row=>row.opening);
  let exitIndex=0;
  source.months.forEach((month,index) => {
    for(let count=0;count<openingExits[index];count++) {
      openingRows[exitIndex++].endDate = `${month}-${String(10+count*5).padStart(2,'0')}`;
    }
  });
  // Two known exits among 2026's new active customers; not an estimate of
  // the future tenure of any still-active or not-yet-started customer.
  [['2026-01','2026-06-18'],['2026-03','2026-09-21']].forEach(([month,endDate]) => {
    const row=raw.find(item=>!item.opening && item.soldDate.startsWith(month) && item.startDate && item.startDate<=monthEnd(month));
    if(row) row.endDate=endDate;
  });

  function statusAt(row, asOf) {
    if(!asOf || row.soldDate>asOf) return null;
    if(row.cancelledDate && row.cancelledDate<=asOf) return 'cancelled';
    if(!row.startDate || row.startDate>asOf) return 'pending';
    if(row.endDate && row.endDate<=asOf) return 'ended';
    return 'active';
  }
  const ledger = Object.freeze(raw.map(row => {
    const status=statusAt(row,cutoff);
    return Object.freeze({...row,status,statusLabel:statusLabels[status]});
  }));
  const all = value => value==null || value==='' || value==='all';

  function isoWeekStart(value) {
    const match=/^(\d{4})-W(\d{2})$/.exec(String(value));
    if(!match) return null;
    const year=Number(match[1]), week=Number(match[2]);
    if(week<1||week>53) return null;
    const jan4=new Date(Date.UTC(year,0,4));
    jan4.setUTCDate(jan4.getUTCDate()-((jan4.getUTCDay()+6)%7)+(week-1)*7);
    const thursday=new Date(jan4);thursday.setUTCDate(thursday.getUTCDate()+3);
    if(thursday.getUTCFullYear()!==year) return null;
    return iso(jan4);
  }
  function isoWeek(value) {
    const d=date(value);
    d.setUTCDate(d.getUTCDate()+3-((d.getUTCDay()+6)%7));
    const year=d.getUTCFullYear();
    const jan4=new Date(Date.UTC(year,0,4));
    jan4.setUTCDate(jan4.getUTCDate()+3-((jan4.getUTCDay()+6)%7));
    const week=1+Math.round((d-jan4)/(7*DAY));
    return `${year}-W${String(week).padStart(2,'0')}`;
  }
  function normalizeFilters(filters={}) {
    filters=filters && typeof filters==='object' ? filters : {};
    const mode=['year','month','week'].includes(filters.mode) ? filters.mode : 'year';
    const defaultValue=mode==='year' ? '2026' : mode==='month' ? cutoff.slice(0,7) : isoWeek(cutoff);
    return {mode,value:filters.value==null || filters.value==='' ? defaultValue : String(filters.value),
      product:filters.product||'all',seller:filters.seller||'all',region:filters.region||'all',
      query:String(filters.query||'').trim(),status:filters.status||'all'};
  }
  function period(filters={}) {
    const {mode,value}=normalizeFilters(filters);
    let start=null,end=null,label='Ogiltig period';
    if(mode==='year' && /^\d{4}$/.test(value) && value==='2026') {
      start=`${value}-01-01`;end=`${value}-12-31`;label=`${value}`;
    } else if(mode==='month' && /^2026-(0[1-9]|1[0-2])$/.test(value)) {
      start=`${value}-01`;end=monthEnd(value);label=monthLabel(value);
    } else if(mode==='week' && /^2026-W\d{2}$/.test(value)) {
      start=isoWeekStart(value);
      if(start) {end=addDays(start,6);label=`Vecka ${Number(value.slice(6))} · ${value.slice(0,4)}`;}
    }
    const valid=Boolean(start&&end);
    const observedEnd=valid && start<=cutoff ? (end<cutoff ? end : cutoff) : null;
    const observedStart=valid && start<'2026-01-01' ? '2026-01-01' : start;
    const months=valid ? source.months.filter(month=>`${month}-01`<=end&&monthEnd(month)>=start) : [];
    return Object.freeze({mode,value,start,end,observedStart,observedEnd,label,valid,
      daysObserved:valid ? inclusiveDays(observedStart,observedEnd) : 0,
      daysTotal:valid ? inclusiveDays(start,end) : 0,months:Object.freeze(months),
      partial:Boolean(observedEnd&&(observedEnd<end||observedStart>start)),asOf:observedEnd});
  }
  function periods(mode='year') {
    if(mode==='month') return source.months.map(value=>Object.freeze({value,label:monthLabel(value)}));
    if(mode==='week') {
      const items=[];
      for(let start=isoWeekStart('2026-W01');start<=cutoff;start=addDays(start,7)) {
        const value=isoWeek(start),p=period({mode:'week',value});
        items.push(Object.freeze({value,label:p.label,start:p.start,end:p.end}));
      }
      return items;
    }
    return [Object.freeze({value:'2026',label:'2026'})];
  }
  function matches(row, filters) {
    const q=filters.query.toLocaleLowerCase('sv-SE');
    return (all(filters.product)||row.product===filters.product)
      && (all(filters.seller)||row.seller===filters.seller)
      && (all(filters.region)||row.region===filters.region)
      && (!q||[row.customer,row.customerId,row.id,row.product,row.seller,row.region].some(value=>value.toLocaleLowerCase('sv-SE').includes(q)));
  }
  function atDate(row, asOf) {
    const status=statusAt(row,asOf);
    return Object.freeze({...row,status,statusLabel:statusLabels[status]||'Ej såld vid periodslut',
      asOf,observedStartDate:row.startDate&&row.startDate<=asOf ? row.startDate : null,
      observedEndDate:row.endDate&&row.endDate<=asOf ? row.endDate : null});
  }
  function query(filters={},options={}) {
    const selected=normalizeFilters(filters),p=period(selected);
    if(!p.observedEnd) return [];
    const stock=options.stock===true||options.active===true;
    return ledger.filter(row=>matches(row,selected)
      && (stock ? statusAt(row,p.observedEnd)==='active' : row.soldDate>=p.observedStart&&row.soldDate<=p.observedEnd))
      .map(row=>atDate(row,p.observedEnd))
      .filter(row=>all(selected.status)||row.status===selected.status)
      .sort((a,b)=>b.soldDate.localeCompare(a.soldDate)||a.id.localeCompare(b.id));
  }
  function summary(filters={}) {
    const selected=normalizeFilters(filters),p=period(selected);
    const rows=query(selected),activeRows=query(selected,{stock:true});
    const statusCounts={active:0,pending:0,ended:0,cancelled:0};
    rows.forEach(row=>statusCounts[row.status]++);
    return {period:p,agreements:rows.length,newAgreements:rows.length,
      annualMWh:rows.reduce((sum,row)=>sum+row.annualMWh,0),activeCount:activeRows.length,
      activeRows,statusCounts,rows};
  }
  function duration(rows,asOf,completed=false) {
    const measured=rows.map(row=>({...row,tenureDays:Math.max(0,daysBetween(row.startDate,completed ? row.endDate : asOf))}));
    const averageDays=measured.length ? measured.reduce((sum,row)=>sum+row.tenureDays,0)/measured.length : null;
    return {count:measured.length,averageDays,averageMonths:averageDays==null ? null : averageDays/(365.25/12),rows:measured,
      minDays:measured.length ? Math.min(...measured.map(row=>row.tenureDays)) : null,
      maxDays:measured.length ? Math.max(...measured.map(row=>row.tenureDays)) : null};
  }
  function insights(filters={}) {
    const selected=normalizeFilters(filters),p=period(selected),sold=query(selected);
    const completedRows=p.observedEnd ? ledger.filter(row=>matches(row,selected)&&row.endDate&&row.endDate>=p.observedStart&&row.endDate<=p.observedEnd
      && (all(selected.status)||selected.status==='ended')).map(row=>atDate(row,p.observedEnd)) : [];
    const activeRows=query(selected,{stock:true});
    const popularity=products.map(product=>{
      const rows=sold.filter(row=>row.product===product);
      return {product,agreements:rows.length,annualMWh:rows.reduce((sum,row)=>sum+row.annualMWh,0),share:sold.length ? rows.length/sold.length : 0};
    }).filter(row=>all(selected.product)||row.product===selected.product).sort((a,b)=>b.agreements-a.agreements||a.product.localeCompare(b.product,'sv'));
    const trend=[];
    if(p.observedEnd) {
      if(selected.mode==='year') p.months.forEach(month=>{
        const rows=sold.filter(row=>row.soldDate.startsWith(month));
        trend.push({date:`${month}-01`,label:new Intl.DateTimeFormat('sv-SE',{month:'short',timeZone:'UTC'}).format(date(`${month}-01`)),agreements:rows.length,annualMWh:rows.reduce((sum,row)=>sum+row.annualMWh,0)});
      });
      else for(let day=p.observedStart;day<=p.observedEnd;day=addDays(day,1)) {
        const rows=sold.filter(row=>row.soldDate===day);
        trend.push({date:day,label:day.slice(8),agreements:rows.length,annualMWh:rows.reduce((sum,row)=>sum+row.annualMWh,0)});
      }
    }
    return {period:p,completed:duration(completedRows,p.observedEnd,true),active:duration(activeRows,p.observedEnd),products:popularity,trend,
      retentionNote:'Avslutad kundtid mäter kunder som lämnade under vald period, även kunder som kom tidigare. Aktiv kundtid är observerad tid för kunder aktiva vid periodslut. Den visar inte när de kommer att lämna.'};
  }
  function projection(filters={}) {
    const selected=normalizeFilters(filters),p=period(selected),basis=summary(selected);
    const horizon='2026-12-31';
    const remainingDays=daysBetween(cutoff,horizon);
    const ytd=summary({...selected,mode:'year',value:'2026'});
    const valid=p.valid&&p.daysObserved>0&&basis.agreements>0&&all(selected.status);
    const dailyAgreements=valid ? basis.agreements/p.daysObserved : null;
    const dailyAnnualMWh=valid ? basis.annualMWh/p.daysObserved : null;
    const additional=valid ? dailyAgreements*remainingDays : null;
    return {valid,basisAgreements:basis.agreements,basisAnnualMWh:basis.annualMWh,basisDays:p.daysObserved,
      basisStart:p.observedStart,basisEnd:p.observedEnd,basisLabel:p.label,
      remainingDays,totalDays:inclusiveDays('2026-01-01',horizon),yearToDateAgreements:ytd.agreements,yearToDateAnnualMWh:ytd.annualMWh,
      dailyAgreements,dailyAnnualMWh,forecastAdditionalAgreements:additional==null ? null : Math.round(additional),
      forecastAdditionalAnnualMWh:valid ? Math.round(dailyAnnualMWh*remainingDays) : null,
      forecastAgreements:valid ? Math.round(ytd.agreements+additional) : null,
      forecastAnnualMWh:valid ? Math.round(ytd.annualMWh+dailyAnnualMWh*remainingDays) : null,
      asOf:cutoff,horizon,
      reason:valid ? null : !all(selected.status) ? 'Välj alla avtalsstatusar för ett jämförbart försäljningstempo.' : !p.daysObserved ? 'Perioden har inget observerat underlag.' : 'Urvalet saknar sålda avtal för att beräkna ett tempo.',
      note:'Om samma försäljningstempo fortsätter efter 7 oktober: utfallet 1 januari–7 oktober plus vald periods avtal per observerad kalenderdag × 85 återstående dagar till 31 december. Ett villkorat scenario för sålda avtal, utan justering för framtida churn eller bortfall.'};
  }
  P.saveraData=Object.freeze({cutoff,products,sellers,regions,ledger,period,periods,normalizeFilters,query,summary,insights,projection,statusAt,statusLabels});
})();
