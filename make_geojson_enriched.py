"""
Generates enriched local GeoJSON files by adding a 'hierarchy' property
to each FeatureCollection from wienerschnitzler_complete_nested.xml.

Output: html/geojson/YYYY-MM-DD.geojson for each daily event.
The JavaScript fetches these local files instead of the GitHub raw GeoJSON.

Run after fetch_data.sh and ant:
    python make_geojson_enriched.py
"""

import xml.etree.ElementTree as ET
import json
import os
import re
import glob

NS = '{http://www.tei-c.org/ns/1.0}'
DAILY_DATE_RE = re.compile(r'^\d{4}-\d{2}-\d{2}$')


def normalize_id(corresp_id):
    """Convert #pmb50 or #52 to pmb50 or pmb52."""
    id_clean = corresp_id.lstrip('#')
    if id_clean and not id_clean.startswith('pmb') and id_clean.isdigit():
        return 'pmb' + id_clean
    return id_clean


def parse_places(list_place_el):
    """Recursively parse a listPlace element into a list of dicts."""
    places = []
    for place_el in list_place_el.findall(f'{NS}place'):
        corresp = place_el.get('corresp', '')
        place_id = normalize_id(corresp)
        name_el = place_el.find(f'{NS}placeName')
        name = name_el.text.strip() if name_el is not None and name_el.text else ''
        children_el = place_el.find(f'{NS}listPlace')
        children = parse_places(children_el) if children_el is not None else []
        places.append({'id': place_id, 'name': name, 'children': children})
    return places


def main():
    xml_path = 'data/editions/xml/wienerschnitzler_complete_nested.xml'
    geojson_dir = 'data/editions/geojson'
    output_dir = 'html/geojson'
    os.makedirs(output_dir, exist_ok=True)

    print(f'Parsing {xml_path} ...')
    tree = ET.parse(xml_path)
    root = tree.getroot()

    # Build a dict: date -> hierarchy
    hierarchy_by_date = {}
    for event in root.iter(f'{NS}event'):
        when = event.get('when', '')
        if not DAILY_DATE_RE.match(when):
            continue
        list_place = event.find(f'{NS}listPlace')
        if list_place is None:
            continue
        hierarchy_by_date[when] = parse_places(list_place)

    print(f'Found {len(hierarchy_by_date)} daily events in XML.')

    count = 0
    missing_geojson = 0
    for date, hierarchy in hierarchy_by_date.items():
        geojson_path = os.path.join(geojson_dir, f'{date}.geojson')
        if not os.path.exists(geojson_path):
            missing_geojson += 1
            # Create a minimal GeoJSON with only hierarchy, no features
            geojson_data = {
                'type': 'FeatureCollection',
                'hierarchy': hierarchy,
                'features': []
            }
        else:
            with open(geojson_path, 'r', encoding='utf-8') as f:
                geojson_data = json.load(f)
            geojson_data['hierarchy'] = hierarchy

        output_file = os.path.join(output_dir, f'{date}.geojson')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(geojson_data, f, ensure_ascii=False, separators=(',', ':'))
        count += 1

    print(f'Done! Generated {count} enriched GeoJSON files in {output_dir}/')
    if missing_geojson:
        print(f'  ({missing_geojson} dates had no source GeoJSON, created minimal files)')


if __name__ == '__main__':
    main()
