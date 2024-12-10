# bin/bash

echo "fetching from data_repo"
rm -rf data/
curl -LO https://github.com/wiener-moderne-verein/wienerschnitzler-data/archive/refs/heads/main.zip
unzip main

mv ./wienerschnitzler-data-main/data/ .

rm main.zip
rm -rf ./wienerschnitzler-data-main
