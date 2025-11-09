#!/bin/bash
set -e

echo "downloading saxon"
mkdir -p saxon

# Try Maven Central first (more reliable for CI/CD)
if curl -f -L -o saxon/saxon9he.jar https://repo1.maven.org/maven2/net/sf/saxon/Saxon-HE/9.9.1-7/Saxon-HE-9.9.1-7.jar; then
    echo "Saxon downloaded successfully from Maven Central"
else
    echo "Maven Central failed, trying SourceForge..."
    curl -L -o download https://sourceforge.net/projects/saxon/files/Saxon-HE/9.9/SaxonHE9-9-1-7J.zip/download

    # Check if we got a valid ZIP file
    if file download | grep -q "Zip archive"; then
        unzip -o download -d saxon
        rm -rf download
    else
        echo "ERROR: Failed to download valid ZIP file from SourceForge"
        rm -f download
        exit 1
    fi
fi

echo "Saxon installation complete"
ls -la saxon/