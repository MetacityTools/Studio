"use server";

import { canReadModels } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Config } from "@features/config";
import { Model } from "@features/db/entities/model";
import { injectRepository } from "@features/db/helpers";
import { GeoFormat, recognizeFormatFromFiles } from "@features/helpers/formats";
import {
  getFilesInBucketAsZip,
  getUserModelBucketName,
  listFilesInBucket,
  readFileStream,
} from "@features/storage";
import { ZipArchive, ZipEntry } from "@shortercode/webzip";
import axios from "axios";
import FormData from "form-data";
import mime from "mime";
import { Readable } from "node:stream";
import * as path from "path";
import { createModel } from "./createModel";

export async function convertModel(modelId: number, targetEPSG: string) {
  console.debug("Converting model...");

  if (!(await canReadModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const oldModel = await modelRepository.findOne({
    where: { id: modelId, user: { id: user.id } },
  });
  if (!oldModel) throw new Error("Not found");

  const bucketName = getUserModelBucketName(user.id, oldModel.id);

  const modelFiles = await listFilesInBucket(bucketName);

  const format = recognizeFormatFromFiles(modelFiles);
  if (!format) throw new Error("Unknown format");

  const form = new FormData();

  let url = Config.converter.endpoint;

  switch (format) {
    case GeoFormat.SHP:
      console.debug("Creating ZIP file");
      const zip = await getFilesInBucketAsZip(bucketName);
      form.append("file", Readable.fromWeb(zip.to_blob().stream() as any), {
        filename: path.parse(modelFiles[0]).name + ".zip",
        contentType: "application/zip",
      });

      url += "/convert_shapefile";
      break;

    case GeoFormat.GLTF:
      form.append("file", await readFileStream(modelFiles[0], bucketName));
      url += "/convert_gltf";
      break;

    case GeoFormat.GEOJSON:
      form.append("file", await readFileStream(modelFiles[0], bucketName));
      url += "/convert_geojson";
      break;
  }

  const params = {
    crsTarget: targetEPSG,
  };
  const headers = {
    ...form.getHeaders(),
  };

  const response = await axios.post(url, form, {
    params,
    headers,
    responseType: "arraybuffer",
  });

  let files: File[] = [];

  switch (format) {
    case GeoFormat.SHP:
      console.debug("Extracting ZIP file");
      const zip = await ZipArchive.from_blob(response.data);
      const zipfiles = zip.files();
      let file: [string, ZipEntry];

      console.debug("Extracting filess");
      while ((file = zipfiles.next().value)) {
        const [name, entry] = file;
        const data = await entry.get_blob();
        files.push(
          new File([data], name, {
            type: mime.getType(name) ?? "application/octet-stream",
          }),
        );
      }

      break;

    case GeoFormat.GLTF:
    case GeoFormat.GEOJSON:
      files.push(
        new File([response.data], modelFiles[0], {
          type: mime.getType(modelFiles[0]) ?? "application/octet-stream",
        }),
      );
      break;
  }

  const newModel = await createModel(
    {
      name: oldModel.name + ` (converted to EPSG-${targetEPSG})`,
      coordinateSystem: targetEPSG,
    },
    files,
  );

  return newModel;
}
