(() => {
  'use strict';
  const P = window.Portal;
  if (!P) return;

  // Manually specified reporting examples, never calculated from local customer,
  // Beest, offer or move-in records. No delivered electricity or real customer IDs.
  const months = Object.freeze(Array.from({ length:10 }, (_, index) => `2026-${String(index + 1).padStart(2, '0')}`));
  const cutoff = '2026-10-07';
  const partnerIds = ['syd', 'vast', 'estate1', 'estate2'];
  const utility = 'Elhandel';
  // Product names are supplied by the user. Their example distribution below
  // conveys no prices, terms, eligibility or actual historical product mix.
  const segmentCatalog = Object.freeze({
    business:Object.freeze(['Rörligt pris','Kvartspris','Poolportfölj Trygg','Poolportfölj Offensiv','Individuell portfölj','Kraftringen Stabil']),
    consumer:Object.freeze(['Fastpris','Vintersäkrat','Opti','Kvartspris','Rörligt pris'])
  });
  const productCatalog = Object.freeze({
    syd:segmentCatalog.business,
    vast:segmentCatalog.consumer,
    estate1:Object.freeze(['Opti','Kvartspris']),
    estate2:Object.freeze(['Opti','Kvartspris'])
  });
  function productsFor(selectedPartnerIds = partnerIds) {
    if(!Array.isArray(selectedPartnerIds)) return [];
    return [...new Set(selectedPartnerIds.filter(id=>partnerIds.includes(id)).flatMap(id=>productCatalog[id]))];
  }
  // Each tuple is [new example agreements, their agreed annual MWh,
  // example service submissions, example move-ins helped]. Service is not a sale.
  // April–October agrees exactly with commercial.js's existing period examples.
  const totals = {
    syd:     [[17,620,0,0],[18,670,0,0],[19,725,0,0],[20,780,0,0],[22,860,0,0],[24,930,0,0],[24,970,0,0],[26,1050,0,0],[31,1320,0,0],[6,250,0,0]],
    vast:    [[36,142,0,0],[38,151,0,0],[41,164,0,0],[44,180,0,0],[47,192,0,0],[51,210,0,0],[52,220,0,0],[55,235,0,0],[61,260,0,0],[12,50,0,0]],
    estate1: [[8,28,15,11],[9,32,17,13],[10,36,19,15],[12,44,22,17],[14,50,25,20],[16,56,29,23],[18,65,33,27],[20,71,36,30],[24,86,43,36],[5,18,11,8]],
    estate2: [[3,11,7,5],[3,12,8,6],[4,14,9,7],[5,18,11,8],[6,23,13,10],[7,26,16,12],[8,29,18,14],[10,36,24,19],[9,32,27,21],[2,7,6,4]]
  };
  const dimensions = {
    syd: {
      sellers:['Alva Lind · exempel','Milo Berg · exempel','Nora Ek · exempel'],
      regions:['Skåne','Halland','Småland'], sellerWeights:[5,3,2], regionWeights:[6,2,2], productWeights:[4,3,5,3,2,3], volumeWeights:[3,3,5,6,8,4]
    },
    vast: {
      sellers:['Leo Gran · exempel','Ella Sand · exempel','Sam Holm · exempel'],
      regions:['Skåne','Västra Götaland','Stockholm'], sellerWeights:[4,3,3], regionWeights:[5,3,2], productWeights:[3,2,4,6,3], volumeWeights:[4,4,5,4,4]
    },
    estate1: {
      sellers:['Inflyttningskanal · exempel'], regions:['Lund','Malmö'],
      sellerWeights:[1], regionWeights:[6,4], productWeights:[4,6], volumeWeights:[5,4]
    },
    estate2: {
      sellers:['Inflyttningskanal · exempel'], regions:['Helsingborg','Landskrona'],
      sellerWeights:[1], regionWeights:[6,4], productWeights:[4,6], volumeWeights:[5,4]
    }
  };

  // This apportionment only lays out the fixed examples for charts. These
  // illustrative weights are not product rules, actual sales shares or rates.
  function apportion(total, weights) {
    const sum = weights.reduce((value, weight) => value + weight, 0);
    if (!sum || !total) return weights.map(() => 0);
    const shares = weights.map((weight, index) => ({index, exact:total * weight / sum}));
    const values = shares.map(share => Math.floor(share.exact));
    const missing = total - values.reduce((value, amount) => value + amount, 0);
    shares.sort((a,b) => (b.exact - Math.floor(b.exact)) - (a.exact - Math.floor(a.exact)) || a.index-b.index);
    for (let index=0; index<missing; index++) values[shares[index].index]++;
    return values;
  }
  function segments(partner, monthIndex = 0) {
    const d = dimensions[partner];
    return d.sellers.flatMap((seller, sellerIndex) => d.regions.flatMap((region, regionIndex) => productCatalog[partner].map((product, productIndex) => ({
      partner, seller, region, utility, product, segment:partner==='syd' ? 'business' : 'consumer', volumeWeight:d.volumeWeights[productIndex],
      weight:d.sellerWeights[sellerIndex] * d.regionWeights[regionIndex] * d.productWeights[productIndex] * (1 + ((monthIndex + sellerIndex + regionIndex) % 3) / 8)
    }))));
  }
  const cells = partnerIds.flatMap(partner => months.flatMap((month, monthIndex) => {
    const [agreements, annualMWh] = totals[partner][monthIndex];
    const parts = segments(partner, monthIndex);
    const countParts = apportion(agreements, parts.map(part => part.weight));
    // No volume is allocated to a reporting cell containing zero agreements.
    const volumeParts = apportion(annualMWh, countParts.map((count, index) => count * parts[index].volumeWeight));
    return parts.map((part,index) => Object.freeze({partner,month,seller:part.seller,region:part.region,utility,segment:part.segment,product:part.product,agreements:countParts[index],annualMWh:volumeParts[index]}));
  }));
  const serviceCells = ['estate1','estate2'].flatMap(partner => months.flatMap((month, index) => {
    const d = dimensions[partner];
    const registrations = apportion(totals[partner][index][2], d.regionWeights);
    const assisted = apportion(totals[partner][index][3], d.regionWeights);
    return d.regions.map((region, regionIndex) => Object.freeze({partner,month,region,registrations:registrations[regionIndex],helped:assisted[regionIndex]}));
  }));

  // A separate, anonymous aggregate active-customer model provides opening
  // cohorts. New sales and service registrations do not create active customers.
  // Counts below are independently stated examples of active-customer entries.
  const openingTotals = {syd:134,vast:785,estate1:101,estate2:52};
  const openingExits = {
    syd:[1,1,2,1,1,2,1,2,2,0], vast:[15,16,17,18,19,20,20,22,24,5],
    estate1:[1,1,1,1,1,1,1,1,2,0], estate2:[0,1,0,1,0,1,1,1,1,0]
  };
  const activeEntries = {
    syd:[15,16,17,18,20,22,22,24,28,4], vast:[32,34,37,40,43,48,47,51,57,10],
    estate1:[7,8,9,10,12,14,16,18,21,4], estate2:[2,3,3,4,5,6,7,9,8,1]
  };
  // Losses among newly active cohorts are stated separately by entry month and
  // exit month. They only enter churn once that cohort is active at period start.
  const laterExits = {
    syd:{'2026-01':{'2026-06':1},'2026-03':{'2026-09':1}},
    vast:{'2026-01':{'2026-04':2,'2026-08':1},'2026-02':{'2026-05':2,'2026-09':2},'2026-03':{'2026-06':2,'2026-10':1},'2026-04':{'2026-07':2},'2026-05':{'2026-08':2},'2026-06':{'2026-09':3},'2026-07':{'2026-10':1}},
    estate1:{'2026-02':{'2026-09':1}}, estate2:{'2026-03':{'2026-09':1}}
  };
  const preStartTotals = {
    syd:[0,1,0,1,1,1,0,1,1,0], vast:[3,3,4,4,5,5,4,6,6,1],
    estate1:[0,1,0,1,1,1,1,1,2,0], estate2:[0,0,1,0,1,0,1,1,1,0]
  };
  const preStartCells = partnerIds.flatMap(partner => months.flatMap((month,index) => {
    const monthRows = cells.filter(row => row.partner===partner && row.month===month);
    const losses = apportion(preStartTotals[partner][index], monthRows.map(row=>row.agreements));
    return monthRows.map((row, rowIndex) => Object.freeze({...row, preStartCancelled:losses[rowIndex]}));
  }));

  const activeCohorts = [];
  function addCohort(partner, entryIndex, count, exits) {
    const parts = segments(partner, Math.max(0,entryIndex));
    const counts = apportion(count, parts.map(part => part.weight));
    const cohortParts = parts.map((part,index) => ({...part,entryIndex,count:counts[index],exits:{}}));
    Object.entries(exits).sort(([a],[b])=>a.localeCompare(b)).forEach(([month, total]) => {
      const remaining = cohortParts.map(part => part.count - Object.values(part.exits).reduce((sum,value)=>sum+value,0));
      const losses = apportion(total, remaining);
      cohortParts.forEach((part,index) => {if(losses[index]) part.exits[month]=losses[index];});
    });
    activeCohorts.push(...cohortParts.map(part=>Object.freeze({...part,exits:Object.freeze(part.exits)})));
  }
  partnerIds.forEach(partner => {
    addCohort(partner,-1,openingTotals[partner],Object.fromEntries(months.map((month,index)=>[month,openingExits[partner][index]])));
    months.forEach((month,index)=>addCohort(partner,index,activeEntries[partner][index],laterExits[partner][month]||{}));
  });

  const unfiltered = value => value==null || value==='' || value==='all';
  const chosen = (value, defaults) => value==null ? defaults : Array.isArray(value) ? value : [value];
  function selection(opts = {}) {
    return {
      partnerIds:chosen(opts.partnerIds,partnerIds).filter(id=>partnerIds.includes(id)),
      months:chosen(opts.months,months).filter(month=>months.includes(month)),
      seller:opts.seller,region:opts.region,utility:opts.utility,product:opts.product,segment:opts.segment
    };
  }
  function matches(row, opts, service = false) {
    return opts.partnerIds.includes(row.partner) && opts.months.includes(row.month)
      && (unfiltered(opts.region)||row.region===opts.region)
      && (service || ((unfiltered(opts.seller)||row.seller===opts.seller)
        && (unfiltered(opts.utility)||row.utility===opts.utility)
        && (unfiltered(opts.product)||row.product===opts.product)
        && (unfiltered(opts.segment)||row.segment===opts.segment)));
  }
  function rows(opts = {}) {
    const selected = selection(opts);
    return cells.filter(row=>matches(row,selected)).map(row=>({...row}));
  }
  function serviceRows(opts = {}) {
    const selected = selection(opts);
    // Service totals are independent of product choice and salesperson. Region,
    // property partner and period apply; no guessed product or offer acceptance.
    if(!unfiltered(selected.utility) && selected.utility!==utility) return [];
    return serviceCells.filter(row=>matches(row,selected,true)).map(row=>({...row}));
  }
  function summary(opts = {}) {
    const result = rows(opts).reduce((sum,row)=>({agreements:sum.agreements+row.agreements,annualMWh:sum.annualMWh+row.annualMWh}),{agreements:0,annualMWh:0});
    const services = serviceRows(opts).reduce((sum,row)=>({registrations:sum.registrations+row.registrations,helped:sum.helped+row.helped}),{registrations:0,helped:0});
    return {...result,...services};
  }
  const helped = opts => summary(opts).helped;

  function cohort(opts = {}) {
    const selected = selection(opts);
    const selectedMonths = [...new Set(selected.months)].sort();
    const startIndex = selectedMonths.length ? months.indexOf(selectedMonths[0]) : -1;
    const endIndex = selectedMonths.length ? months.indexOf(selectedMonths[selectedMonths.length-1]) : -1;
    const periodValid = startIndex>=0 && selectedMonths.length===endIndex-startIndex+1;
    const periodStart = periodValid ? `${selectedMonths[0]}-01` : null;
    const periodEnd = periodValid ? endIndex===9 ? cutoff : `${selectedMonths[selectedMonths.length-1]}-${new Date(Date.UTC(2026,endIndex+1,0)).getUTCDate()}` : null;
    let openingActive = 0;
    let openingCohortExited = 0;
    if(periodValid) activeCohorts.forEach(part => {
      if(part.entryIndex>=startIndex || !matches({...part,month:selectedMonths[0]},selected)) return;
      const priorExits = Object.entries(part.exits).filter(([month])=>months.indexOf(month)<startIndex).reduce((sum,[,count])=>sum+count,0);
      openingActive += part.count-priorExits;
      openingCohortExited += Object.entries(part.exits).filter(([month])=>selectedMonths.includes(month)).reduce((sum,[,count])=>sum+count,0);
    });
    const sold = summary(opts).agreements;
    const preStartCancelled = preStartCells.filter(row=>matches(row,selected)).reduce((sum,row)=>sum+row.preStartCancelled,0);
    return {
      openingActive,openingCohortExited,churnRate:periodValid&&openingActive ? openingCohortExited/openingActive : null,
      sold,preStartCancelled,preStartRate:sold ? preStartCancelled/sold : null,
      asOf:cutoff,periodStart,periodEnd,partial:selectedMonths.includes('2026-10'),periodValid,
      definition:'Testdefinition: kunder som var aktiva vid periodens början och lämnade under perioden, delat med samma aktiva startkohort. Periodens nya kunder ingår inte i nämnaren.',
      preStartDefinition:'Testdefinition: avtal sålda under vald period som avbröts före start och observerats till 7 oktober, delat med avtal sålda under samma period. Detta är bortfall före start, inte churn.',
      note:periodValid ? 'Fiktiva, separata kohortexempel. Bortfall före start observeras till 7 oktober 2026; de senare säljkohorterna har kortare uppföljning och är inte slutligt utvärderade.' : 'Välj en sammanhängande period för churn. Ingen giltig startkohort finns för det här periodurvalet.'
    };
  }
  const freezeTree=value=>value&&typeof value==='object' ? Object.freeze(Object.fromEntries(Object.entries(value).map(([key,part])=>[key,Array.isArray(part)?Object.freeze([...part]):freezeTree(part)]))) : value;
  const fixtureModel=freezeTree({openingTotals,openingExits,activeEntries,laterExits,preStartTotals});
  P.partnerResultsData = Object.freeze({months,cutoff,segmentCatalog,productCatalog,productsFor,rows,summary,cohort,helped,serviceRows,fixtureModel});
})();
