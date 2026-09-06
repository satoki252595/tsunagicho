import { test } from 'node:test';
import assert from 'node:assert/strict';

test('copy uses the current share URL and keeps content available when clipboard access fails', async () => {
  const previous = Object.fromEntries(['document', 'navigator', 'location', 'localStorage'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const elements = new Map();
  const document = { activeElement: null };
  class Element {
    constructor(tag = 'div') { this.tagName = tag; this.children = []; this.events = new Map(); this.value = ''; this.classList = { add() {} }; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children; }
    setAttribute() {}
    addEventListener(name, listener) { this.events.set(name, listener); }
    focus() { document.activeElement = this; }
    select() { this.selectionStart = 0; this.selectionEnd = this.value.length; }
    showModal() { this.open = true; }
    close() { this.open = false; this.events.get('close')?.(); }
    remove() { document.body.children = document.body.children.filter(child => child !== this); }
  }
  document.body = new Element('body');
  document.createElement = tag => new Element(tag);
  document.getElementById = id => {
    if (id === 'calculator') return null;
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  };
  let copied = '';
  const navigator = { clipboard: { writeText: async text => { copied = text; } } };
  const location = new URL('https://tsunagicho.banchi.app/');
  for (const [key, value] of Object.entries({ document, navigator, location, localStorage: { getItem: () => null } })) Object.defineProperty(globalThis, key, { configurable: true, value });
  try {
    await import('../public/app.mjs');
    const clickCopy = elements.get('copy-link').events.get('click');
    location.search = '?phone=iphone-usbc&mic=rode-usbc&connection=bluetooth&app=capture';
    location.hash = 'finder';
    await clickCopy();
    assert.equal(copied, location.href);
    assert.match(elements.get('answer-message').textContent, /コピーしました/);
    assert.doesNotMatch(elements.get('answer-message').textContent, /このMac/);

    navigator.clipboard.writeText = async () => { throw new Error('Permission denied'); };
    await clickCopy();
    const dialog = document.body.children.at(-1);
    assert.equal(dialog.open, true);
    const preview = dialog.children.find(child => child.tagName === 'textarea');
    assert.equal(preview.value, location.href);
    assert.equal(preview.readOnly, true);
    const actions = dialog.children.find(child => child.className === 'actions');
    const save = actions.children.find(child => child.tagName === 'a');
    assert.equal(save.download, 'tsunagicho-link.txt');
    const copy = actions.children.find(child => child.textContent === '内容をコピー');
    await copy.events.get('click')();
    assert.equal(document.activeElement, preview);
    assert.equal(preview.selectionStart, 0);
    assert.equal(preview.selectionEnd, location.href.length);
    assert.match(dialog.children.at(-1).textContent, /端末のコピー操作/);
    assert.doesNotMatch(dialog.children.at(-1).textContent, /コピーしました/);
    dialog.close();
    assert.equal(document.body.children.length, 0);

    navigator.clipboard = undefined;
    await clickCopy();
    const unsupported = document.body.children.at(-1);
    assert.equal(unsupported.open, true);
    assert.equal(unsupported.children.find(child => child.tagName === 'textarea').value, location.href);
    unsupported.close();
  } finally {
    for (const [key, descriptor] of Object.entries(previous)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});
