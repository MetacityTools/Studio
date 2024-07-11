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
import axios from "axios";
import FormData from "form-data";
import { Readable } from "node:stream";
import * as path from "path";

export async function convertModel(modelId: number, targetEPSG: string) {
  console.debug("Converting model...");

  if (!(await canReadModels())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const modelRepository = await injectRepository(Model);

  const model = await modelRepository.findOne({
    where: { id: modelId, user: { id: user.id } },
  });
  if (!model) throw new Error("Not found");

  const bucketName = getUserModelBucketName(user.id, model.id);

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

  try {
    const params = {
      crsTarget: targetEPSG,
    };
    const headers = {
      ...form.getHeaders(),
    };

    console.log(headers);

    const response = await axios.post(url, form, {
      params,
      headers,
    });

    return `${response.status} ${response.statusText}`;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.log(err.response?.data.detail[0]);
      if (err.response)
        return `${err.response.status} ${err.response.statusText}`;
      else return "502 Bad Gateway";
    }
  }
}
