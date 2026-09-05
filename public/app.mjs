import { options, examples, sources, validSelection, lookup, selectionText, answerText, savings } from './catalog.mjs';

const $ = id => document.getElementById(id);
function download(name, text, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const dialog = document.createElement('dialog'); dialog.className = 'export-dialog'; dialog.setAttribute('aria-label', '書き出し内容の確認');
  const title = document.createElement('h2'); title.textContent = '内容を確認して、持ち出す。';
  const note = document.createElement('p'); note.className = 'fine'; note.textContent = 'この内容は外部へ送信されません。ファイル保存に対応しないブラウザでは、コピーをご利用ください。';
  const preview = document.createElement('textarea'); preview.readOnly = true; preview.value = text; preview.setAttribute('aria-label', '書き出す内容');
  const actions = document.createElement('div'); actions.className = 'actions';
  const link = document.createElement('a');
  link.href = url; link.download = name; link.textContent = 'ファイルを保存'; link.className = 'button primary';
  const copy = document.createElement('button'); copy.type = 'button'; copy.className = 'button secondary'; copy.textContent = '内容をコピー';
  const status = document.createElement('p'); status.className = 'fine'; status.setAttribute('role', 'status');
  copy.addEventListener('click', async () => { try { await navigator.clipboard.writeText(text); status.textContent = '内容をコピーしました。'; } catch { preview.select(); status.textContent = '内容を選択しました。端末のコピー操作をご利用ください。'; } });
  const close = document.createElement('button'); close.type = 'button'; close.className = 'text-button'; close.textContent = '閉じる'; close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { URL.revokeObjectURL(url); dialog.remove(); });
  actions.append(link, copy, close); dialog.append(title, note, preview, actions, status); document.body.append(dialog); dialog.showModal();
}
function textList(element, texts) {
  element.replaceChildren(...texts.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
}
function linkToSource(id) {
  const link = document.createElement('a');
  link.href = sources[id].url; link.textContent = sources[id].title + ' ↗';
  link.className = 'source-link'; link.target = '_blank'; link.rel = 'noopener noreferrer';
  return link;
}

if ($('search-form')) {
  const form = $('search-form');
  const params = new URLSearchParams(location.search);
  if (params.get('embed') === '1') document.body.classList.add('embed');
  for (const [key, values] of Object.entries(options)) {
    for (const [value, label] of Object.entries(values)) {
      const option = document.createElement('option'); option.value = value; option.textContent = label; $(key).append(option);
    }
  }
  let current = null;
  let saved = [];
  let storageWarning = '';
  const storageKey = 'tsunagicho.selections.v1';
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored && stored.length > 20000) throw new Error('Oversized saved data');
    const parsed = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(parsed) || parsed.length > 12 || !parsed.every(validSelection)) throw new Error('Invalid saved data');
    saved = parsed.map(s => Object.fromEntries(Object.keys(options).map(key => [key, s[key]])));
  } catch { storageWarning = '保存内容を読み込めませんでした。検索はそのまま使えます。'; }
  function persist(next) {
    try { localStorage.setItem(storageKey, JSON.stringify(next)); saved = next; return true; }
    catch { $('answer-message').textContent = 'このブラウザには保存できません。確認メモのダウンロードをご利用ください。'; return false; }
  }
  function renderSaved() {
    $('saved-list').replaceChildren();
    if (!saved.length) {
      const p = document.createElement('p'); p.className = 'empty-note'; p.textContent = storageWarning || '気になる組み合わせを保存すると、ここに並びます。'; $('saved-list').append(p);
    }
    saved.forEach((selection, index) => {
      const row = document.createElement('div'); row.className = 'saved-row';
      const open = document.createElement('button'); open.type = 'button'; open.className = 'text-button'; open.textContent = selectionText(selection);
      open.addEventListener('click', () => choose(selection));
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'text-button'; remove.textContent = '削除'; remove.setAttribute('aria-label', selectionText(selection) + 'を保存から削除');
      remove.addEventListener('click', () => { if (persist(saved.filter((_, i) => i !== index))) renderSaved(); });
      row.append(open, remove); $('saved-list').append(row);
    });
  }
  function render(selection, focus = true) {
    const result = lookup(selection); current = { selection, result };
    $('result').hidden = false; $('change-notice').textContent = ''; $('answer-message').textContent = '';
    $('result-selection').textContent = selectionText(selection);
    $('result-status').textContent = { unknown: '未確認 · ガイド未収録', stale: '再確認が必要 · 資料の期限切れ', mismatch: '公式の案内対象外 · 接続条件に注意', reference: '公式資料あり · 実機未検証' }[result.status];
    $('result-status').className = 'status-tag' + (result.status === 'reference' ? '' : ' warning');
    const unknown = result.status === 'unknown';
    $('result-title').textContent = unknown ? 'まだ、この組み合わせは判断できません。' : result.title;
    $('result-summary').textContent = unknown ? result.reason + ' 型番と使いたい機能を確認メモにまとめ、販売店やメーカーへの相談に使えます。' : result.summary;
    $('result-condition').hidden = !(result.condition || result.status === 'stale');
    $('result-condition').textContent = result.status === 'stale' ? '資料の再確認期限を過ぎています。以下は過去の案内です。最新の公式資料を確認してください。' : result.condition || '';
    $('connection-path').hidden = unknown;
    textList($('connection-path'), result.path || []);
    textList($('result-steps'), result.steps || ['スマホ、マイク、受信機、変換器の具体的な型番を確認する。', '使いたいアプリ名とOSの版、試したい機能を整理する。', '販売店やメーカーから、その条件での適合根拠を確認する。']);
    $('result-sources').replaceChildren(...(result.sources || []).map(linkToSource));
    $('result-date').textContent = unknown ? 'この条件に対応する出典：未登録' : `資料確認 ${result.checkedAt} / 再確認期限 ${result.reviewBy}`;
    $('result-caution').textContent = result.caution || 'ガイドがないことは「使えない」という意味ではありません。動作確認の根拠がない状態です。';
    const next = new URL(location.href);
    Object.keys(options).forEach(key => next.searchParams.set(key, selection[key]));
    next.hash = 'finder'; history.replaceState(null, '', next);
    if (focus) $('result-title').focus({ preventScroll: false });
  }
  function choose(selection) {
    Object.keys(options).forEach(key => { $(key).value = selection[key]; });
    render(selection);
  }
  form.addEventListener('submit', event => {
    event.preventDefault(); const selection = Object.fromEntries(new FormData(form));
    if (validSelection(selection)) render(selection);
  });
  form.addEventListener('change', () => {
    current = null; $('result').hidden = true; $('change-notice').textContent = '条件を変更しました。「確認ポイントを見る」で再確認できます。';
    const next = new URL(location.href); Object.keys(options).forEach(key => next.searchParams.delete(key)); history.replaceState(null, '', next);
  });
  $('download-answer').addEventListener('click', () => { if (current) download('tsunagicho-checklist.txt', answerText(current.selection, lookup(current.selection))); });
  $('save-answer').addEventListener('click', () => {
    if (!current) return;
    if (saved.some(s => Object.keys(options).every(key => s[key] === current.selection[key]))) { $('answer-message').textContent = 'この組み合わせは保存済みです。'; return; }
    if (saved.length >= 12) { $('answer-message').textContent = '保存は12件までです。不要な組み合わせを削除してください。'; return; }
    if (persist([...saved, current.selection])) { renderSaved(); $('answer-message').textContent = 'このブラウザに保存しました。端末間での同期や外部送信はありません。'; }
  });
  $('copy-link').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); $('answer-message').textContent = '組み合わせのリンクをコピーしました。ローカル版のリンクはこのMacでのみ開けます。'; }
    catch { $('answer-message').textContent = 'コピーできませんでした。ブラウザのアドレスをコピーしてください。'; }
  });
  examples.forEach(example => {
    const card = document.createElement('button'); card.type = 'button'; card.className = 'example-card';
    const tag = document.createElement('span'); tag.textContent = example.tag;
    const title = document.createElement('strong'); title.textContent = example.title;
    const arrow = document.createElement('b'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
    card.append(tag, title, arrow); card.addEventListener('click', () => choose(example.selection)); $('example-list').append(card);
  });
  renderSaved();
  const initial = Object.fromEntries(Object.keys(options).map(key => [key, params.get(key)]));
  if (validSelection(initial)) { Object.keys(options).forEach(key => { $(key).value = initial[key]; }); render(initial, false); }
  else if (Object.keys(options).some(key => params.has(key))) $('change-notice').textContent = 'リンクの条件を読み取れませんでした。選び直してください。';
}

