import { test } from 'node:test';
import assert from 'node:assert/strict';
import { options, examples, sources, lookup, validSelection, answerText, savings } from '../public/catalog.mjs';
const today = '2026-09-05';
const direct = { phone: 'iphone-usbc', mic: 'rode-usbc', connection: 'bluetooth', app: 'capture' };

test('every selectable condition preserves uncertainty and resolves only to cited guides', () => {
  for (const phone of Object.keys(options.phone)) for (const mic of Object.keys(options.mic)) for (const connection of Object.keys(options.connection)) for (const app of Object.keys(options.app)) {
    const selection = { phone, mic, connection, app }; const result = lookup(selection, today);
    assert.ok(['reference', 'mismatch', 'unknown'].includes(result.status));
    if (result.status !== 'unknown') { assert.equal(result.testedAt, null); assert.equal(result.exactDeviceTested, false); assert.ok(result.sources.every(id => new URL(sources[id].url).protocol === 'https:')); }
    assert.match(answerText(selection, result), /実機確認：未実施/);
  }
});
test('Direct Connect never becomes compatible in a different app or on Android', () => {
  assert.equal(lookup(direct, today).status, 'reference');
  assert.equal(lookup({ ...direct, app: 'camera' }, today).status, 'mismatch');
  assert.equal(lookup({ ...direct, phone: 'android-usbc' }, today).status, 'mismatch');
});
test('unknown, malformed and stale inputs cannot produce a current recommendation', () => {
  for (const selection of [null, {}, { ...direct, mic: '<script>' }, { ...direct, app: '__proto__' }, { ...direct, phone: ['iphone-usbc'] }]) {
    assert.equal(validSelection(selection), false);
    assert.equal(lookup(selection, today).status, 'unknown');
  }
  assert.equal(lookup({ ...direct, mic: 'other' }, today).status, 'unknown');
  assert.equal(lookup(direct, '2026-10-06').status, 'stale');
  assert.equal(lookup(direct, 'invalid').status, 'stale');
  assert.match(answerText(direct, lookup(direct, '2026-10-06')), /再確認が必要/);
});
test('all three entry examples work; changing adapter direction changes the evidence', () => {
  for (const example of examples) assert.equal(lookup(example.selection, today).status, 'reference');
  const a = lookup(examples[0].selection, today);
  const b = lookup({ ...examples[0].selection, phone: 'iphone-lightning', mic: 'rode-usbc' }, today);
  assert.notEqual(a.id, b.id); assert.notDeepEqual(a.sources, b.sources);
});
test('value calculator has explicit bounds and does not invent positive savings', () => {
  assert.equal(savings(50, 5, 2000), 8333);
  assert.equal(savings(0, 5, 2000), 0);
  for (const values of [[-1, 5, 2000], [50, 121, 2000], [Infinity, 5, 2000], [50, 'bad', 2000]]) assert.equal(savings(...values), null);
});
