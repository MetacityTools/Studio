import { getModelArchive } from "@features/models/queries/getModelArchive";
import mime from "mime";

export async function GET(
  req: Request,
  { params }: { params: { model: string } },
) {
  const fileStream: ReadableStream = await getModelArchive(
    parseInt(params.model),
  );

  return new Response(fileStream, {
    headers: {
      "Content-Type": mime.getType(params.model) ?? "application/octet-stream",
    },
  });
}
