import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const older = { id: 'inflytt-old', partner: 'estate1', name: 'Äldre Exempel', email: 'aldre@hyresgast.example', address: 'Testgatan 1', postcode: '222 22', city: 'Lund', moveDate: '2026-11-01', createdAt: '2026-10-01T10:00:00Z', serviceRequested: true, authorityDemo: true, handoverStatus: 'draft' };
const latest = { id: 'inflytt-latest', partner: 'estate1', name: 'Senaste Exempel', email: 'senaste@hyresgast.example', address: 'Testgatan 2', postcode: '222 22', city: 'Lund', moveDate: '2026-11-02', createdAt: '2026-10-02T10:00:00Z', serviceRequested: true, authorityDemo: true, handoverStatus: 'handling' };
const seeded = { ...latest, id: 'service-demo-001', createdAt: '2026-10-03T10:00:00Z', demoServiceCase: true };
const otherPartner = { ...latest, id: 'inflytt-other', partner: 'estate2', createdAt: '2026-10-04T10:00:00Z' };
const views = {};
const storage = new Map();
const P = {
  partner: 'estate1', role: 'partner', partners: { estate1: 'Exempelfastigheter AB', estate2: 'Exempelbo Förvaltning' },
  partnerRegistry: [{ id: 'estate1', name: 'Exempelfastigheter AB', type: 'property' }, { id: 'estate2', name: 'Exempelbo Förvaltning', type: 'property' }],
  state: { moveins: [seeded, otherPartner, older, latest], propertySettings: {} },
  getPartner: id => ({ id, name: id === 'estate1' ? 'Exempelfastigheter AB' : 'Exempelbo Förvaltning', type: 'property' }),
  moveinService: { rows: id => P.state.moveins.filter(row => row.partner === id), statusLabel: row => ({ draft: 'Hos partnern', handling: 'Kraftringen handlägger' })[row.handoverStatus] || row.handoverStatus },
  register: (name, component) => { views[name] = component; }, render() {}, go() {}, e: value => String(value ?? ''), icon: () => '',
};
const sessionStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) };
const document = { querySelector: () => null, querySelectorAll: () => [] };
const context = vm.createContext({ window: { Portal: P }, document, sessionStorage, console, Date, Intl, URL, location: { href: 'https://example.test/' }, crypto: { randomUUID: () => 'qa-id' } });
vm.runInContext(fs.readFileSync('dist/property.js', 'utf8'), context, { filename: 'dist/property.js' });

P.openMovein('estate1');
assert.equal(P.propertyReceipts.latest().id, latest.id, 'latest own registered case should be recoverable');
assert.equal(P.propertyReceipts.recover(seeded.id), false, 'seed fixtures must not be offered as receipts');
assert.equal(P.propertyReceipts.recover(otherPartner.id), false, 'another partner receipt must stay isolated');
const before = P.state.moveins.length;
assert.equal(P.propertyReceipts.recover(latest.id), true);
assert.equal(P.state.moveins.length, before, 'recovery must not create a duplicate case');
const html = views.movein.render();
assert.match(html, /TIDIGARE TESTUNDERLAG/);
assert.match(html, /INFLYTT-LATEST/);
assert.match(html, /Kraftringen handlägger/);
assert.doesNotMatch(html, /INFLYTT-OTHER/);

console.log('PASS senaste lokala testunderlag hittas efter omladdning');
console.log('PASS återställning återanvänder ärendet och visar aktuell status');
