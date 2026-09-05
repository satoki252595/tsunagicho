export const checkedAt = '2026-09-05';
export const reviewBy = '2026-10-05';
export const options = {
  phone: { 'iphone-usbc': 'iPhone / USB-C', 'iphone-lightning': 'iPhone / Lightning', 'android-usbc': 'Android / USB-C', other: 'それ以外・分からない' },
  mic: { 'dji-mini': 'DJI Mic Mini（初代）', 'rode-usbc': 'RØDE Wireless Micro / USB-C', 'rode-lightning': 'RØDE Wireless Micro / Lightning', other: 'それ以外・分からない' },
  connection: { receiver: '受信機をスマホに接続', bluetooth: '送信機を直接ワイヤレス接続' },
  app: { camera: 'スマホの標準カメラ', capture: 'RØDE Capture', live: 'ライブ配信アプリ', other: 'それ以外・分からない' }
};
export const sources = {
  dji: { title: 'DJI Mic Mini 公式FAQ', url: 'https://www.dji.com/mic-mini/faq' },
  direct: { title: 'RØDE公式：Direct Connectの設定', url: 'https://help.rode.com/hc/en-us/articles/13294231886607-Setting-Up-Direct-Connect-with-the-Wireless-Micro' },
  lightning: { title: 'RØDE公式：Lightning受信機をUSB-C端末で使う', url: 'https://help.rode.com/hc/en-us/articles/11243265125903-Can-I-use-my-Lightning-Wireless-Micro-with-a-USB-C-Device' },
  usbc: { title: 'RØDE公式：USB-C受信機をLightning端末で使う', url: 'https://help.rode.com/hc/en-us/articles/11243380546063-Can-I-use-my-USB-C-Wireless-Micro-with-a-Lightning-Device' }
};
export const examples = [
  { title: 'マイクはそのまま。スマホを買い替えたい', tag: '端子が変わるとき', selection: { phone: 'iphone-usbc', mic: 'rode-lightning', connection: 'receiver', app: 'camera' } },
  { title: '受信機なしで、動画を撮りたい', tag: '荷物を減らしたい', selection: { phone: 'iphone-usbc', mic: 'rode-usbc', connection: 'bluetooth', app: 'capture' } },
  { title: '配信に、ワイヤレスマイクを使いたい', tag: '配信前の確認', selection: { phone: 'android-usbc', mic: 'dji-mini', connection: 'bluetooth', app: 'live' } }
];

const guides = {
  'rode-direct': { title: '直接接続は、RØDE Captureから。', summary: 'メーカーはiOSのRØDE Capture内でDirect Connectを案内しています。標準カメラなど別のアプリでは、受信機を使う案内です。', path: ['Wireless Micro 送信機', 'Direct Connect', 'iPhone ＋ RØDE Capture'], steps: ['メーカー手順でファームウェアの更新状況を確認する。', 'スマホのBluetoothをオンにし、RØDE Captureの音声入力でDirect Connectを選ぶ。', '送信機を接続し、短い動画で外付けマイクの音が入るか確かめる。'], caution: 'iPhoneの個別機種・iOS・アプリ版の動作は、つなぎ帳では未検証です。', sources: ['direct', 'lightning'] },
  'rode-lightning-usbc': { title: '端子変換は「充電できる」だけでは不十分。', summary: 'RØDEはLightning受信機をUSB-C端末で使う方法として、Apple純正USB-C - Lightningアダプタを案内しています。音声を運べない充電専用品は使えません。', path: ['Lightning 受信機', 'Apple USB-C - Lightning アダプタ', 'USB-C の iPhone'], steps: ['手持ちの受信機がLightning版か確認する。', '公式資料に記載されたアダプタと、手元の型番を照合する。', '実際に使うアプリで録画・再生し、外付け入力を確認する。'], caution: 'この情報は接続経路の案内です。第三者製の変換器や、すべてのアプリでの動作を保証するものではありません。', sources: ['lightning'] },
  'rode-usbc-lightning': { title: '変換器の具体的な型番まで、確認しよう。', summary: 'RØDEはUSB-C受信機からLightning端末への変換方法を案内していますが、推奨する特定のアダプタ製品は示していません。', path: ['USB-C 受信機', 'データ対応変換器：型番未確認', 'Lightning の iPhone'], steps: ['USB-Cメス → Lightningオスの向きと、データ転送対応を確認する。', '購入前に、受信機とスマホの具体的な型番を販売店へ伝える。', '変換器の適合根拠が得られるまで、使えると判断しない。'], caution: 'このガイドから特定のアダプタの購入を勧めることはできません。', sources: ['usbc'] },
  'dji-bluetooth': { title: 'つながることと、配信に音が入ることは別。', summary: 'DJIはBluetooth直接接続時の配信録音について、アプリとスマホOSの組み合わせに依存すると説明しています。', path: ['DJI Mic Mini 送信機', 'Bluetooth', 'スマホ ＋ 配信アプリ'], steps: ['実際に使う配信アプリ名とOSの版を確認する。', 'メーカーの適合情報を読み、外部Bluetooth音声を受け付けるか確認する。', '非公開の録音確認で外付け入力を確かめてから、本番に使う。'], caution: 'Bluetoothの接続表示だけでは、外付けマイクの入力確認にはなりません。', sources: ['dji'] },
  'dji-receiver': { title: '受信機と、スマホ側の端子を確認しよう。', summary: 'DJI Mic Miniにはスマホ用Type-C / Lightningアダプタ経由の接続案内があります。端子の形だけでなく、個別機種の適合情報も確認します。', path: ['DJI Mic Mini 送信機', 'Mic Mini 受信機 ＋ 対応スマホアダプタ', 'スマホ ＋ 撮影アプリ'], steps: ['Mic Mini本体の受信機とスマホ用アダプタの組み合わせを確認する。', 'DJIのダウンロードページにある適合情報で、スマホの機種を照合する。', '実際の撮影アプリで録画と再生を行い、外付け入力を確認する。'], caution: '初代Mic Miniのガイドです。Mic Mini 2など別世代へ読み替えないでください。', sources: ['dji'] }
};

