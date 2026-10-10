import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const source = readFileSync(new URL('../dist/property-intake.js', import.meta.url), 'utf8');
const routes = {};
const draft = {
  version: 1,
  mode: 'import',
  partner: 'estate1',
  filename: 'korrigerad.xlsx',
  batchId: 'qa-batch',
  rows: [
    { rowNumber: 2, fields: { address: 'Testgatan 9', apartment: '1001', postcode: '222 22', city: 'Lund', moveDate: '2026-11-22', name: '', email: 'valid@hyresgast.example', phone: '' }, parseErrors: [], authorityFiles: [], selected: true },
    { rowNumber: 3, fields: { address: 'Testgatan 9', apartment: '1001', postcode: '222 22', city: 'Lund', moveDate: '2026-11-22', name: 'Giltig QA', email: 'valid@hyresgast.example', phone: '' }, parseErrors: [], authorityFiles: [], selected: true },
    { rowNumber: 4, fields: { address: 'Testgatan 9', apartment: '1001', postcode: '222 22', city: 'Lund', moveDate: '2026-11-22', name: 'Dubblett QA', email: 'valid@hyresgast.example', phone: '' }, parseErrors: [], authorityFiles: [], selected: true },
  ],
};
const storage = new Map([['partnerlabb.partnerIntake.v1.estate1:import', JSON.stringify(draft)]]);
const Portal = {
  demoMode: false,
  role: 'partner',
  partner: 'estate1',
  page: 'property-import',
  state: { moveins: [] },
  partnerRegistry: [{ id: 'estate1', type: 'property' }],
  e: value => String(value ?? ''),
  icon: () => '',
  getPartner: () => ({ id: 'estate1', name: 'Exempelfastigheter AB', type: 'property' }),
  go: page => { Portal.page = page; },
  render: () => {},
  register: (name, route) => { routes[name] = route; },
};
const context = {
  window: { Portal, ExcelJS: null },
  document: { querySelector: () => null, querySelectorAll: () => [] },
  sessionStorage: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  },
  crypto: webcrypto,
  confirm: () => true,
  console,
};
vm.createContext(context);
vm.runInContext(source, context);

const html = routes['property-import'].render();
const corrected = html.match(/data-pi-select="1"[^>]*>/)?.[0] ?? '';
const duplicate = html.match(/data-pi-select="2"[^>]*>/)?.[0] ?? '';
assert.match(corrected, /checked/);
assert.doesNotMatch(corrected, /disabled/);
assert.match(duplicate, /disabled/);
assert.match(html, /3 rader i filen · 2 rader behöver kontrolleras/);
console.log('PASS felaktig rad blockerar inte en senare korrigerad Excel-rad');
