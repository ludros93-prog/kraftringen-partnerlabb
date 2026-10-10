import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import vm from 'node:vm';

const source = readFileSync(new URL('../dist/partner-setup.js', import.meta.url), 'utf8');
const context = vm.createContext({ window: {}, crypto: webcrypto });
vm.runInContext(source, context);
const H = context.window.PartnerSetupRegistry;
const plain = value => JSON.parse(JSON.stringify(value));
const basePartners = () => [
  { id: 'syd', name: 'Savera', type: 'sales', audience: 'business', salesAudiences: ['business'] },
  { id: 'vast', name: 'Face2face', type: 'field', audience: 'consumer', salesAudiences: ['consumer'] },
  { id: 'estate1', name: 'Exempelfastigheter AB', type: 'property', audience: 'movein' },
];
function fixture() {
  const registry = basePartners();
  const partners = Object.fromEntries(registry.map(partner => [partner.id, partner.name]));
  const P = {
    partnerRegistry: registry,
    partners,
    state: { records: [{ id: 'old-record', company: 'Fiktiv kund', partner: 'syd' }], offers: [{ id: 'old-offer' }], partnerProfiles: {} },
    role: 'internal',
    getPartner: id => registry.find(partner => partner.id === id),
    save: () => true,
    e: String,
    icon: () => '',
  };
  P.syncPartnerRegistry = () => H.apply(registry, partners, P.state.partnerProfiles);
  H.hydrate({}, registry, partners);
  H.init(P);
  return P;
}

let checks = 0;
function test(name, run) { run(); checks++; console.log(`PASS ${name}`); }

test('new B2B, B2C and mixed partners persist segment arrays without manufacturing business results', () => {
  const P = fixture();
  const originalRecords = JSON.stringify(P.state.records);
  const originalOffers = JSON.stringify(P.state.offers);
  for (const [name, salesAudiences] of [['B2B Exempel', ['business']], ['B2C Exempel', ['consumer']], ['Båda Exempel', ['business', 'consumer']]]) {
    const result = P.partnerSetup.saveProfile({ name, salesAudiences });
    assert.equal(result.ok, true);
    assert.match(result.id, /^partner-[a-z0-9-]+$/);
    assert.deepEqual(plain(P.getPartner(result.id).salesAudiences), salesAudiences);
    assert.equal(P.getPartner(result.id).audience, salesAudiences.length === 2 ? 'mixed' : salesAudiences[0]);
    assert.equal(P.partners[result.id], name);
  }
  assert.equal(JSON.stringify(P.state.records), originalRecords);
  assert.equal(JSON.stringify(P.state.offers), originalOffers);
  assert.equal(P.state.commercial, undefined);
});

test('renaming a seeded partner and freeing its former name survives profile insertion order on reload', () => {
  const P = fixture();
  const added = P.partnerSetup.saveProfile({ name: 'Framtida partner', salesAudiences: ['consumer'] });
  assert.equal(P.partnerSetup.saveProfile({ name: 'Savera Nytt', salesAudiences: ['business', 'consumer'] }, 'syd').ok, true);
  assert.equal(P.partnerSetup.saveProfile({ name: 'Savera', salesAudiences: ['consumer'] }, added.id).ok, true);
  const reloaded = fixture();
  reloaded.state.partnerProfiles = H.hydrate(JSON.parse(JSON.stringify(P.state.partnerProfiles)), reloaded.partnerRegistry, reloaded.partners);
  assert.equal(reloaded.getPartner('syd').name, 'Savera Nytt');
  assert.equal(reloaded.getPartner(added.id).name, 'Savera');
  assert.equal(reloaded.partners[added.id], 'Savera');
  assert.deepEqual(plain(reloaded.getPartner('syd').salesAudiences), ['business', 'consumer']);
});

test('duplicate names are rejected across case, whitespace and Unicode compatibility forms', () => {
  const P = fixture();
  for (const name of [' savera ', 'SAVERA', 'Ｓａｖｅｒａ']) {
    const result = P.partnerSetup.saveProfile({ name, salesAudiences: ['business'] });
    assert.equal(result.ok, false);
    assert.equal(result.field, 'name');
  }
  assert.equal(P.partnerRegistry.length, 3);
  assert.deepEqual(P.state.partnerProfiles, {});
});

