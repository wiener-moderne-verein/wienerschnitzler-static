# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website generator for "Wiener Schnitzler – Schnitzlers Wien", a digital humanities project that transforms TEI-XML data into a static HTML website using XSLT transformations and Apache Ant build automation.

## Core Architecture

- **Build System**: Apache Ant (`build.xml`) orchestrates XSLT transformations
- **Data Source**: TEI-XML files fetched from external repository via `fetch_data.sh`
- **Transformations**: XSLT stylesheets in `xslt/` directory convert XML to HTML
- **Output**: Static HTML files generated in `html/` directory
- **Search**: TypeSense search integration via `make_ts_index.py`

## Essential Commands

### Initial Setup (one-time)
```bash
./shellscripts/dl_saxon.sh  # Download Saxon XSLT processor
./fetch_data.sh             # Fetch TEI-XML data from remote repository
ant                         # Build all HTML files
```

### Development Workflow
```bash
./fetch_data.sh    # Update data from remote repository
ant                # Rebuild HTML files after data or XSLT changes
cd html/           # Navigate to output directory
python -m http.server  # Start development server at http://0.0.0.0:8000/
```

### Search Index
```bash
python make_ts_index.py  # Generate TypeSense search index (requires Python dependencies)
```

### Deployment
Use GitHub Actions workflow at `.github/workflows/build.yml` or run manually:
```bash
docker build -t wienerschnitzler-static .
docker run -p 80:80 --rm --name wienerschnitzler-static wienerschnitzler-static
```

## Data Structure

- `data/editions/`: TEI-XML source files organized by type
- `data/indices/`: Index files (listplace.xml, etc.)
- `data/meta/`: Metadata files for site content
- `xslt/`: XSLT transformation stylesheets
- `xslt/partials/`: Reusable XSLT components
- `html/`: Generated static HTML output

## Key Files

- `build.xml`: Ant build configuration defining all XSLT transformations
- `fetch_data.sh`: Script to download latest data from GitHub repository
- `make_ts_index.py`: Python script for search index generation
- `requirements.txt`: Python dependencies for search functionality
- `nginx.conf`: Production web server configuration

## XSLT Development

The XSLT stylesheets follow a modular architecture:
- Main transformation files in `xslt/` root
- Shared templates and functions in `xslt/partials/`
- Saxon HE 9 is the required XSLT processor

## Important Notes

- Always run `./fetch_data.sh` before building to ensure latest data
- The build process cleans existing HTML files before regeneration
- Search functionality requires Python dependencies from `requirements.txt`
- TEI namespace handling is automated in the build process