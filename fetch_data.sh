# bin/bash

echo "fetching from data_repo (branch: data)"
rm -rf data/
curl -LO https://github.com/wiener-moderne-verein/wienerschnitzler-data/archive/refs/heads/data.zip
unzip data.zip

mv ./wienerschnitzler-data-data/data/ .

rm data.zip
rm -rf ./wienerschnitzler-data-data
