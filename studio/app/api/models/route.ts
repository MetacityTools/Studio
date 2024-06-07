import { createOwnModel } from "@features/models/mutations/createOwnModel";
import { z } from "zod";
import { zfd } from "zod-form-data";

const postSchema = zfd.formData({
  file: zfd.repeatableOfType(zfd.file()),
  name: zfd.text(),
  coordinateSystem: zfd.text().optional(),
});

export async function POST(req: Request) {
  try {
    const data = postSchema.parse(await req.formData());

    const model = await createOwnModel(
      {
        name: data.name,
        coordinateSystem: data.coordinateSystem,
      },
      data.file
    );

    return Response.json(model, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 400 });
    }
    throw e;
  }
}
