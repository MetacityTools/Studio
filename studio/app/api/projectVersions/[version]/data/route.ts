import getProjectVersionFile from "@features/projects-versions/queries/getProjectVersionFile";
import mime from "mime";

export async function GET(
  req: Request,
  { params }: { params: { version: string } },
) {
  const fileStream: ReadableStream = await getProjectVersionFile(
    parseInt(params.version),
  );

  return new Response(fileStream, {
    headers: {
      "Content-Type":
        mime.getType(params.version) ?? "application/octet-stream",
    },
  });
}
