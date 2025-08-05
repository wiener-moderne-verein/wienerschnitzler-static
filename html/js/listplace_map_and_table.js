function fetch_tabulatordata_and_build_table(
  map_cfg,
  map,
  table_cfg,
  markers
) {
  console.log("loading table");
  if (map_cfg.json_url.length !== 0) {
    fetch(map_cfg.json_url)
      .then(function (response) {
        // json string
        return response.json();
      })
      .then(function (tabulator_data) {
        // the table will draw all markers on to the empty map
        table_cfg.tabulator_cfg.data = tabulator_data;
        let table = build_map_table(table_cfg);
        populateMapFromTable(
          table,
          map,
          map_cfg.on_row_click_zoom,
          markers
        );
      })
      .catch(function (err) {
        console.log(err);
      });
  } else {
    let table = build_map_table(table_cfg);
    populateMapFromTable(
      table,
      map,
      map_cfg.on_row_click_zoom,
      markers
    );
  }
}

function zoom_to_point_from_row_data(
  row_data,
  map,
  zoom,
  existing_markers_by_coordinates
) {
  let coordinate_key = get_coordinate_key_from_row_data(row_data);
  let marker = existing_markers_by_coordinates[coordinate_key];
  marker.openPopup();
  map.flyTo([row_data.lat, row_data.lng], zoom);
}

function get_coordinate_key_from_row_data(row_data) {
  return row_data.lat + row_data.lng;
}

function init_map_from_rows(rows, markers) {
  console.log("populating map with icons");
  let existing_icons_by_coordinates = {};
  markers.clearLayers()
  rows.forEach((row) => {
    let row_data = row.getData();
    let coordinate_key = get_coordinate_key_from_row_data(row_data);
    var marker = L.marker(new L.LatLng(row_data.lat, row_data.lng), { title: row_data.Ortsname });
    marker.bindPopup(get_popup_label_string_html(row_data));
    markers.addLayer(marker);
    existing_icons_by_coordinates[coordinate_key] = marker;
  });
  return existing_icons_by_coordinates;
}

function toggle_marker_visibility(marker) {
  let opacity = marker.options.opacity;
  console.log(opacity)
  if (opacity === 1) {
    marker.setOpacity(0)
  } else {
    marker.setOpacity(1)
  }
}

function populateMapFromTable(
  table,
  map,
  on_row_click_zoom,
  markers
) {
  if (!table) {
    console.warn("Table is null, skipping table-map integration");
    return;
  }
  
  try {
    table.on("tableBuilt", function () {
      console.log("built table");
      // Use getData() to get all data, not just visible rows
      let all_data = this.getData();
      let all_rows = all_data.map(data => ({getData: () => data}));
      var existing_markers_by_coordinates = init_map_from_rows(
        all_rows,
        markers
      );
      
      table.on("dataFiltered", function (filters, rows) {
        try {
          // Show all filtered data on map, not just current page
          let filtered_data = this.getData("active");
          let filtered_rows = filtered_data.map(data => ({getData: () => data}));
          init_map_from_rows(filtered_rows, markers);
          if (markers.getLayers().length > 0) {
            map.fitBounds(markers.getBounds());
          }
        } catch (err) {
          console.error("Error in dataFiltered handler:", err);
        }
      });
      
      //eventlistener for click on row
      table.on("rowClick", function (event, row) {
        try {
          let row_data = row.getData();
          zoom_to_point_from_row_data(
            row_data,
            map,
            on_row_click_zoom,
            existing_markers_by_coordinates
          );
        } catch (err) {
          console.error("Error in rowClick handler:", err);
        }
      });
      
      try {
        if (markers.getLayers().length > 0) {
          map.fitBounds(markers.getBounds());
        }
      } catch (err) {
        console.error("Error fitting map bounds:", err);
      }
    });
  } catch (error) {
    console.error("Error setting up table event handlers:", error);
  }
}

function build_map_table(table_cfg) {
  try {
    let table = new Tabulator(
      table_cfg.table_div_html_id,
      table_cfg.tabulator_cfg
    );
    console.log("made table");
    return table;
  } catch (error) {
    console.error("Error creating Tabulator table:", error);
    // Fallback: Zeige die HTML-Tabelle an, falls Tabulator fehlschlägt
    const tableElement = document.querySelector(table_cfg.table_div_html_id);
    if (tableElement) {
      tableElement.style.display = 'table';
      console.log("Fallback: Using HTML table instead of Tabulator");
    }
    return null;
  }
}

/////////////////////
// building the map//
/////////////////////
function build_map_and_table(map_cfg, table_cfg, wms_cfg = null, tms_cfg = null) {
  try {
    console.log("loading map");
    
    // Check if map div exists
    const mapDiv = document.getElementById(map_cfg.div_id);
    if (!mapDiv) {
      console.error(`Map div with id '${map_cfg.div_id}' not found`);
      return;
    }
    
    let map = L.map(map_cfg.div_id).setView(
      map_cfg.initial_coordinates,
      map_cfg.initial_zoom
    );
    
    let tile_layer = L.tileLayer(map_cfg.base_map_url, {
      maxZoom: map_cfg.max_zoom,
      minZoom: map_cfg.min_zoom,
      attribution: map_cfg.attribution,
    });
    
    var markers = L.markerClusterGroup();
    let overlay_control = {};
    overlay_control[map_cfg.base_map_label] = tile_layer

    // handle the layers
    // order of adding matters!
    tile_layer.addTo(map);
    
    // if wms_cfg is provided wms map layer gets added
    if (wms_cfg !== null) {
      try {
        // this is for the page gui / switch for toggling overlays
        let wms_layer = L.tileLayer.wms(wms_cfg.wms_url, wms_cfg.layerOptions);
        wms_layer.addTo(map);
        overlay_control[wms_cfg.label] = wms_layer;
      } catch (wmsError) {
        console.error("Error adding WMS layer:", wmsError);
      }
    }

    // if tms_cfg is provided tms map layer gets added
    if (tms_cfg !== null) {
      try {
        // this is for the page gui / switch for toggling overlays
        let tms_layer = L.tileLayer('https://emt-project.github.io/mapserver/map_01/{z}/{x}/{y}.png', tms_cfg.layerOptions);
        tms_layer.addTo(map);
        overlay_control[tms_cfg.label] = tms_layer;
      } catch (tmsError) {
        console.error("Error adding TMS layer:", tmsError);
      }
    }
    
    // this has to happen here, in case historical map gets added
    L.control.layers(null, overlay_control).addTo(map);
    markers.addTo(map);

    fetch_tabulatordata_and_build_table(map_cfg, map, table_cfg, markers);
    
  } catch (error) {
    console.error("Error initializing map and table:", error);
    // Show user-friendly error message
    const mapDiv = document.getElementById(map_cfg.div_id);
    if (mapDiv) {
      mapDiv.innerHTML = '<div class="alert alert-warning">Karte konnte nicht geladen werden. Bitte versuchen Sie es später erneut.</div>';
    }
  }
}