if ($('calculator')) {
  $('record-form').elements.namedItem('testedOn').max = new Date().toISOString().slice(0, 10);
  function calculate() {
    const value = savings($('cases').value, $('minutes').value, $('hourly').value);
    $('savings-result').textContent = value === null ? '入力値を確認してください' : `月 ${value.toLocaleString('ja-JP')} 円相当`;
    $('savings-note').textContent = value === null ? '件数は0〜100,000、分は0〜120、時給は0〜100,000で入力してください。' : `仮の月額4,980円との差：${(value - 4980).toLocaleString('ja-JP')}円。実測値・売上・利益ではありません。検証や運用にかかる時間は別途差し引きます。`;
  }
  $('calculator').addEventListener('input', calculate); calculate();
  $('download-proposal').addEventListener('click', () => download('tsunagicho-pilot-proposal.txt', 'つなぎ帳｜販売店向け試用提案（未送信）\n\nスマホと外付けマイクに関する購入前後の確認を案内する体験版です。まず1用途・少量の問い合わせで、公式リンクだけの場合と比べて、対応時間や解決率が変わるかを検証します。\n\n試用案：合意した範囲で14日間。試用自体は無料、継続価格は1店舗月4,980円（税込を想定・仮価格）。自動課金はありません。\n\n確認したいこと：月間の関連問い合わせ件数、1件の対応時間、匿名化できる例、検証できる手元機材、資料の再利用許諾、具体価格での継続意思。\n\n現在は公式資料に基づくガイドで、実機確認・削減効果・企業向け機能の提供は未検証です。顧客の氏名や注文情報を共有する必要はありません。試用範囲とデータ取り扱いを合意してから開始します。'));
  $('record-form').addEventListener('submit', event => {
    event.preventDefault(); const fields = Object.fromEntries(new FormData(event.currentTarget));
    const record = { schemaVersion: 1, createdAt: new Date().toISOString(), evidenceType: 'owner-report-unreviewed', publicationStatus: 'private-draft', reviewedAt: null,
      device: fields.device.trim(), os: fields.os.trim(), app: fields.app.trim(), microphone: fields.microphone.trim(), firmware: fields.firmware.trim(), wiring: fields.wiring.trim(), testedFunction: fields.function.trim(), testedOn: fields.testedOn, result: fields.result, notes: fields.notes.trim(), sharingPermission: fields.permission === 'on' ? 'declared-by-author-not-reviewed' : 'not-granted' };
    if (Object.values(record).some(value => typeof value === 'string' && value.length > 1000)) { $('record-message').textContent = '入力が長すぎます。1項目1,000文字以内にしてください。'; return; }
    if (Object.values(record).some(value => value === '')) { $('record-message').textContent = '空白だけの項目があります。不明な項目は「不明」と記入してください。'; return; }
    download('tsunagicho-verification-draft.json', JSON.stringify(record, null, 2), 'application/json');
    $('record-message').textContent = '未審査の検証メモを作成しました。保存またはコピーして持ち出せます。公開・送信・検索結果への反映は行っていません。';
  });
  $('source-directory').replaceChildren(...Object.keys(sources).map(linkToSource));
}