export function validSelection(selection) {
  return !!selection && Object.entries(options).every(([key, values]) => typeof selection[key] === 'string' && Object.hasOwn(values, selection[key]));
}

// ponytail: five editorial guides; add a data index only after repeatable device-level records exist.
export function lookup(selection, today = new Date().toISOString().slice(0, 10)) {
  if (!validSelection(selection)) return { status: 'unknown', reason: '選択内容を確認してください。' };
  const { phone, mic, connection, app } = selection;
  if ([phone, mic, app].includes('other')) return { status: 'unknown', reason: 'この条件に対応するガイドは、まだありません。' };
  let id;
  let mismatch = false;
  if (mic.startsWith('rode-') && connection === 'bluetooth') {
    id = 'rode-direct';
    mismatch = !phone.startsWith('iphone-') || app !== 'capture';
  } else if (mic === 'rode-lightning' && phone === 'iphone-usbc' && connection === 'receiver') id = 'rode-lightning-usbc';
  else if (mic === 'rode-usbc' && phone === 'iphone-lightning' && connection === 'receiver') id = 'rode-usbc-lightning';
  else if (mic === 'dji-mini' && connection === 'bluetooth' && app === 'live') id = 'dji-bluetooth';
  else if (mic === 'dji-mini' && connection === 'receiver') id = 'dji-receiver';
  if (!id) return { status: 'unknown', reason: 'この組み合わせを判断できるガイドは、まだありません。' };
  const stale = !/^\d{4}-\d{2}-\d{2}$/.test(today) || today < checkedAt || today > reviewBy;
  return { ...guides[id], id, status: stale ? 'stale' : mismatch ? 'mismatch' : 'reference', checkedAt, reviewBy, testedAt: null, exactDeviceTested: false,
    condition: mismatch ? '選んだ条件はDirect Connectの案内対象外です。iPhoneとRØDE Captureの組み合わせを確認してください。' : null };
}

export function selectionText(selection) {
  if (!validSelection(selection)) throw new Error('Invalid selection');
  return Object.entries(options).map(([key, values]) => values[selection[key]]).join(' / ');
}

export function answerText(selection, result) {
  const lines = ['つなぎ帳｜購入・接続の確認メモ', selectionText(selection), '個別機種・OS・アプリ版での実機確認：未実施'];
  if (result.status === 'unknown') lines.push(result.reason);
  else {
    lines.push(`資料確認: ${result.checkedAt} / 再確認期限: ${result.reviewBy}`);
    if (result.status === 'stale') lines.push('資料の再確認が必要です。このメモだけで購入を判断しないでください。');
    if (result.condition) lines.push(result.condition);
    lines.push(result.title, result.summary, ...result.steps.map((s, i) => `${i + 1}. ${s}`), result.caution, ...result.sources.map(id => `${sources[id].title}: ${sources[id].url}`));
  }
  lines.push('確認時に伝えること：スマホの型番 / OS版 / アプリ名と版 / マイクと受信機の型番 / ファームウェア版 / アダプタ型番 / 試したい機能');
  return lines.join('\n\n');
}

export function savings(cases, minutes, hourly) {
  const values = [cases, minutes, hourly].map(Number);
  if (values.some(x => !Number.isFinite(x) || x < 0) || values[0] > 100000 || values[1] > 120 || values[2] > 100000) return null;
  return Math.round(values[0] * values[1] * values[2] / 60);
}
