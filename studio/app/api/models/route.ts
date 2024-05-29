import { saveModel } from "@/features/models";
import { Readable } from "node:stream";
import { ReadableStream } from "stream/web";
import { zfd } from "zod-form-data";

const postSchema = zfd.formData({
  file: zfd.file(),
});

export async function POST(req: Request) {
  const data = postSchema.parse(await req.formData());

  const fileStream = Readable.fromWeb(data.file.stream() as ReadableStream);

  await saveModel(fileStream);
}
