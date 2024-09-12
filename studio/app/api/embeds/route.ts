import { createEmbed } from "@features/embeds/mutations/createEmbed";
import { z } from "zod";
import { zfd } from "zod-form-data";

const postSchema = zfd.formData({
  dataFile: zfd.file(),
  thumbnailFileContents: zfd.text(),
  projectId: zfd.numeric(),
  name: zfd.text(),
});

export async function POST(req: Request) {
  try {
    const data = postSchema.parse(await req.formData());
    const model = await createEmbed(
      data.projectId,
      data.name,
      data.dataFile,
      data.thumbnailFileContents,
    );

    return Response.json(model, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 400 });
    }
    throw e;
  }
}
