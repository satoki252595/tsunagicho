# つなぎ帳

スマホと外付けマイクの接続・設定を、根拠と一緒に確認する購入支援サービス。購入者は無料、販売店には問い合わせ対応の削減を価値として月額課金する事業仮説を検証します。

2026-09-05、ユーザーが事業化着手を承認。2026-09-06、承認された repo 公開化と banchi 接続を行い、**[無料の静的体験版](https://tsunagicho.banchi.app/)を GitHub Pages で公開しました**。[公開記録](docs/release.md)に配備 revision と検証結果を残しています。公式資料に基づくガイドであり、実機確認、顧客試用、売上、支払意思は未検証。サービス名は作業名です。

- [GitHub](https://github.com/satoki252595/tsunagicho) / [公開作業 Issue #3](https://github.com/satoki252595/tsunagicho/issues/3)
- 専用フォルダ: `/Users/satoki252595/projects/tsunagicho/`
- [事業・検証計画](docs/business.md) / [採用前の調査記録](docs/research.md) / [検証・公開記録](docs/release.md)

## 体験する

[購入者向け](https://tsunagicho.banchi.app/) / [販売店向けの事業仮説・デモ](https://tsunagicho.banchi.app/shops.html)。登録・決済はありません。

ローカルで動かす場合:

```sh
nix develop -c env WRANGLER_SEND_METRICS=false wrangler dev --local --ip 127.0.0.1 --port 8789
```

[購入者向け](http://127.0.0.1:8789) / [販売店向け](http://127.0.0.1:8789/shops.html)。このMac内だけで開けます。

1. スマホの端子、マイク、接続方法、アプリを選ぶか、用途カードを押す。
2. 接続経路・確認手順・公式出典を読む。「未確認」「案内対象外」「資料再確認が必要」を区別する。
3. 組み合わせをブラウザに保存し、相談用メモをダウンロードする。条件を変えると古い結果を消し、保存した条件も開くたびに再判定する。
4. 販売店ページで削減時間の仮計算、商品ページへの埋め込みデモ、未送信の試用提案、未審査の実機確認メモ出力を試す。

## 対象とデータ

初代DJI Mic Mini、RØDE Wireless Microの5種類の接続ガイド。機種を網羅する互換DBではありません。入力の組み合わせは128通りですが、未収録の条件を対応済みにはしません。

`public/catalog.mjs` が選択肢、公式出典、確認日、接続ガイドと判断の正本。5ガイドは「RØDE Direct Connect」「Lightning受信機→USB-C iPhone」「USB-C受信機→Lightning iPhone」「DJIのBluetooth配信」「DJI受信機経由」。すべて実機確認日nullです。本文は少量の事実要約と独自の確認手順で、メーカー画像・説明文の転載はしていません。

ガイドの再確認期限は30日後を仮運用ルールにしています。期限切れで案内を確定情報として表示せず、元の資料へ戻します。端子分類だけで個別機種の適合を推測しません。投稿者の結果を自動で公開・実証済みに昇格させません。

## 開発・検証

```sh
nix develop -c node --test tests/*.test.mjs
nix develop -c node --check public/app.mjs
nix develop -c env WRANGLER_SEND_METRICS=false wrangler deploy --dry-run
```

HTML/CSS/JavaScriptとNode標準テストのみ。フロントの追加依存・ビルド工程はありません。WranglerとNodeはNixで固定。Webサイトの配信対象は`public/`のみです。GitHub repo 自体はユーザー承認により文書と履歴を含めて公開しているため、企画・検証記録も GitHub 上では閲覧できます。秘密情報・顧客個人情報は保存しません。Cloudflareの実行コード・DB・AI・決済・定期処理・外部分析ツールはありません。

Nixのworkerdが対応する最新日付に合わせ、互換日付は2026-09-01。初回の2026-09-05ではローカル起動が失敗したため変更しました。Nixパッケージ内のテンプレート由来のtsconfig警告は記録し、実アプリの失敗と区別します。

追加費用0円、公開前確認、定期実行なし。[Pages workflow](.github/workflows/pages.yml) は main ブランチからの手動実行専用で、通常の push ではデプロイしません。公式 Actions の commit SHA を固定し、アップロード対象を `public/` に限定しています。公開時の revision と DNS/HTTPS は[公開記録](docs/release.md)に残します。開発中の検証メモは`.runtime/`等に置き、`.env*`、`.dev.vars*`、秘密鍵、顧客個人情報をコミットしません。
