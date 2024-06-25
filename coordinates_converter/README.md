# Metacity Studio Coordinates Converter Utility

## How to install
* `python get_pip.py` if no pip :'(
* `pip install -r requirements.txt` to install dependencies

## How to run
* `fastapi dev main.py` to run on localhost

## How to use (Shapefile)
* example curl - shapefile with projection:
  * `curl -F "file=@shapefile.zip" -X POST http://localhost:8000/uploadfile?crsTarget=EPSG:4326`
* example curl - shapefile without projection:
  * `curl -F "file=@shapefile_noproj.zip" -X POST 'http://localhost:8000/convert_shapefile?crsTarget=EPSG:4326&crsSource=EPSG:5514'`
* `file` - zipped shapefile
* `crsTarget` - EPSG code of coordinate system to convert to
* `crsSource` - EPSGE code of initial coordinate system (if shapefile doesn't contain projection info)