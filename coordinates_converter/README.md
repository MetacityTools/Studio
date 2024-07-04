# Metacity Studio Coordinates Converter Utility

## How to install

- `python get_pip.py` if no pip :'(
- `pip install -r requirements.txt` to install dependencies

## How to run

- `fastapi dev main.py` to run on localhost

## How to use (Shapefile)

- example curl - shapefile with projection:
  - `curl -F "file=@shapefile.zip" -X POST http://localhost:8000/convert_shapefile?crsTarget=EPSG:4326`
- example curl - shapefile without projection:
  - `curl -F "file=@shapefile_noproj.zip" -X POST 'http://localhost:8000/convert_shapefile?crsTarget=EPSG:4326&crsSource=EPSG:5514' --output result.zip`
- `file` - zipped shapefile
- `crsTarget` - EPSG code of coordinate system to convert to
- `crsSource` - EPSG code of initial coordinate system (if shapefile doesn't contain projection info)

## How to use (GeoJSON)

- example curl - GeoJSON with projection:
  - `curl -F "file=@data.geojson" -X POST http://localhost:8000/convert_geojson?crsTarget=EPSG:4326`
- example curl - GeoJSON without projection:
  - `curl -F "file=@data_noproj.geojson" -X POST 'http://localhost:8000/convert_geojson?crsTarget=EPSG:4326&crsSource=EPSG:5514' --output result.geojson`
- `file` - input geojson
- `crsTarget` - EPSG code of coordinate system to convert to
- `crsSource` - EPSG code of initial coordinate system (if geojson doesn't contain projection info)

## How to use (GLTF)

- example curl - GLTF:
  - `curl -F "file=@input.gltf" -X POST 'http://localhost:8000/convert_gltf?crsTarget=EPSG:5514&crsSource=EPSG:4326' --output result.gltf'`
- `file` - input gltf
- `crsTarget` - EPSG code of coordinate system to convert to
- `crsSource` - EPSG code of initial coordinate system