test('existing Face2face channel type is preserved while changing its selected segments', () => {
  const P = fixture();
  assert.equal(P.partnerSetup.saveProfile({ name: 'Face2face', salesAudiences: ['consumer', 'business', 'invalid'] }, 'vast').ok, true);
  assert.equal(P.getPartner('vast').type, 'field');
  assert.equal(P.getPartner('vast').audience, 'mixed');
  assert.deepEqual(plain(P.getPartner('vast').salesAudiences), ['business', 'consumer']);
});

test('storage failure rolls back both new and edited profiles and keeps registry identity', () => {
  const P = fixture();
  const previousProfiles = P.state.partnerProfiles;
  const previousRegistry = P.partnerRegistry;
  const previousNames = P.partners;
  P.save = () => false;
  assert.equal(P.partnerSetup.saveProfile({ name: 'Osparad partner', salesAudiences: ['business'] }).ok, false);
  assert.equal(P.partnerSetup.saveProfile({ name: 'Osparad Savera', salesAudiences: ['consumer'] }, 'syd').ok, false);
  assert.equal(P.state.partnerProfiles, previousProfiles);
  assert.equal(P.partnerRegistry, previousRegistry);
  assert.equal(P.partners, previousNames);
  assert.equal(P.getPartner('syd').name, 'Savera');
  assert.equal(P.partnerRegistry.length, 3);
  P.save = () => { throw new Error('storage failure'); };
  assert.equal(P.partnerSetup.saveProfile({ name: 'Exception partner', salesAudiences: ['business'] }).ok, false);
  assert.equal(P.state.partnerProfiles, previousProfiles);
});

test('reset removes local partner configuration and restores seeded partners in the same shared containers', () => {
  const P = fixture();
  const registry = P.partnerRegistry;
  const names = P.partners;
  const added = P.partnerSetup.saveProfile({ name: 'Ny partner', salesAudiences: ['consumer'] });
  P.partnerSetup.saveProfile({ name: 'Savera ändrad', salesAudiences: ['business', 'consumer'] }, 'syd');
  P.state.partnerProfiles = {};
  P.syncPartnerRegistry();
  assert.equal(P.partnerRegistry, registry);
  assert.equal(P.partners, names);
  assert.equal(P.getPartner('syd').name, 'Savera');
  assert.deepEqual(plain(P.getPartner('syd').salesAudiences), ['business']);
  assert.equal(P.getPartner(added.id), undefined);
  assert.equal(added.id in names, false);
});

test('malformed saved profiles cannot convert property partners or add unsupported segments or unsafe keys', () => {
  const P = fixture();
  const malicious = JSON.parse('{"estate1":{"name":"Bostäder ändrade","type":"sales","salesAudiences":["business"]},"constructor":{"name":"Unsafe","type":"sales","salesAudiences":["consumer"]},"new-a":{"name":"Wrong","type":"sales","salesAudiences":["fiber"]},"new-b":{"name":"Good","type":"sales","salesAudiences":["consumer"]},"new-c":{"name":"Good","type":"sales","salesAudiences":["business"]}}');
  const profiles = H.hydrate(malicious, P.partnerRegistry, P.partners);
  assert.deepEqual(plain(profiles), {});
  assert.equal(P.getPartner('estate1').type, 'property');
  assert.equal(P.getPartner('estate1').name, 'Exempelfastigheter AB');
  assert.equal(own(P.partners, 'constructor'), false);
});

test('property partner editing, invalid names, missing segment and partner-view mutations are rejected', () => {
  const P = fixture();
  assert.equal(P.partnerSetup.saveProfile({ name: 'Bostäder', salesAudiences: ['business'] }, 'estate1').ok, false);
  for (const name of ['', '   ', 'x'.repeat(91)]) assert.equal(P.partnerSetup.saveProfile({ name, salesAudiences: ['business'] }).ok, false);
  assert.equal(P.partnerSetup.saveProfile({ name: 'Giltigt namn', salesAudiences: [] }).ok, false);
  P.role = 'partner';
  assert.equal(P.partnerSetup.saveProfile({ name: 'Otillåten demovy', salesAudiences: ['business'] }).ok, false);
  assert.equal(P.partnerSetup.saveProfile({ name: 'Savera', salesAudiences: ['consumer'] }, 'syd').ok, false);
  assert.equal(P.partnerRegistry.length, 3);
});

function own(object, key) { return Object.prototype.hasOwnProperty.call(object, key); }
console.log(`${checks} partner registry checks passed`);
