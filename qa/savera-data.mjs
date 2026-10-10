import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const portal={};
const context=vm.createContext({window:{Portal:portal},Date,Intl});
for(const file of ['partner-results-data.js','savera-data.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,'dist',file),'utf8'),context,{filename:file});
}
const D=portal.saveraData;
const A=portal.partnerResultsData;
let checks=0;
function test(label,fn) {fn();checks++;console.log(`✓ ${label}`);}
const fixedMonths=[
  [17,620,148],[18,670,163],[19,725,178],[20,780,195],[22,860,214],
  [24,930,233],[24,970,254],[26,1050,276],[31,1320,301],[6,250,305]
];
const startOfMonth=month=>`${month}-01`;
const independentStatus=(row,asOf)=>row.cancelledDate&&row.cancelledDate<=asOf ? 'cancelled'
  : !row.startDate||row.startDate>asOf ? 'pending'
  : row.endDate&&row.endDate<=asOf ? 'ended' : 'active';
const independentStock=asOf=>D.ledger.filter(row=>row.soldDate<=asOf&&independentStatus(row,asOf)==='active');
const days=(a,b)=>(Date.parse(`${b}T00:00:00Z`)-Date.parse(`${a}T00:00:00Z`))/86400000;

test('Fictional immutable ledger; no editable business or service records are needed',()=>{
  assert.equal(D.ledger.length,341);
  assert.equal(new Set(D.ledger.map(row=>row.customerId)).size,341);
  assert.ok(Object.isFrozen(D.ledger)&&D.ledger.every(Object.isFrozen));
  assert.ok(D.ledger.every(row=>row.fictional&&row.email.endsWith('@savera.example')&&row.customer.includes('Exempelbolag')));
  assert.throws(()=>{D.ledger[0].annualMWh=999;},TypeError);
  assert.equal(portal.state,undefined);
});
test('Every customer timeline has a possible chronology and a single explicit product',()=>{
  for(const row of D.ledger) {
    assert.ok(D.products.includes(row.product));
    assert.ok(row.annualMWh>0);
    assert.ok(!row.startDate||row.soldDate<=row.startDate);
    assert.ok(!row.endDate||row.startDate&&row.startDate<=row.endDate);
    assert.ok(!row.cancelledDate||!row.startDate&&row.soldDate<=row.cancelledDate);
    assert.equal(row.status,independentStatus(row,D.cutoff));
    assert.ok(row.opening ? row.soldDate<'2026-01-01' : row.soldDate>='2026-01-01'&&row.soldDate<=D.cutoff);
  }
});
test('Monthly agreement, annual-MWh and active-stock control totals are preserved',()=>{
  A.months.forEach((month,index)=>{
    const actual=D.summary({mode:'month',value:month});
    assert.equal(actual.agreements,fixedMonths[index][0],month);
    assert.equal(actual.annualMWh,fixedMonths[index][1],month);
    assert.equal(actual.activeCount,fixedMonths[index][2],month);
  });
});
test('All product × seller × region monthly cells reconcile the original reporting fixtures',()=>{
  for(const cell of A.rows({partnerIds:['syd']})) {
    const rows=D.query({mode:'month',value:cell.month,product:cell.product,seller:cell.seller,region:cell.region});
    assert.equal(rows.length,cell.agreements,JSON.stringify(cell));
    assert.equal(rows.reduce((sum,row)=>sum+row.annualMWh,0),cell.annualMWh,JSON.stringify(cell));
  }
});
test('Active customers are an all-cohort stock, independently of the selected sales period',()=>{
  const year=D.summary({mode:'year',value:'2026'});
  const month=D.summary({mode:'month',value:'2026-10'});
  const week=D.summary({mode:'week',value:'2026-W41'});
  assert.equal(year.agreements,207);
  assert.equal(year.annualMWh,8175);
  assert.equal(year.activeCount,305);
  assert.equal(month.agreements,6);
  assert.equal(week.agreements,3);
  assert.equal(month.activeCount,year.activeCount);
  assert.equal(week.activeCount,year.activeCount);
  assert.equal(year.activeRows.filter(row=>row.opening).length,121);
  assert.equal(year.activeRows.filter(row=>!row.opening).length,184);
  assert.deepEqual(JSON.parse(JSON.stringify(year.statusCounts)),{active:184,pending:15,ended:2,cancelled:6});
});
test('Historical stocks are calculated as of that period, not today or sale-cohort size',()=>{
  for(const option of [...D.periods('month'),...D.periods('week')]) {
    const mode=option.value.includes('-W') ? 'week' : 'month';
    const p=D.period({mode,value:option.value});
    const actual=D.query({mode,value:option.value},{stock:true});
    assert.equal(actual.length,independentStock(p.observedEnd).length,option.value);
    assert.ok(actual.every(row=>row.status==='active'&&row.asOf===p.observedEnd));
  }
  const january=D.summary({mode:'month',value:'2026-01'});
  assert.equal(january.activeRows.filter(row=>row.opening).length,133);
  assert.ok(january.rows.every(row=>row.status!=='ended'));
  assert.ok(january.rows.some(row=>row.endDate==='2026-06-18'&&row.observedEndDate===null));
});
test('ISO-week boundaries and left/right partial observation do not invent missing days',()=>{
  const first=D.period({mode:'week',value:'2026-W01'});
  assert.equal(first.start,'2025-12-29');
  assert.equal(first.end,'2026-01-04');
  assert.equal(first.observedStart,'2026-01-01');
  assert.equal(first.daysObserved,4);
  assert.equal(first.daysTotal,7);
  assert.equal(first.partial,true);
  const latest=D.period({mode:'week',value:'2026-W41'});
  assert.equal(latest.start,'2026-10-05');
  assert.equal(latest.end,'2026-10-11');
  assert.equal(latest.observedEnd,D.cutoff);
  assert.equal(latest.daysObserved,3);
  assert.equal(latest.partial,true);
  assert.equal(D.periods('week').length,41);
  assert.equal(D.period({mode:'week',value:'2026-W54'}).valid,false);
});
test('Product, seller, geography, search and table status use the same underlying customer rows',()=>{
  const filters={mode:'year',value:'2026',product:'Poolportfölj Trygg',seller:D.sellers[0],region:'Skåne'};
  const rawRows=D.ledger.filter(row=>row.soldDate>='2026-01-01'&&row.product===filters.product&&row.seller===filters.seller&&row.region===filters.region);
  assert.equal(D.query(filters).length,rawRows.length);
  const rawStock=independentStock(D.cutoff).filter(row=>row.product===filters.product&&row.seller===filters.seller&&row.region===filters.region);
  assert.equal(D.summary(filters).activeCount,rawStock.length);
  const row=rawRows[0];
  assert.equal(D.query({...filters,query:row.customerId.toLowerCase()}).length,1);
  const cancelled=D.query({mode:'year',value:'2026',status:'cancelled'});
  assert.equal(cancelled.length,6);
  assert.equal(D.summary({mode:'year',value:'2026',status:'cancelled'}).activeCount,0);
  assert.equal(D.query({...filters,query:'kund som inte finns'}).length,0);
});
test('Completed tenure is measured from actual starts to ends in the period, not predicted active lifetime',()=>{
  const facts=D.insights({mode:'year',value:'2026'});
  const ended=D.ledger.filter(row=>row.endDate&&row.endDate>='2026-01-01'&&row.endDate<=D.cutoff);
  const completedAverage=ended.reduce((sum,row)=>sum+days(row.startDate,row.endDate),0)/ended.length;
  const active=independentStock(D.cutoff);
  const activeAverage=active.reduce((sum,row)=>sum+days(row.startDate,D.cutoff),0)/active.length;
  assert.equal(facts.completed.count,15);
  assert.equal(facts.completed.averageDays,completedAverage);
  assert.equal(facts.active.count,305);
  assert.equal(facts.active.averageDays,activeAverage);
  assert.notEqual(facts.completed.averageDays,facts.active.averageDays);
  assert.equal(D.insights({mode:'month',value:'2026-10'}).completed.averageDays,null);
  assert.equal(D.insights({mode:'month',value:'2026-06'}).completed.count,3);
});
test('Popularity and time charts reconcile their period and filtered customer-level totals',()=>{
  for(const filters of [{mode:'year',value:'2026'},{mode:'month',value:'2026-09'},{mode:'week',value:'2026-W41',product:'Kvartspris'}]) {
    const facts=D.insights(filters),total=D.summary(filters);
    assert.equal(facts.products.reduce((sum,row)=>sum+row.agreements,0),total.agreements);
    assert.equal(facts.products.reduce((sum,row)=>sum+row.annualMWh,0),total.annualMWh);
    assert.equal(facts.trend.reduce((sum,row)=>sum+row.agreements,0),total.agreements);
    assert.equal(facts.trend.reduce((sum,row)=>sum+row.annualMWh,0),total.annualMWh);
    if(total.agreements) assert.ok(Math.abs(facts.products.reduce((sum,row)=>sum+row.share,0)-1)<1e-10);
  }
});
test('Pace scenario adds conditional future sales to observed YTD; it never turns actuals into forecasts',()=>{
  for(const filters of [{mode:'year',value:'2026'},{mode:'month',value:'2026-01'},{mode:'month',value:'2026-10'},{mode:'week',value:'2026-W41'},{mode:'month',value:'2026-09',product:'Poolportfölj Trygg'}]) {
    const projection=D.projection(filters),p=D.period(filters),basis=D.query(filters);
    const ytd=D.query({...filters,mode:'year',value:'2026'});
    const expectedCount=Math.round(ytd.length+basis.length/p.daysObserved*days(D.cutoff,'2026-12-31'));
    const expectedVolume=Math.round(ytd.reduce((sum,row)=>sum+row.annualMWh,0)+basis.reduce((sum,row)=>sum+row.annualMWh,0)/p.daysObserved*85);
    assert.equal(projection.valid,true);
    assert.equal(projection.forecastAgreements,expectedCount);
    assert.equal(projection.forecastAnnualMWh,expectedVolume);
    assert.equal(projection.remainingDays,85);
    assert.equal(projection.asOf,D.cutoff);
    assert.equal(projection.horizon,'2026-12-31');
  }
  assert.equal(D.projection({mode:'year',value:'2026'}).basisDays,280);
  assert.equal(D.projection({mode:'year',value:'2026'}).forecastAgreements,270);
  assert.equal(D.projection({mode:'month',value:'2026-10'}).forecastAgreements,280);
});
test('Empty, unobserved and invalid selections do not fabricate a forecast or tenure',()=>{
  for(const filters of [{mode:'month',value:'2026-12'},{mode:'week',value:'2026-W53'},{mode:'month',value:'2026-13'},{mode:'year',value:'2026',product:'Okänd produkt'}]) {
    const facts=D.insights(filters),projection=D.projection(filters);
    assert.equal(D.query(filters).length,0);
    assert.equal(facts.completed.averageDays,null);
    assert.equal(facts.active.averageDays,null);
    assert.equal(projection.valid,false);
    assert.equal(projection.forecastAgreements,null);
    assert.equal(projection.forecastAnnualMWh,null);
  }
  assert.equal(D.projection({mode:'year',value:'2026',status:'active'}).valid,false);
});
test('Reading filters and forecasts preserves immutable legacy reporting fixtures',()=>{
  const before=JSON.stringify(A.rows());
  D.summary({mode:'month',value:'2026-09',product:'Kvartspris'});
  D.insights({mode:'week',value:'2026-W40'});
  D.projection({mode:'year',value:'2026'});
  assert.equal(JSON.stringify(A.rows()),before);
  assert.equal(A.summary({partnerIds:['syd']}).agreements,207);
  assert.equal(A.summary({partnerIds:['syd']}).annualMWh,8175);
});
console.log(`Savera data: ${checks} checks passed.`);
