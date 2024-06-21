import { downloadModelArchive } from "@features/models/queries/downloadModelArchive";
import mime from "mime";

export async function GET(
    req: Request,
    { params }: { params: { model: string} }
  ) {
    const fileStream: ReadableStream = await downloadModelArchive(parseInt(params.model));
  
    return new Response(fileStream, {
      headers: {
        "Content-Type": mime.getType(params.model) ?? "application/octet-stream",
      },
    });
  }