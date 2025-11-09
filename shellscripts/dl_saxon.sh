#!/bin/bash
echo "downloading saxon"
curl -LO https://sourceforge.net/projects/saxon/files/Saxon-HE/9.9/SaxonHE9-9-1-7J.zip/download
mkdir -p saxon
unzip -o download -d saxon
rm -rf download
echo "Saxon downloaded and extracted successfully"
ls -la saxon/