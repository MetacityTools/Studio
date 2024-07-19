import { createProjectVersion } from "@features/projects-versions/mutations/createProjectVersion";
import { z } from "zod";
import { zfd } from "zod-form-data";

const postSchema = zfd.formData({
  file: zfd.file(),
  projectId: zfd.numeric(),
});

export async function POST(req: Request) {
  try {
    const data = postSchema.parse(await req.formData());
    const model = await createProjectVersion(data.projectId, data.file);

    return Response.json(model, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 400 });
    }
    throw e;
  }
}
