# Test file for gltf conversion
from fastapi.testclient import TestClient
from .. import main

client = TestClient(main.app)


def test_gltf_correct():
    with open("./testdata/radnice.gltf", "rb") as f:
        response = client.post(
            "/convert_gltf?crsTarget=EPSG:4326&crsSource=EPSG:5514", files={"file": f}
        )
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/octet-stream"
        assert (
            response.headers["content-disposition"]
            == 'attachment; filename="radnice_epsg4326.gltf"'
        )


def test_gltf_no_target():
    with open("./testdata/radnice.gltf", "rb") as f:
        response = client.post("/convert_gltf?crsSource=EPSG:5514", files={"file": f})
        assert response.status_code == 422


def test_gltf_no_source():
    with open("./testdata/radnice.gltf", "rb") as f:
        response = client.post("/convert_gltf?crsTarget=EPSG:5514", files={"file": f})
        assert response.status_code == 422


def test_gltf_wrong_source():
    with open("./testdata/radnice.gltf", "rb") as f:
        response = client.post(
            "/convert_gltf?crsTarget=EPSG:4326&crsSource=foobar", files={"file": f}
        )
        assert response.status_code == 400
        assert response.json() == {"detail": "Invalid CRS transformation: foobar to EPSG:4326"}

def test_gltf_wrong_target():
    with open("./testdata/radnice.gltf", "rb") as f:
        response = client.post(
            "/convert_gltf?crsTarget=foobar&crsSource=EPSG:5514", files={"file": f}
        )
        assert response.status_code == 400
        assert response.json() == {"detail": "Invalid CRS transformation: EPSG:5514 to foobar"}
