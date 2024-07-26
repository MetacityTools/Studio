# Test file for shapefile conversion

from fastapi.testclient import TestClient
import os
from .. import main

client = TestClient(main.app)

testdata_dir = os.path.join(os.path.dirname(__file__), "../../testdata")


def test_shapefile_with_projection_correct():
    with open(os.path.join(testdata_dir,"shapefile_5514.zip"), "rb") as f:
        response = client.post(
            "/convert_shapefile?crsTarget=EPSG:4326", files={"file": f}
        )
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/octet-stream"
        assert (
            response.headers["content-disposition"]
            == 'attachment; filename="shapefile_5514_epsg4326.zip"'
        )


def test_shapefile_with_projection_wrong_target():
    with open(os.path.join(testdata_dir,"shapefile_5514.zip"), "rb") as f:
        response = client.post("/convert_shapefile?crsTarget=foobar", files={"file": f})
        assert response.status_code == 400
        assert response.json() == {"detail": "Invalid target CRS: foobar"}


def test_shapefile_without_projection_no_source():
    with open(os.path.join(testdata_dir,"shapefile_noproj.zip"), "rb") as f:
        response = client.post(
            "/convert_shapefile?crsTarget=EPSG:4326", files={"file": f}
        )
        assert response.status_code == 400
        assert response.json() == {
            "detail": "No CRS found in the input file and no crsSource provided"
        }


def test_shapefile_without_projection_wrong_source():
    with open(os.path.join(testdata_dir,"shapefile_noproj.zip"), "rb") as f:
        response = client.post(
            "/convert_shapefile?crsTarget=EPSG:4326&crsSource=foobar", files={"file": f}
        )
        assert response.status_code == 400
        assert response.json() == {"detail": "Invalid source CRS: foobar"}


def test_shapefile_without_projection_correct():
    with open(os.path.join(testdata_dir,"shapefile_noproj.zip"), "rb") as f:
        response = client.post(
            "/convert_shapefile?crsTarget=EPSG:4326&crsSource=EPSG:5514",
            files={"file": f},
        )
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/octet-stream"
        assert (
            response.headers["content-disposition"]
            == 'attachment; filename="shapefile_noproj_epsg4326.zip"'
        )
