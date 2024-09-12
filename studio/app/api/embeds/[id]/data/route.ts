import getEmbedFile from "@features/embeds/queries/getEmbedFile";
import mime from "mime";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const fileStream: ReadableStream = await getEmbedFile(parseInt(params.id));

  return new Response(fileStream, {
    headers: {
      "Content-Type": mime.getType(params.id) ?? "application/octet-stream",
    },
  });
}
