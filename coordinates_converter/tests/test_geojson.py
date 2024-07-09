# Test file for geojson conversion

from fastapi.testclient import TestClient
from .. import main

client = TestClient(main.app)


def test_geojson_correct():
    with open("./testdata/climate.geojson", "rb") as f:
        response = client.post(
            "/convert_geojson?crsTarget=EPSG:4326", files={"file": f}
        )
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/octet-stream"
        assert (
            response.headers["content-disposition"]
            == 'attachment; filename="climate_epsg4326.geojson"'
        )


def test_geojson_wrongt_target():
    with open("./testdata/climate.geojson", "rb") as f:
        response = client.post("/convert_geojson?crsTarget=foobar", files={"file": f})
        assert response.status_code == 400
        assert response.json() == {"detail": "Invalid target CRS: foobar"}
