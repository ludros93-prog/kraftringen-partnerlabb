import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const row = {
  id: 'qa-supplement', partner: 'estate1', name: 'QA Hyresgäst',
  email: 'qa@hyresgast.example', address: 'Testgatan 1', moveDate: '2026-11-01',
  serviceRequested: true, authorityDemo: true, handoverStatus: 'needs_info',
  processing: { trade: 'pending', network: 'pending', offerChoice: 'undecided' },
  next: 'Stäm av lägenhetsuppgiften med hyresgästen', nextDate: '2026-10-10',
  events: [{ at: '2026-10-08T18:00:00Z', actor: 'Kraftringen · intern demo', text: 'Komplettering behövs.', visibility: 'shared' }]
};
const P = {
  role: 'partner', partner: 'estate1', partners: { estate1: 'Exempelfastigheter AB' },
  partnerRegistry: [{ id: 'estate1', name: 'Exempelfastigheter AB', type: 'property', audience: 'property' }],
  state: { moveins: [row], moveinServiceSeeded: true, records: [], consumerSales: [], commercial: { management: {} } },
  getPartner: id => id === 'estate1' ? { id, name: 'Exempelfastigheter AB', type: 'property', audience: 'property' } : null,
  save: () => true, toast() {}, register() {}, e: value => String(value ?? ''), icon: () => '', date: value => value,
};
const document = { addEventListener() {}, querySelector: () => null, querySelectorAll: () => [] };
const context = vm.createContext({ window: { Portal: P }, document, console, Date, Object, Array, String, Number });
for (const file of ['dist/movein-service.js', 'dist/workspace.js']) vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });

assert.equal(P.moveinService.forward(row.id), true);
assert.equal(row.handoverStatus, 'submitted');
assert.equal(row.submissionType, 'supplement');
assert.equal(row.next, '');
assert.equal(row.nextDate, '');
assert.ok(row.events.some(item => item.text.includes('Tidigare kompletteringsplan avslutad') && item.text.includes('Stäm av lägenhetsuppgiften')));
assert.ok(row.events.some(item => item.text === 'Komplettering behövs.'));

P.role = 'internal';
let task = P.workbench.tasks({ channels: ['movein'], includeManagement: false })[0];
assert.equal(task.owner, 'Kraftringen');
assert.equal(task.next, 'Ta emot kompletterat underlag och fortsätt handläggningen');
assert.equal(task.date, '');

row.handoverStatus = 'handling';
row.next = 'Återkoppla efter kontroll av elnätsdelen';
row.nextDate = '2026-10-12';
task = P.workbench.tasks({ channels: ['movein'], includeManagement: false })[0];
assert.equal(task.next, row.next);
assert.equal(task.date, row.nextDate);

console.log('PASS kompletteringsplan byter ansvar utan att tillskrivas Kraftringen');
console.log('PASS aktivitetshistorik och senare intern plan bevaras');
