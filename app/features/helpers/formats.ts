import * as path from "path";

export enum GeoFormat {
  "GLTF" = "GLTF",
  "SHP" = "SHP",
  "GEOJSON" = "GEOJSON",
}

export function recognizeFormatFromFiles(files: string[]) {
  for (const file of files) {
    switch (path.extname(file).toLowerCase()) {
      case ".gltf":
      case ".glb":
        return GeoFormat.GLTF;
      case ".shp":
        return GeoFormat.SHP;
      case ".geojson":
        return GeoFormat.GEOJSON;

      default:
        continue;
    }
  }

  return null;
}
