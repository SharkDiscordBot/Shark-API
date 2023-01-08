# しゃーく API

しゃーくBotのAPIシステム
## Status

### develop

[![check code(Nodejs v18)](https://github.com/SharkDiscordBot/Shark-API/actions/workflows/check-v18.yml/badge.svg)](https://github.com/SharkDiscordBot/Shark-API/actions/workflows/check-v18.yml)
[![license check](https://github.com/SharkDiscordBot/Shark-API/actions/workflows/GPL_check.yaml/badge.svg)](https://github.com/SharkDiscordBot/Shark-API/actions/workflows/GPL_check.yaml)

### main

[![check code(Nodejs v18)](https://github.com/SharkDiscordBot/Shark-API/actions/workflows/check-v18.yml/badge.svg?branch=main)](https://github.com/SharkDiscordBot/Shark-API/actions/workflows/check-v18.yml)
[![license check](https://github.com/SharkDiscordBot/Shark-API/actions/workflows/GPL_check.yaml/badge.svg?branch=main)](https://github.com/SharkDiscordBot/Shark-API/actions/workflows/GPL_check.yaml)

## 前提要件

本プログラムは下記の要件で動作します。

- Nodejs(v18を推奨)
- Git

## 動作確認環境

下記の環境で動作確認を行っています

- MacOS 13.1 (Intel)
- kubernetes v1.26.0
- Nodejs v18.13.0

## 推奨動作確認

下記の環境での実行を推奨します

- 各Linuxディストリビューション
- MacOS
- WSL2 (Ubuntu)

### Windowsで本プログラムを実行される場合について

Windowsで実行される際はWSLを使用されることを推奨します。WSLを使用されない場合下記の制約が発生します

- APIサーバー内で測定するレイテンシが常に0msとなります(`/v1/systems/status` など)

## SSL(TLS)について

本APIサーバー運用時には暗号化通信を行うことを推奨します。 <br>
証明書はInit-SSL.shを実行することでcertkeysディレクトリに作成されます(Init-SSL.shを使用し証明書を作成する場合はSSl証明書のパスを変更する必要はありません)

## API Docs

### APIキーについて

初回起動時configに基づきAPIキーを生成しコンソールに出力します。APIキーを再発行場合configの`auth_id`を変更すると再生成されます。(その際には`auth_key`もなるべく変更してください)、再生成後DBにアクセスし、元のデータ(元のauth_idのデータ)を削除してください

### すべてのリクエストに対して返却されるデータ

| フィールド | Type | 説明 |
| ---- | ---- | ------ |
| status | String | 処理が成功したかどうかを返却します |
| time | String | 処理開始時刻を返却します |
| http_status  | Number | HTTPステータスコードを返却します |
| message | String | メッセージを返却します。返却する内容がない場合noneが返却されます |

### その他ドキュメント

APIサーバーを起動し `/docs` を確認するか `swagger.yaml` をSwaggerEditorなどでご確認ください

## 著作権情報

### パッケージ類

仮データ:
[JSON_DATA](./views/public/licenses.json)

表(データが巨大です):
[表示](./package-licenses.md)

### Shark-API
[MIT Licence](./LICENCE)

```
MIT Licence

Copyright (c) 2022 purapetino

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
```
