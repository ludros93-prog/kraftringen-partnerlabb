import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Registration and repeated import use the same service objects. Historical
// tenant receipts were replaced by the property company's registration receipt.
const P = {
  role: 'partner', partner: 'estate1', partners: { estate1: 'Exempelfastigheter AB' },
  partnerRegistry: [{ id: 'estate1', name: 'Exempelfastigheter AB', type: 'property' }],
  state: { moveins: [], moveinServiceSeeded: true, records: [], offers: [], commercial: {} },
  getPartner: id => id === 'estate1' ? { id, name: 'Exempelfastigheter AB', type: 'property' } : null,
  save: () => true, toast() {}, register() {}, e: value => String(value ?? ''), icon: () => '', date: value => value,
};
const context = vm.createContext({ window: { Portal: P }, document: { querySelector: () => null }, console, Date, Object, Array, String, Number, crypto: { randomUUID: () => 'qa-registration' } });
vm.runInContext(fs.readFileSync('dist/movein-service.js', 'utf8'), context);
const input = { partner: 'estate1', name: 'Lo Exempel', email: 'lo@hyresgast.example', address: 'Testgatan 3', apartment: '1001', postcode: '222 22', city: 'Lund', moveDate: '2026-11-01' };
const first = P.moveinService.createPartnerRecords([input], { source: 'manual' });
assert.equal(first.saved, true);
assert.equal(first.created.length, 1);
const row = first.created[0];
assert.equal(row.handoverStatus, 'draft');
assert.equal(row.authorityDemo, false);
assert.equal(row.authorityFiles.length, 0);
assert.equal(P.moveinService.canForward(row), false);
assert.equal(P.state.records.length, 0);
assert.equal(P.state.offers.length, 0);
const repeated = P.moveinService.createPartnerRecords([input], { source: 'excel', filename: 'samma-underlag.xlsx' });
assert.equal(repeated.created.length, 0);
assert.equal(repeated.duplicates[0].id, row.id);
assert.equal(P.state.moveins.length, 1);
console.log('PASS registrerat serviceunderlag får ingen fullmakt, förmedling eller affär automatiskt');
console.log('PASS upprepat underlag hänvisar till samma ärende utan dubblett');

P.save = () => false;
const failed = P.moveinService.createPartnerRecords([{ ...input, email: 'annan@hyresgast.example' }], { source: 'manual' });
assert.equal(failed.saved, false);
assert.equal(failed.created.length, 0);
assert.equal(P.state.moveins.length, 1);
console.log('PASS misslyckad lagring lämnar tidigare ärenden orörda');
