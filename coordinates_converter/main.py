import logging
import os
import shutil
from typing import Union
from uuid import uuid4

import geopandas as gpd
import pygltflib
from fastapi import FastAPI, HTTPException, UploadFile
from gltf import gltf_transform
from pyproj.exceptions import CRSError
from starlette.background import BackgroundTask
from starlette.responses import FileResponse
from pyproj import CRS, Transformer

app = FastAPI()
logger = logging.getLogger("uvicorn.error")


def convert_gdf(gdf, crsTarget, crsSource, filename):
    if not crsTarget:
        logger("No target crs provided, using EPSG:4326 as fallback")
        crsTarget = "EPSG:4326"

    source_filename = filename.split(".")[0]
    converted_filename = (
        f"{source_filename}_{crsTarget.replace(':', '').lower()}_{uuid4()}"
    )

    if gdf.crs is None:
        logger.info("No CRS found in the input file, using crsSource if provided")
        if not crsSource:
            raise HTTPException(
                status_code=400,
                detail="No CRS found in the input file and no crsSource provided",
            )
        try:
            gdf.crs = crsSource
        except CRSError as e:
            logger.error(e)
            raise HTTPException(
                status_code=400, detail=f"Invalid source CRS: {crsSource}"
            )
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
    file: UploadFile, crsTarget: str, crsSource: Union[str, None] = None
):

    gdf_converted, converted_filename = convert_gdf(
        gpd.read_file(file.file), crsTarget, crsSource, file.filename
    )

    converted_geojson = f"{converted_filename}.geojson"
    gdf_converted.to_file(converted_geojson, driver="GeoJSON")

    def cleanup():
        logger.info("Cleaning up")
        os.remove(converted_geojson)

    return FileResponse(
        converted_geojson,
        media_type="application/octet-stream",
        filename=converted_geojson,
        background=BackgroundTask(cleanup),
    )


@app.post("/convert_shapefile")
async def convert_shapefile(
    file: UploadFile, crsTarget: str, crsSource: Union[str, None] = None
):

    gdf_converted, converted_filename = convert_gdf(
        gpd.read_file(file.file), crsTarget, crsSource, file.filename
    )

    logger.info(f"Saving converted shapefile to {converted_filename}")
    gdf_converted.to_file(converted_filename)
    shutil.make_archive(converted_filename, "zip", converted_filename)
    converted_shapefile_archive = f"{converted_filename}.zip"

    def cleanup():
        logger.info("Cleaning up")
        shutil.rmtree(converted_filename)
        os.remove(converted_shapefile_archive)

    return FileResponse(
        converted_shapefile_archive,
        media_type="application/octet-stream",
        filename=converted_shapefile_archive,
        background=BackgroundTask(cleanup),
    )


@app.post("/convert_gltf")
async def convert_gltf(file: UploadFile, crsTarget: str, crsSource: str):
    # logger.info(f"Converting {file.filename} from {crsSource} to {crsTarget}")
    name, suffix = file.filename.split(".")
    input_name = f"{name}_{uuid4()}.gltf"

    transformer = Transformer.from_crs(
        CRS.from_string(crsSource), CRS.from_string(crsTarget)
    )

    if suffix != "glb":
        with open(input_name, "w") as input_file:
            input_file.write(file.file.read().decode("utf-8"))
    else:
        with open(input_name, "wb") as input_file:
            input_file.write(file.file.read())

    gltf = (
        pygltflib.GLTF2().load(input_name)
        if suffix != "glb"
        else pygltflib.GLTF2().load_binary(input_name)
    )
    gltf_output = gltf_transform(gltf, transformer)

    output_name = f"out_{input_name}"
    gltf_output.save(output_name)

    def cleanup():
        logger.info("Cleaning up")
        os.remove(input_name)
        os.remove(output_name)

    return FileResponse(
        output_name,
        media_type="application/octet-stream",
        filename=output_name,
        background=BackgroundTask(cleanup),
    )
