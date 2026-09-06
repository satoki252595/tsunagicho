# ローカル検証と公開記録

## 2026-09-06: GitHub Pages / banchi の公開準備

関連: [Issue #3](https://github.com/satoki252595/tsunagicho/issues/3)。準備ブランチは `codex/github-pages-preparation`。この節の記入時点では、repo 公開化・Pages 有効化・本番配備は未実施。

ユーザーは `tsunagicho.banchi.app` から無料の静的体験版を公開し、実動作を検証することを依頼した。この private repo の GitHub Pages 設定で「Upgrade or make this repository public to enable Pages」と表示されることを読み取り確認。その後、GitHub Pages を使うため repo 自体を公開化し、`.env` 等は ignore する方針をユーザーが明示承認した。プランのアップグレード・追加課金は行わない。

### 公開範囲と機能

Web サイトは `public/` のみ。GitHub repo 自体はコード・企画・調査・検証記録・履歴を含めて公開する。 `.env*`、`.dev.vars*`、秘密鍵、ローカル実行記録等は `.gitignore` で除外する。ignore は既存履歴を消すものではないため、公開化前に履歴も別途監査した。

今回公開するのは無料のプロジェクト体験版で、登録・申込受付・決済・顧客データの収集サーバー・AI API・外部解析・DB はない。選択条件はブラウザに最大12件保存し、検証メモは端末で出力する。月額4,980円は将来の店舗サービスに関する事業仮説で、体験版の利用料金や販売中の契約ではない。実機確認・顧客試用・売上・削減効果は未検証のまま。

共有リンクには選択条件が含まれる。リンクを開くと URL とアクセス情報が GitHub Pages に送信されるため、「一切のデータが外部に出ない」とは案内しない。公開ページに配信先・ローカル保存・リンク共有・公開 Issue 投稿の取り扱いを記載した。不具合・改善提案の窓口は、この repo の公開 Issues。氏名・連絡先・注文番号・顧客情報・秘密情報を投稿しないよう案内し、店舗契約の申込窓口とは扱わない。正式な事業者名・事業用連絡先を推測して掲載していない。

### 公開前の監査と検証

- 全2コミット・18個の履歴 blob、作業中ファイル、Issues #1〜#3（コメント0件）を読み取り確認。追跡済み `.env` / `.dev.vars` / 秘密鍵ファイル、既知形式の GitHub・Stripe・AWS キー、秘密値の代入、メールアドレス・携帯番号の検出は0。コード・設定・文書も読み、履歴の書き換えを要する秘密情報は見つからなかった。これは将来の追加ファイルまで保証するものではない。
- `nix develop -c node --test tests/*.test.mjs`: 6テスト成功。既存の128条件・未知/不正/期限切れ・費用計算に加え、共有 URL のコピー成功、Clipboard の拒否・API 非対応時の内容表示、フォーカス/全選択、保存リンク、ダイアログ終了を確認。
- `nix develop -c actionlint .github/workflows/pages.yml`: 成功。Actionlint はプロジェクトの Nix 環境に追加し、グローバルインストールは行っていない。`.env` / `.env.production` / `.dev.vars` / 秘密鍵 / `.npmrc` / `.runtime` の ignore と `git diff --check` も確認。
- `127.0.0.1:8793` の `public/` だけを Python で配信し、Cloudflare のレスポンスヘッダーがない状態で実ブラウザ確認。用途カード→結果・共有リンク/確認メモのコピー成功表示・公開向け文言・店舗の同一サイト内 iframe・問い合わせ注記を確認。検査時の console error/warn は0。OS のクリップボード内容の取得・ファイル保存完了は、この確認では成功済みと扱わない。
- 同じローカル配信で HTML 2ページ・CSS・JS 2ファイルの200と MIME、AGENTS/docs/.git/.env/未知パスの404を確認。両HTMLで CSP meta が CSS/JS より前にあり、`connect-src 'none'` / `form-action 'none'` と no-referrer が設定されることを確認した。

### 配備設定

`.github/workflows/pages.yml` は main からの `workflow_dispatch` だけを受け付ける。通常の push は配備を起動しない。Pages の自動有効化は `enablement: false`、権限は `contents: read` / `pages: write` / `id-token: write`、Git 資格情報の永続化は無効。アップロード先は `public/`、artifact 保持は1日、隠しファイルは含めない。フロントのビルド工程がないので Nix で検証後に静的ファイルをそのままアップロードする。

2026-09-06、公式リリースと tag の commit SHA、実際の `action.yml` を確認して固定した。

| Action | Version | Commit SHA |
|---|---|---|
| [checkout](https://github.com/actions/checkout/releases/tag/v7.0.1) | v7.0.1 | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| [configure-pages](https://github.com/actions/configure-pages/releases/tag/v6.0.0) | v6.0.0 | `45bfe0192ca1faeb007ade9deae92b16b8254a0d` |
| [upload-pages-artifact](https://github.com/actions/upload-pages-artifact/releases/tag/v5.0.0) | v5.0.0 | `fc324d3547104276b827a68afc52ff2a11cc49c9` |
| [deploy-pages](https://github.com/actions/deploy-pages/releases/tag/v5.0.1) | v5.0.1 | `368f82528645a54fb793d4d04e342629a3f51346` |

根拠: [GitHub Pages の公式 workflow 手順](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。同資料の例は旧版を含むため、採用版の現行リリースと Node 24 対応も一次情報で照合した。

### 静的ホスト間の差分

Cloudflare の `public/_headers` は GitHub Pages のヘッダー設定にはならない。HTML 2ページに CSP meta と `referrer=no-referrer` を追加し、外部スクリプト・外部接続・フォームの外部送信・埋め込みオブジェクトを制限する。CSP は stylesheet/module より前に置く。既存 robots meta と robots.txt の noindex/no-follow を維持する。

`frame-ancestors`、Permissions-Policy、X-Content-Type-Options、Cache-Control 等のレスポンスヘッダーは、この meta で設定できたとは扱わない。公開レスポンスで確認し、ホストの既定値との差分として記録する。アカウント・決済・音声入力等はなく、正式な外部店舗サイトへの埋め込みは今回行わない。[CSP と meta の制約](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy)、[Clipboard の利用条件](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)

### 公開時の順序と実動作確認

1. 最終差分・履歴・Issues の秘密情報監査を確認し、承認された repo 公開化を行う。Pages の Source は GitHub Actions とする。
2. 確認済み commit を main に置き、Pages 側の custom domain に `tsunagicho.banchi.app` を登録する。DNS を先に GitHub へ向けない。
3. banchi で取得した当該住所の GitHub Pages 設定から root の向き先を `satoki252595.github.io` にする。確認 TXT がある場合は GitHub の実際の値を使用する。ユーザー名は `satoki252595`。GitHub アカウントでドメイン確認を完了し、TXT は維持する。
4. main の手動 workflow を実行。Actions 配信では `CNAME` ファイルは不要。DNS/CNAME、Pages 配備 revision、HTTPS 証明書を確認し、HTTPS 強制を有効にする。
5. `https://tsunagicho.banchi.app/` と `shops.html`、CSS/JS/module の status と MIME を確認。AGENTS/docs/.git/.env/未知パスがサイトから配信されないことを確認する。
6. 検索→結果→条件変更→未知条件、保存→再読込→削除、共有リンクの復元、メモ表示/コピー/保存、店舗 iframe/試算、モバイル・キーボードを実ドメインで確認する。コードや接続ガイドの実機音声試験を実施したとは扱わない。

根拠: [GitHub の custom domain 設定](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)、[所有確認](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)。DNS・証明書反映には最大24時間かかる場合がある。CNAME は repo 名を含めず `satoki252595.github.io` に向け、banchi の DNS-only 設定を使う。

GitHub Pages の用途は無料プロジェクト体験版の展示として扱う。将来の店舗向け商用サービス本体や取引を主目的とする用途へ変える前に配信先を見直す。[Pages の用途・利用制限](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

公開後にこの節へ実際の commit / workflow run / DNS / HTTPS / ブラウザ検証結果を追記する。取り下げる場合は先に banchi 側を待機ページへ戻し、GitHub を向いたままの DNS を残さない。GitHub の custom domain・Pages を後から解除する。既存版に戻す場合は確認済みの前版を再配備し、repo を公開した事実や第三者が取得したコピーを取り消せるとは扱わない。

## 2026-09-05: ローカル検証（当時の記録）

確認日: 2026-09-05。公開・本番変更・顧客連絡・課金開始は未実施。

## 今回の変更

購入者向けの接続ガイドと保存・メモ出力、販売店向けの料金仮説・埋め込みデモ・試用提案・未審査の検証メモを作成。企画と調査を専用repoへ引き継いだ。実機確認と有償の需要は未検証。

ローカル画面: [購入者向け](http://127.0.0.1:8789/) / [販売店向け](http://127.0.0.1:8789/shops.html)。停止後の再開方法はREADME。

## 実施した検証

| 確認 | 結果 |
|---|---|
| `nix develop -c node --test tests/*.test.mjs` | 5テスト成功。128の選択条件、対象外のアプリ/OS、未知・不正・期限切れ、変換方向による根拠の違い、費用計算の境界を確認 |
| `nix develop -c node --check public/app.mjs` | 成功 |
| `nix develop -c env WRANGLER_SEND_METRICS=false wrangler deploy --dry-run` | 成功。配信対象7ファイル、bindingsなし。アップロード/公開なし |
| ローカルHTTP | 画面・JS・CSSの5パスで200とCSP等のヘッダー確認。AGENTS、docs、Git設定、env、未知パスの5パスは404 |
| 通常幅のブラウザ操作 | 用途カード→結果、公式出典、保存→再読込で復元、条件変更で旧結果非表示、未知マイク、Direct Connectと標準カメラの対象外表示を確認 |
| キーボード | Enterで検索・ダイアログの閉じる操作を確認。ネイティブselect、label、結果見出しへのフォーカスを使用 |
| モバイル幅 | ビューポート375×812（スクロールバーを除く本文幅360px）で購入者トップ・結果・店舗画面を確認。documentのscrollWidthとclientWidthが360で横はみ出しなし。終了前に幅の上書きを解除 |
| 店舗ページ | 問い合わせ0件で0円、仮価格との差が負になる表示、同一サイト内の埋め込みガイドを確認 |
| 出力内容 | 確認メモと試用提案のダイアログ表示・コピー成功。架空と明記したQAデータで、検証メモがprivate-draft、未審査、結果unknown、共有許諾not-grantedになることを確認。空白だけの入力を拒否 |
| Git | private repoを確認。自動公開の連携なし。差分の空白チェック成功 |

保存の試験で作った組み合わせはUIから削除済み。QA用検証メモや個人情報はGitに保存していない。

## 制限と対処

- 最初は互換日付2026-09-05でローカル起動失敗。Nixのworkerdの対応日2026-09-01に合わせ、同じ構成で起動を確認した。実行コードや新しいAPI機能は使わない。
- NixのWranglerパッケージ内部からtsconfigテンプレートの参照警告が出る。静的アセット配信・構文検査・dry-runは成功。依存をグローバル追加して消していない。
- アプリ内ブラウザで最初の自動ダウンロードの完了イベントを取得できなかった。出力をネイティブdialogで確認し、保存リンクまたはコピーを選べる形に変更。コピーは検証済み。ファイル保存のOS側の完了は未検証であり、成功済みとは扱わない。
- 画面のコンソール取得には出典URLのないMutationObserverエラー1件が含まれた。配信したアプリにMutationObserver呼び出しはなく、アプリ由来かは特定していない。該当時刻後も主要導線が動くことを確認したが、コンソールエラー0とは記録しない。
- 実機による音声入力・機種適合・継続課金意思・問い合わせ削減は未検証。正式な店舗への外部埋め込み、顧客対応、決済、データのオンライン共有も未実装。

## 公開する場合の範囲と費用

候補は同じ`public/`の静的体験版をCloudflare Workers Static Assetsで配信すること。独自ドメイン購入なし、DB・AI API・実行コード・決済・有料オプションなし。GitHubのソースと企画資料はprivateのまま。

Cloudflare公式は静的アセットのリクエストを無料・無制限、保存の追加費用なしと説明する。Worker実行へのリクエストは別課金だが、この構成は実行コードやrun_worker_firstを持たない。追加費用0円の条件に合わせた候補。[公式料金](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)、[静的配信の構成](https://developers.cloudflare.com/workers/static-assets/)、[ヘッダー](https://developers.cloudflare.com/workers/static-assets/headers/)

公開時に確認する内容: 対象commit、Cloudflareアカウントと公開先、作業名を体験版名として使うこと、運営主体と問い合わせ案内。ファイル保存に依存しないコピー導線を含む体験版として提示する。noindexは検索除外の依頼であり、アクセス制限ではない。

公開の明示許可後だけ、対象commitを確認し`nix develop -c env WRANGLER_SEND_METRICS=false wrangler deploy`を実行する。本番URL・検証対象SHA・公開結果を追記する。顧客への連絡・販売店への設置・実決済はこの静的体験版の公開許可には含めない。

## 戻し方

初公開前なので既存利用者・本番データへの影響はない。初公開が不適切なら、この新規Workerだけを停止/削除する候補を示す。更新時は公開前の版IDを記録し、ユーザーが許可した範囲でその版へ戻す。サーバー側データや決済はないためDB復元は不要。利用者のブラウザ保存はデプロイで変更しない。
