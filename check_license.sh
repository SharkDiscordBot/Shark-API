#!/bin/bash

DISALLOW_LICENSES="GPL;GPL-2.0;GPL-3.0;LGPL;LGPL-3.0;AGPL;NGPL;MIT;"

result=0

npx license-checker --production --direct --json --failOn "$DISALLOW_LICENSES" >/dev/null || result=$?

if [[ ! "$result" = "0" ]]; then
  echo "エラー: 許容しないライセンスが含まれています"
  exit 1
fi

exit 0