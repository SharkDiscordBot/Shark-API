# config file

このドキュメントではconfigの作成方法を取り扱います

## configファイルの生成

### macOS,Linux全般

ターミナルで下記のコマンドを実行します
```sh
cp configs/config-sample.json configs/config.json

# ファイルを安全に保つためにパーミッションを設定してください
chmod 600 configs/config.json
```

# 設定項目

## server

| key | Type | 説明 |
| ---- | ---- | ------ |
| port | Number | APIサーバーのポート番号を指定します |
| mongodb_url | String | MongoDBのURLを指定します * ここで指定したデータベースにユーザー情報などが書き込まれます |

### ssl

| key | Type | 説明 |
| ---- | ---- | ------ |
| enable | Boolen | HTTPSサーバーの起動有無を切り替えます |
| key_path | String | 証明書ファイルのパスを設定します |
| cert_path | String | 証明書ファイルのパスを設定します |
| ssl_port | number | SSLサーバーのポートを設定します(上記で設定したポート番号と同じには設定できません)|

### auth

> ** WARNING: ** ここに設定する値は必ずランダムな文字を入力してください
>　また、この設定に使用した文字列は厳重に管理してください

| key | Type | 説明 |
| ---- | ---- | ------ |
| auth_id | String | APIのユーザーIDを設定します。英数字64文字以上を推奨します |
| auth_key | String | 暗号化キーを設定します。英数字32文字で入力してください |


## settings

| key | Type | 説明 |
| ---- | ---- | ------ |
| debug_mode | Boolen | デバッグモードの有効,無効を切り替えます |
| debug_logger | Boolen | この設定を有効にするとコンソールに詳細な出力を行います |

### check_status

| key | Type | 説明 |
| ---- | ---- | ------ |
| frontend_status_URL | String | フロントエンド([Shark-Frontend](https://github.com/SharkDiscordBot/Shark-Frontend)のステータス情報URLを指定します) ) |
| frontend_status_URL | String | ([Shark-Bot](https://github.com/SharkDiscordBot/Shark-Bot)のステータス情報URLを指定します) ) |
| enable | Boolen | この設定をfalseにするとステータスの参照を行いません(本番構成では有効にすることを推奨します) |
| enable | Boolen | この設定はステータスの参照を行わない場合のステータスを設定します(up, warn, downのいずれか　) |

## maintenance

| key | Type | 説明 |
| ---- | ---- | ------ |
| enable | Boolen | メンテナンスモードの有効,無効無効を切り替えます |
| res_status | Number | メンテナンスモード有効時に返却するhttpステータスコードを指定します |