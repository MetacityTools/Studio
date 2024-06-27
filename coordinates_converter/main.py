import geopandas as gpd
import logging
import os
import shutil
from fastapi import FastAPI, UploadFile, HTTPException
from pyproj.exceptions import CRSError
from starlette.background import BackgroundTask
from starlette.responses import FileResponse
from typing import Union
from uuid import uuid4

app = FastAPI()
logger = logging.getLogger('uvicorn.error')

def convert_gdf(gdf, crsTarget, crsSource, filename):
    if not crsTarget:
        logger("No target crs provided, using EPSG:4326 as fallback")
        crsTarget = "EPSG:4326"

    source_filename = filename.split(".")[0]
    converted_filename = f"{source_filename}_{crsTarget.replace(':', '').lower()}_{uuid4()}"

    if gdf.crs is None:
        logger.info("No CRS found in the input file, using crsSource if provided")
        if not crsSource:
            raise HTTPException(status_code=400, detail="No CRS found in the input file and no crsSource provided")        
        try:
            gdf.crs = crsSource
        except CRSError as e:
            logger.error(e)
            raise HTTPException(status_code=400, detail=f"Invalid source CRS: {crsSource}")
    else:
        logger.info(f"Input file has CRS: {gdf.crs}")
    try:
        gdf_converted = gdf.to_crs(crsTarget)
    except CRSError as e:
        logger.error(e)
        raise HTTPException(status_code=400, detail=f"Invalid target CRS: {crsSource}")
    return gdf_converted, converted_filename

@app.post("/convert_geojson")
async def convert_geojson(
    file: UploadFile, 
    crsTarget: Union[str, None] = None, 
    crsSource: Union[str, None] = None):

    gdf_converted, converted_filename = convert_gdf(
        gpd.read_file(file.file), 
        crsTarget, 
        crsSource, 
        file.filename)
    
    converted_geojson = f"{converted_filename}.geojson"   
    gdf_converted.to_file(converted_geojson, driver="GeoJSON")

    def cleanup():
        logger.info("Cleaning up")
        os.remove(converted_geojson)

    return FileResponse(
        converted_geojson, 
        media_type="application/octet-stream", 
        filename=converted_geojson,
        background=BackgroundTask(cleanup))


@app.post("/convert_shapefile")
async def convert_shapefile(
    file: UploadFile, 
    crsTarget: Union[str, None] = None, 
    crsSource: Union[str, None] = None):

    gdf_converted, converted_filename = convert_gdf(
        gpd.read_file(file.file), 
        crsTarget, 
        crsSource, 
        file.filename)
    
    logger.info(f"Saving converted shapefile to {converted_filename}")
    gdf_converted.to_file(converted_filename)
    shutil.make_archive(converted_filename, 'zip', converted_filename)
    converted_shapefile_archive = f"{converted_filename}.zip"


    def cleanup():
        logger.info("Cleaning up")
        shutil.rmtree(converted_filename)
        os.remove(converted_shapefile_archive)

    return FileResponse(
        converted_shapefile_archive, 
        media_type="application/octet-stream", 
        filename=converted_shapefile_archive,
        background=BackgroundTask(cleanup))