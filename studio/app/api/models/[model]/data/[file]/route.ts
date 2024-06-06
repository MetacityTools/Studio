import { downloadOwnModelFile } from "@features/models";
import mime from "mime";
import { Readable } from "stream";

export async function GET(
  req: Request,
  { params }: { params: { model: string; file: string } }
) {
  const fileStream: ReadableStream = Readable.toWeb(
    await downloadOwnModelFile(parseInt(params.model), params.file)
  ) as ReadableStream;

  return new Response(fileStream, {
    headers: {
      "Content-Type": mime.getType(params.model) ?? "application/octet-stream",
    },
  });
}
