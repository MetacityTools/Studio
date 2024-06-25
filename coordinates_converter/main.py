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

@app.post("/convert_shapefile")
async def create_upload_file(
    file: UploadFile, 
    crsTarget: Union[str, None] = None, 
    crsSource: Union[str, None] = None):

    if not crsTarget:
        logger("No target crs provided, using EPSG:4326 as fallback")
        crsTarget = "EPSG:4326"
    source_filename = file.filename.split(".")[0]

    gdf = gpd.read_file(file.file)
    if gdf.crs is None:
        logger.info("No CRS found in the input file, using crsSource if provided")
        if not crsSource:
            raise HTTPException(status_code=400, detail="No CRS found in the input file and no crsSource provided")        
        try:
            gdf.crs = crsSource
        except CRSError as e:
            logger.error(e)
            raise HTTPException(status_code=400, detail=f"Invalid source CRS: {crsSource}")
    try:
        gdf_converted = gdf.to_crs(crsTarget)
    except CRSError as e:
        logger.error(e)
        raise HTTPException(status_code=400, detail=f"Invalid target CRS: {crsSource}")
    
    converted_shapefile = f"{source_filename}_{crsTarget.replace(':', '').lower()}_{uuid4()}"
    logger.info(f"Saving converted shapefile to {converted_shapefile}")
    gdf_converted.to_file(converted_shapefile)
    shutil.make_archive(converted_shapefile, 'zip', converted_shapefile)

    converted_shapefile_archive = f"{converted_shapefile}.zip"

    def cleanup():
        shutil.rmtree(converted_shapefile)
        os.remove(converted_shapefile_archive)

    return FileResponse(
        converted_shapefile_archive, 
        media_type="application/octet-stream", 
        filename=converted_shapefile_archive,
        background=BackgroundTask(cleanup))